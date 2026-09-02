import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export abstract class BaseService {
  protected baseUrl = environment.baseUrl;

  constructor(protected http: HttpClient) {}
}
