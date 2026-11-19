import { inject, Service } from "@angular/core";
import { BaseService } from "./base.service";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginResponse } from "../components/login/login.page";
import { Profile } from "../models/actress";
import { NavController } from "@ionic/angular/common";

@Service()
export class AuthService extends BaseService {
  user$ = new BehaviorSubject<Array<Profile | null>>([null]);
  private navCtrl = inject(NavController);

  isLogined(): boolean {
    const token = localStorage.getItem("token");
    return !!token && token.trim() !== "";
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + "/login_check", { username: email, password: password });
  }

  getProfile() {
    this.http.get<Profile>(this.baseUrl + "/users/profile", this.refreshHttpOptions()).subscribe({
      next: (data: Profile) => {
        this.user$.next([data]);
      },
    });
  }

  logout() {
    localStorage.removeItem("token");
    this.user$.next([null]);
    this.navCtrl.navigateRoot("/login", { replaceUrl: true });
  }

  sendGoogleCredential(credential: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + "/login/google", { credential: credential });
  }
}
