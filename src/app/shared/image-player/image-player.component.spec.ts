import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular/lazy";

import { ImagePlayerComponent } from "./image-player.component";

describe("ImagePlayerComponent", () => {
  let component: ImagePlayerComponent;
  let fixture: ComponentFixture<ImagePlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagePlayerComponent],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(ImagePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
