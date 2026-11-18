import { Component, DestroyRef, HostListener, inject, OnInit, signal, viewChildren } from "@angular/core";
import { ActressService } from "../../services/actress.service";
import { AuthService } from "../../services/auth.service";
import { CollectionResponse, Profile, Video } from "../../models/actress";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { VideoPlayerComponent } from "../../shared/video-player/video-player.component";

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
  videos = signal<Video[]>([]);
  protected readonly s3Url = environment.s3Url;
  protected readonly s3Root = environment.s3Root;
  protected page = 1;
  private canLoadVideos: boolean = true;
  private hasMore: boolean = true;
  videoIndex = signal<number | null>(0);
  private lastIndex = 0;
  private players = viewChildren(VideoPlayerComponent);

  ngOnInit() {
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: Array<Profile | null>) => {
      if (data[0] !== null) this.getVideos({ page: this.page });
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

  getVideos(params: Record<string, string | number> | null = null) {
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
      this.getVideos({ page: this.page });
    }

    this.videoIndex.set(index);
  }
}
