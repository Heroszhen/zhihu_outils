import { Component, ElementRef, inject, OnInit, signal, viewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { finalize } from "rxjs";
import { StoreService } from "../../services/store.service";
import { environment } from "../../../environments/environment";

export type LoginResponse = {
  token: string;
};

declare const google: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: false,
})
export class LoginPage implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private storeService = inject(StoreService);
  email = "";
  password = "";
  loading = signal(false);
  googleButton = viewChild.required<ElementRef<HTMLElement>>("googleButton");

  ngOnInit() {
    if (this.authService.isLogined()) {
      this.router.navigateByUrl("/", { replaceUrl: true });
    }
  }

  ionViewDidEnter(): void {
    this.initGoogle();
  }

  private initGoogle(): void {
    if (typeof google === "undefined") {
      setTimeout(() => this.initGoogle(), 200);
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => this.sendGoogleCredential(response.credential),
    });

    const container = this.googleButton().nativeElement;

    google.accounts.id.renderButton(container, {
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      locale: "fr",
      width: Math.min(container.clientWidth, 400),
    });
  }

  setLoginToken(token: string) {
    localStorage.setItem("token", token);
    this.storeService.toastMessage$.next(["Connexion réussite"]);
    this.authService.getProfile();
    this.router.navigateByUrl("/", { replaceUrl: true });
  }

  sendGoogleCredential(credential: string) {
    this.storeService.loaderMessage$.next(["Connexion en cours..."]);
    this.authService
      .sendGoogleCredential(credential)
      .pipe(finalize(() => this.storeService.loaderMessage$.next([null])))
      .subscribe({
        next: async (data: LoginResponse) => {
          this.setLoginToken(data.token);
        },
        error: () => {},
      });
  }

  submit() {
    this.loading.set(true);

    this.authService
      .login(this.email, this.password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: async (data: LoginResponse) => {
          this.setLoginToken(data.token);
        },
        error: () => {},
      });
  }
}
