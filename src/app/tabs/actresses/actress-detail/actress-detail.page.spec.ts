import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActressDetailPage } from "./actress-detail.page";

describe("ActressDetailPage", () => {
  let component: ActressDetailPage;
  let fixture: ComponentFixture<ActressDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActressDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
