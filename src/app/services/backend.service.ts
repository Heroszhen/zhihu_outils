import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BackendService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }
  /*
  sendMessage(query: Message) {
    return this.http.post(this.baseUrl + "/email/gmail_portefolio", JSON.stringify(query));
  }*/
}
