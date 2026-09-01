import { Component, OnInit } from '@angular/core';
import { BeforeInstallPromptEvent } from './models/Interfaces';
import { AlertController } from '@ionic/angular/lazy';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
};
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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

  deferredPrompt:BeforeInstallPromptEvent|null = null;

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    window.addEventListener(
      'beforeinstallprompt',
      this.onBeforeInstallPrompt.bind(this)
    );
  }

  onBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
    event?.preventDefault();
    this.deferredPrompt = event;
  }

  async installApp(): Promise<void> {
    if (!this.deferredPrompt) {
      const alert = await this.alertController.create({
        header: 'Installation',
        message: "Sur iphone, vous pouvez passer par 'Sur l'écran d'acceuil', sinon l'application est déjà installée sur votre smartphone",
        buttons: ['OK'],
      });
  
      await alert.present();

      return;
    }
    this.deferredPrompt.prompt();
    const {outcome: outcome, platform:platform} = await this.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      this.deferredPrompt = null;
    }
  }

  reloadApp() {
    window.location.reload();
  }
}
