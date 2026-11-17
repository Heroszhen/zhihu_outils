import { Component, DestroyRef, HostListener, inject, OnInit, signal, viewChildren } from "@angular/core";
import { ActressService } from "../../services/actress.service";
import { AuthService } from "../../services/auth.service";
import { CollectionResponse, Profile, Video } from "../../models/actress";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

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
  private sanitizer = inject(DomSanitizer);
  protected readonly playerUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    environment.videoPlayerService + "/video-player",
  );
  protected page = 1;
  private currentIframe: HTMLIFrameElement | null = null;
  private canLoadVideos: boolean = true;
  private hasMore: boolean = true;
  protected videoIndex: number = 0;

  ngOnInit() {
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: Array<Profile | null>) => {
      if (data[0] !== null) this.getVideos({ page: this.page });
    });
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
    const slide = section.children[index] as HTMLElement;

    if (this.videos().length - index <= 3 && this.canLoadVideos && this.hasMore) {
      this.page++;
      this.getVideos({ page: this.page });
    }

    const player = slide.querySelector("iframe");
    if (player === this.currentIframe) return; // même slide : on ne touche à rien

    this.videoIndex = index;

    // on change de slide : arrête la vidéo précédente
    this.currentIframe?.contentWindow?.postMessage({ type: "STOP" }, environment.videoPlayerService);
    this.currentIframe = player;

    if (player) {
      this.postVideo(player, this.videos()[index]);
    }
  }

  onPlayerLoad(event: Event, index: number): void {
    if (index !== 0) return;

    this.currentIframe = event.target as HTMLIFrameElement;
    this.postVideo(this.currentIframe, this.videos()[0]);
  }

  private postVideo(iframe: HTMLIFrameElement, video: Video) {
    iframe.contentWindow?.postMessage(
      {
        type: "READY",
        payload: {
          url: video.videoUrl,
          type: video.videoType,
          height: Math.round(window.innerHeight),
          maxWidth: Math.round(iframe.parentElement?.clientWidth ?? window.innerWidth),
          needFullHeight: true,
        },
      },
      environment.videoPlayerService,
    );
  }

  @HostListener("window:message", ["$event"])
  onMessage(event: MessageEvent): void {
    if (event.origin !== environment.videoPlayerService) return;

    if (this.currentIframe === null) return;
    if (event.source !== this.currentIframe.contentWindow) return;

    const data = event.data;
    if (data?.type === "RESIZE") {
      this.currentIframe.style.height = data.payload.videoHeight + "px";
    }
  }

  ionViewWillLeave(): void {
    this.currentIframe?.contentWindow?.postMessage({ type: "STOP" }, environment.videoPlayerService);
  }

  ionViewDidEnter(): void {
    if (this.currentIframe === null) return;

    const slide = this.currentIframe.closest(".slide");
    const index = Array.from(slide?.parentElement?.children ?? []).indexOf(slide as Element);
    this.postVideo(this.currentIframe, this.videos()[index]);
  }
}
