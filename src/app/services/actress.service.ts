import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { CollectionResponse, Profile, UserRole, Video } from "../models/actress";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ActressService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getVideos(
    profile: Profile,
    params: Record<string, string | number> | null = null,
  ): Observable<CollectionResponse<Video>> {
    return this.http.get<CollectionResponse<Video>>(
      this.baseUrl + `${profile.roles.includes(UserRole.ADMIN) ? "/admin" : ""}/videos`,
      { ...this.refreshHttpOptions(), params: params ?? {} },
    );
  }
}
