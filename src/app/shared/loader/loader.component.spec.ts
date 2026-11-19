import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular/lazy";

import { LoaderComponent } from "./loader.component";

describe("LoaderComponent", () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
