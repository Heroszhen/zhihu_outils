import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActressesPage } from "./actresses.page";

describe("ActressesPage", () => {
  let component: ActressesPage;
  let fixture: ComponentFixture<ActressesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActressesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
