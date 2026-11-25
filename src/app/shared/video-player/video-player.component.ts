import { Component, computed, effect, ElementRef, HostListener, inject, input, signal, viewChild } from "@angular/core";
import { Video } from "../../models/actress";
import { environment } from "../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
  standalone: true,
  imports: [],
})
export class VideoPlayerComponent {
  video = input.required<Video>();
  index = input.required<number>();
  currentIndex = input.required<number | null>();
  iframeRef = viewChild<ElementRef<HTMLIFrameElement>>("iframe");
  maxWidth = input<number | null>(null);
  protected active = computed(() => this.index() === this.currentIndex());
  private sanitizer = inject(DomSanitizer);
  protected readonly playerUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    environment.videoPlayerService + "/video-player",
  );
  private loaded = signal(false);

  constructor() {
    effect(() => {
      const iframe = this.iframeRef()?.nativeElement;
      if (!iframe || !this.loaded()) return;

      if (this.active()) {
        this.postVideo(iframe);
      } else {
        this.stop();
      }
    });
  }

  private postVideo(iframe: HTMLIFrameElement) {
    iframe.contentWindow?.postMessage(
      {
        type: "READY",
        payload: {
          url: this.video().videoUrl,
          type: this.video().videoType,
          height: Math.round(window.innerHeight),
          maxWidth: this.maxWidth() ?? Math.round(window.innerWidth - 5),
          needFullHeight: true,
        },
      },
      environment.videoPlayerService,
    );
  }

  @HostListener("window:message", ["$event"])
  onMessage(event: MessageEvent): void {
    const iframe = this.iframeRef()?.nativeElement;
    if (!iframe || event.origin !== environment.videoPlayerService) return;
    if (event.source !== iframe.contentWindow) return;

    if (event.data?.type === "PLAYER_LOADED") {
      this.loaded.set(true);
      return;
    }

    if (event.data?.type === "RESIZE") {
      iframe.style.height = event.data.payload.videoHeight + "px";
    }
  }

  stop(): void {
    this.iframeRef()?.nativeElement.contentWindow?.postMessage({ type: "STOP" }, environment.videoPlayerService);
  }

  play(): void {
    const iframe = this.iframeRef()?.nativeElement;
    if (iframe && this.loaded()) {
      this.postVideo(iframe);
    }
  }
}
