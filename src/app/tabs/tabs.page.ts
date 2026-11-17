import { Component, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"],
  standalone: false,
})
export class TabsPage implements OnInit {
  private router = inject(Router);

  hideTabBar = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.startsWith("/tabs/videos")),
    ),
    { initialValue: this.router.url.startsWith("/tabs/videos") },
  );
  ngOnInit() {}
}
