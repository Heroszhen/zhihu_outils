import { Component, DestroyRef, HostListener, inject, OnInit, signal, viewChildren } from "@angular/core";
import { ActressService } from "../../services/actress.service";
import { AuthService } from "../../services/auth.service";
import { ActressName, Category, CollectionResponse, Profile, Video } from "../../models/actress";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { VideoPlayerComponent } from "../../shared/video-player/video-player.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UserRole } from "../../models/actress";

@Component({
  selector: "app-videos",
  templateUrl: "./videos.page.html",
  styleUrls: ["./videos.page.scss"],
  standalone: false,
})
export class VideosPage implements OnInit {
  private apiService = inject(ActressService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  videos = signal<Video[]>([]);
  protected readonly s3Url = environment.s3Url;
  protected readonly s3Root = environment.s3Root;
  protected page = 1;
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
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: Array<Profile | null>) => {
      if (data[0] !== null) {
        this.profile.set(data[0]);
        this.getVideos({ ...this.videoSearchParams, page: this.page });
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

  getVideos(params: Record<string, string | boolean | string[] | number> | null = null) {
    if (!this.canLoadVideos || !this.hasMore) return;

    const profile = this.authService.user$.getValue()[0];
    if (profile === null) return;

    this.canLoadVideos = false;

    this.apiService
      .getVideos(profile, params)
      .pipe(map((response: CollectionResponse<Video>) => response.member))
      .pipe(finalize(() => (this.canLoadVideos = true)))
      .subscribe({
        next: (data: Video[]) => {
          if (data.length === 0) this.hasMore = false;
          else this.videos.update((videos) => [...videos, ...data]);
        },
        error: () => {},
      });
  }

  onScrollEnd(event: Event): void {
    const section = event.target as HTMLElement;
    const index = Math.round(section.scrollTop / section.clientHeight);

    if (this.videos().length - index <= 3 && this.canLoadVideos && this.hasMore) {
      this.page++;
      this.getVideos({ ...this.videoSearchParams, page: this.page });
    }

    this.videoIndex.set(index);
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
      this.getVideos(this.videoSearchParams);
      this.toggleModal(false);
    }
  }
}
