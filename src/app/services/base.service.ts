import { inject, Service } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Service()
export abstract class BaseService {
  protected baseUrl = environment.baseUrl;
  protected http = inject(HttpClient);

  refreshHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      }),
    };
  }
}
