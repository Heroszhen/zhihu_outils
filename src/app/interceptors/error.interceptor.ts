import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { ToastController } from "@ionic/angular/lazy";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastController = inject(ToastController);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.endsWith("/login_check")) {
        authService.logout();
      }

      const message = error.error?.message ?? error.error?.detail ?? "Une erreur est survenue";

      toastController
        .create({ message, duration: 2000, position: "bottom", color: "danger" })
        .then((toast) => toast.present());

      return throwError(() => error);
    }),
  );
};
