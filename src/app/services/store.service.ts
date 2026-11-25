import { Service } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Service()
export class StoreService {
  toastMessage$ = new BehaviorSubject<Array<string | null>>([null]);
  loaderMessage$ = new BehaviorSubject<Array<string | null>>([null]);
  bigImageUrl$ = new BehaviorSubject<Array<string | null>>([null]);
}
