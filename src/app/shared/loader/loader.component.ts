import { Component, inject, OnInit, signal } from "@angular/core";
import { StoreService } from "../../services/store.service";
import { IonicModule } from "@ionic/angular/lazy";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  standalone: true,
  imports: [IonicModule]
})
export class LoaderComponent implements OnInit {
  private storeService = inject(StoreService);
  loaderMessage = signal<string|null>(null);

  ngOnInit() {
    this.storeService.loaderMessage$.subscribe((data:Array<string | null>) => {
      this.loaderMessage.set(data[0]);
    })
  }
}
