import { afterNextRender, Component, DestroyRef, ElementRef, HostListener, inject, Injector, OnInit, signal, viewChild, viewChildren } from "@angular/core";
import { ActressService } from "../../services/actress.service";
import { AuthService } from "../../services/auth.service";
import { ActressName, Category, CollectionResponse, Profile, Video } from "../../models/actress";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, lastValueFrom, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { VideoPlayerComponent } from "../../shared/video-player/video-player.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UserRole } from "../../models/actress";
import { StoreService } from "../../services/store.service";
import { AlertController } from "@ionic/angular/lazy";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { ActressVideo } from "../../models/ActressVideo";

@Component({
  selector: "app-videos",
  templateUrl: "./videos.page.html",
  styleUrls: ["./videos.page.scss"],
  standalone: false,
})
export class VideosPage implements OnInit {
  private readonly apiService = inject(ActressService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly alertController = inject(AlertController);
  private dbService = inject(NgxIndexedDBService);
  private feed = viewChild<ElementRef<HTMLElement>>("feed");
  private injector = inject(Injector);

  videos = signal<Video[]>([]);
  protected readonly s3Url = environment.s3Url;
  protected readonly s3Root = environment.s3Root;
  private readonly storeService = inject(StoreService);
  protected page:number = 1;
  private canLoadVideos: boolean = true;
  private hasMore: boolean = true;
  videoIndex = signal<number | null>(0);
  private lastIndex = 0;
  private players = viewChildren(VideoPlayerComponent);
  videoSearchForm: FormGroup | null = null;
  profile = signal<Profile | null>(null);
  actressesName = signal<ActressName[]>([]);
  categories = signal<Category[]>([]);
  isModalOpen: boolean = false;
  readonly UserRole = UserRole;
  videoSearchParams: Record<string, string | boolean | string[] | number> = { page: this.page };

  ngOnInit() {
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (data: Array<Profile | null>) => {
      if (data[0] !== null) {
        this.profile.set(data[0]);

        const alert = await this.alertController.create({
          header: "Voulez-vous recharger les videos que vous avez regardées précédemment?",
          buttons: [
            { text: "Non", role: "0" },
            { text: "OK", role: "1" },
          ],
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();

        if (role === '1') {
          const result = await lastValueFrom(this.dbService.getByID<ActressVideo>(ActressVideo.tableName, '1'));
          if (result) {
            this.videos.set(result.videos);
            this.videoIndex.set(result.videoIndex);
            this.videoSearchParams = result.filters
            this.page = Number(result.filters["page"] ?? 1);
            afterNextRender(() => {
              const section = this.feed()?.nativeElement;
              if (section) section.scrollTop = (this.videoIndex() ?? 0) * section.clientHeight;
            }, { injector: this.injector });
          } else {
            this.getVideos({ ...this.videoSearchParams, page: this.page }, "Chargement en cours...");
          }
        } else {
          this.getVideos({ ...this.videoSearchParams, page: this.page }, "Chargement en cours...");
        }
        
        this.getActressesName();
        if (this.profile()?.roles.includes(UserRole.ADMIN)) {
          this.getCategories();
        }
      }
    });

    this.videoSearchForm = this.fb.group({
      title: [null as string | null],
      categories: [[] as string[]],
      actress: [null as string | null],
      createdAt: ["desc" as "asc" | "desc"],
      needJasmine: [null as boolean | null],
    });
  }

  ionViewDidEnter(): void {
    this.videoIndex.set(this.lastIndex);
    this.players().find((player) => player.index() === this.lastIndex)?.play();
  }

  ionViewWillLeave(): void {
    this.lastIndex = this.videoIndex() ?? 0;
    const index = this.videoIndex();
    this.players()
      .find((player) => player.index() === index)
      ?.stop();
    this.videoIndex.set(null);
  }

  getActressesName() {
    this.apiService
      .getActressesName()
      .pipe(map((response: CollectionResponse<ActressName>) => response.member))
      .subscribe({
        next: (data: ActressName[]) => {
          this.actressesName.set(data);
        },
        error: () => {},
      });
  }

  getCategories() {
    this.apiService
      .getCategories()
      .pipe(map((response: CollectionResponse<Category>) => response.member))
      .subscribe({
        next: (data: Category[]) => {
          this.categories.set(data);
        },
        error: () => {},
      });
  }

  getVideos(
    params: Record<string, string | boolean | string[] | number> | null = null, 
    loaderMessage: string|null = null
  ) {
    if (!this.canLoadVideos || !this.hasMore) return;

    const profile = this.authService.user$.getValue()[0];
    if (profile === null) return;

    this.canLoadVideos = false;

    if (loaderMessage !== null) this.storeService.loaderMessage$.next([loaderMessage]);

    this.apiService
      .getVideos(profile, params)
      .pipe(map((response: CollectionResponse<Video>) => response.member))
      .pipe(finalize(() => {
        this.canLoadVideos = true;
        this.storeService.loaderMessage$.next([null])
      }))
      .subscribe({
        next: (data: Video[]) => {
          if (data.length === 0) {
            this.hasMore = false;
          } else {
            this.videos.update((videos) => [...videos, ...data]);
            this.storeVideos(this.videos(), params)
          }
        },
        error: () => {},
      });
  }

  async onScrollEnd(event: Event): Promise<void> {
    const section = event.target as HTMLElement;
    const index = Math.round(section.scrollTop / section.clientHeight);

    if (this.videos().length - index <= 3 && this.canLoadVideos && this.hasMore) {
      this.page++;
      this.getVideos({ ...this.videoSearchParams, page: this.page });
    }

    this.videoIndex.set(index);

    await this.storeVideos(this.videos(), {...this.videoSearchParams, page: this.page});
  }

  toggleModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  sendSearchForm() {
    const form = this.videoSearchForm?.value;
    const query: Record<string, string | boolean | string[] | number> = {};

    if (this.profile()?.roles.includes(UserRole.ADMIN) && form.needJasmine === true) {
      query["needJasmine"] = true;
    } else {
      if (form.title) query["search[title]"] = form.title;
      if (form.actress) query["search[actress.name]"] = form.actress;
      if (form.categories?.length) query["categories[]"] = form.categories;
    }
    query["order[createdAt]"] = form.createdAt;

    if (this.canLoadVideos) {
      this.hasMore = true;
      this.videos.set([]);
      this.videoIndex.set(0);
      this.page = 1;
      this.videoSearchParams = { ...query, page: this.page };
      this.toggleModal(false);
      this.getVideos(this.videoSearchParams, "Chargement en cours...");
    }
  }

  private async storeVideos(videos: Video[], searchParams:  Record<string, string | boolean | string[] | number> |null) {
    const av = new ActressVideo();
    av.assignData({
      id: '1',
      videos: videos,
      videoIndex: this.videoIndex() ?? 0,
      filters: searchParams ?? {}
    });
    await lastValueFrom(
      this.dbService.update<ActressVideo>(ActressVideo.tableName, av),
    );
  }
}
