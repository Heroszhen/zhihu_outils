import { Component, inject, OnInit, signal } from "@angular/core";
import { BeforeInstallPromptEvent } from "./models/Interfaces";
import { AlertController, ToastController } from "@ionic/angular/lazy";
import { AuthService } from "./services/auth.service";
import { StoreService } from "./services/store.service";

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: false,
})
export class AppComponent implements OnInit {
  /*
  protected readonly appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ]; 
  protected readonly labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  */

  protected authService = inject(AuthService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  deferredPrompt: BeforeInstallPromptEvent | null = null;
  private storeService = inject(StoreService);
  protected bigImageUrl = signal<string | null>(null);

  ngOnInit() {
    if (this.authService.isLogined()) {
      this.authService.getProfile();
    }

    this.storeService.toastMessage$.subscribe(async (data: Array<string | null>) => {
      if (data[0]) {
        (
          await this.toastController.create({
            message: data[0],
            duration: 1000,
            position: "top",
          })
        ).present();
        this.storeService.toastMessage$.next([null]);
      }
    });

    this.storeService.bigImageUrl$.subscribe((data: Array<string | null>) => {
      this.bigImageUrl.set(data[0]);
    });

    window.addEventListener("beforeinstallprompt", this.onBeforeInstallPrompt.bind(this));
  }

  onBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
    event?.preventDefault();
    this.deferredPrompt = event;
  }

  async installApp(): Promise<void> {
    if (!this.deferredPrompt) {
      const alert = await this.alertController.create({
        header: "Installation",
        message:
          "Sur iphone, vous pouvez passer par 'Sur l'écran d'acceuil', sinon l'application est déjà installée sur votre smartphone",
        buttons: ["OK"],
      });

      await alert.present();

      return;
    }
    this.deferredPrompt.prompt();
    const { outcome: outcome, platform: platform } = await this.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      this.deferredPrompt = null;
    }
  }

  reloadApp() {
    window.location.reload();
  }
}
