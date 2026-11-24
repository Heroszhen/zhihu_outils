import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Actress, ActressName, Category, CollectionResponse, Profile, UserRole, Video } from "../models/actress";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ActressService extends BaseService {
  //video
  getVideos(
    profile: Profile,
    params: Record<string, string | boolean | string[] | number> | null = null,
  ): Observable<CollectionResponse<Video>> {
    let route = "";
    if (profile.roles.includes(UserRole.ADMIN)) {
      if (params?.["needJasmine"]) {
        route = "/admin/videos/jasmine";
      } else {
        route = "/admin/videos";
      }
    } else {
      route = "/videos";
    }
    return this.http.get<CollectionResponse<Video>>(this.baseUrl + route, {
      ...this.refreshHttpOptions(),
      params: params ?? {},
    });
  }

  //actress
  getActressesName(): Observable<CollectionResponse<ActressName>> {
    return this.http.get<CollectionResponse<ActressName>>(this.baseUrl + `/actresses/name`, this.refreshHttpOptions());
  }

  getActressesList(params: Record<string, string | string[] | number> = {}): Observable<CollectionResponse<Actress>> {
    return this.http.get<CollectionResponse<Actress>>(this.baseUrl + "/actresses/list", {
      ...this.refreshHttpOptions(),
      params: params,
    });
  }

  getActressesCountries(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + "/actresses/countries", this.refreshHttpOptions());
  }

  //category
  getCategories() {
    return this.http.get<CollectionResponse<Category>>(this.baseUrl + `/categories`, this.refreshHttpOptions());
  }
}
