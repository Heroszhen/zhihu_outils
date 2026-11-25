import { Component, inject, input } from "@angular/core";
import { IonicModule } from "@ionic/angular/lazy";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-image-player",
  templateUrl: "./image-player.component.html",
  styleUrls: ["./image-player.component.scss"],
  standalone: true,
  imports: [IonicModule],
})
export class ImagePlayerComponent {
  url = input.required<string | null>();
  private storeService = inject(StoreService);

  closeBigImage() {
    this.storeService.bigImageUrl$.next([null]);
  }
}
