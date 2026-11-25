import { Component, inject, input, OnInit, signal } from "@angular/core";
import { ActressService } from "../../../services/actress.service";
import { ActressDetail } from "../../../models/actress";
import { environment } from "../../../../environments/environment";
import { StoreService } from "../../../services/store.service";

@Component({
  selector: "app-actress-detail",
  templateUrl: "./actress-detail.page.html",
  styleUrls: ["./actress-detail.page.scss"],
  standalone: false,
})
export class ActressDetailPage implements OnInit {
  private readonly apiService = inject(ActressService);
  private storeService = inject(StoreService);

  readonly id = input.required<string>();
  actressDetail = signal<ActressDetail | null>(null);
  protected readonly s3Url = environment.s3Url;
  protected readonly s3Root = environment.s3Root;
  protected showVideo = signal<boolean>(false);
  protected videoIndex = signal<number | null>(null);
  isModalOpen = false;
  maxVideoWidth = Math.round(window.innerWidth - 20);

  ngOnInit() {
    this.apiService.getActressDetail(this.id()).subscribe({
      next: (data: ActressDetail) => {
        this.actressDetail.set(data);
      },
      error: () => {},
    });
  }

  showBigImage(url: string) {
    this.storeService.bigImageUrl$.next([url]);
  }

  openVideo(index: number) {
    const video = this.actressDetail()?.videos[index];
    if (!video) return;

    if (video.videoType === "extern") {
      window.open(video.website, "_blank", "noopener");
      return;
    }

    this.videoIndex.set(index);
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
