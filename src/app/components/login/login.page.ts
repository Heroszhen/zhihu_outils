import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { finalize } from "rxjs";
import { StoreService } from "../../services/store.service";

export type LoginResponse = {
  token: string;
};

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: false,
})
export class LoginPage implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  email = "";
  password = "";
  loading = signal(false);
  private storeService = inject(StoreService);

  ngOnInit() {
    if (this.authService.isLogined()) {
      this.router.navigateByUrl("/", { replaceUrl: true });
    }
  }

  submit() {
    this.loading.set(true);

    this.authService
      .login(this.email, this.password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: async (data: LoginResponse) => {
          localStorage.setItem("token", data.token);
          this.storeService.toastMessage$.next(["Connexion réussite"]);
          this.authService.getProfile();
          this.router.navigateByUrl("/", { replaceUrl: true });
        },
        error: () => {},
      });
  }
}
