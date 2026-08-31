import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZhihuPage } from './zhihu.page';

describe('ZhihuPage', () => {
  let component: ZhihuPage;
  let fixture: ComponentFixture<ZhihuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhihuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
