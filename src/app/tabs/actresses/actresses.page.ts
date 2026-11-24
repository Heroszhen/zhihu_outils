import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { ActressService } from "../../services/actress.service";
import { Actress, CollectionResponse } from "../../models/actress";
import { debounceTime, distinctUntilChanged, finalize, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { InfiniteScrollCustomEvent } from "@ionic/angular/lazy";
import { FormBuilder } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-actresses",
  templateUrl: "./actresses.page.html",
  styleUrls: ["./actresses.page.scss"],
  standalone: false,
})
export class ActressesPage implements OnInit {
  private readonly apiService = inject(ActressService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly storeService = inject(StoreService);

  protected readonly s3Url = environment.s3Url;
  protected readonly s3Root = environment.s3Root;
  actresses = signal<Actress[]>([]);
  private page: number = 0;
  private canLoad: boolean = true;
  hasMore = signal<boolean>(true);
  countries = signal<string[]>([]);
  actressSearchForm = this.fb.nonNullable.group({
    name: [""],
    countries: [[] as string[]],
  });

  ngOnInit() {
    this.getActresses();
    this.getCountries();

    this.actressSearchForm.controls.name.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page = 0;
        this.getActresses();
      });
  }

  private getCountries() {
    this.apiService
      .getActressesCountries()
      .pipe(map((countries: string[]) => countries.sort((a, b) => a.localeCompare(b, "fr"))))
      .subscribe({
        next: (data: string[]) => {
          this.countries.set(data);
        },
        error: () => {},
      });
  }

  private getActresses(event?: InfiniteScrollCustomEvent) {
    this.canLoad = false;
    this.hasMore.set(true);
    this.storeService.loaderMessage$.next(["Chargement en cours..."]);

    const params: Record<string, string | string[] | number> = { page: this.page + 1 };
    params["search[name]"] = this.actressSearchForm.value.name ?? "";
    const countries = this.actressSearchForm.value.countries;
    if (Array.isArray(countries) && countries.length > 0) {
      params["country[]"] = countries;
    }

    this.apiService
      .getActressesList(params)
      .pipe(map((response: CollectionResponse<Actress>) => response.member))
      .pipe(
        finalize(() => {
          this.canLoad = true;
          event?.target.complete();
          this.storeService.loaderMessage$.next([null]);
        }),
      )
      .subscribe({
        next: (data: Actress[]) => {
          if (data.length === 0) {
            this.hasMore.set(false);
            if (this.page === 0) this.actresses.set([]);
          } else {
            if (this.page === 0) this.actresses.set(data);
            else this.actresses.update((actresses) => [...actresses, ...data]);
            this.page++;
          }
        },
        error: () => {},
      });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (!this.hasMore() || !this.canLoad) {
      event.target.complete();
      return;
    }
    setTimeout(() => {
      this.getActresses(event);
    }, 500);
  }

  toggleCountry(country: string) {
    const control = this.actressSearchForm.controls.countries;
    const selected = control.value;

    control.setValue(selected.includes(country) ? selected.filter((c) => c !== country) : [...selected, country]);

    this.page = 0;
    this.getActresses();
  }

  isCountrySelected(country: string): boolean {
    return this.actressSearchForm.controls.countries.value.includes(country);
  }
}
