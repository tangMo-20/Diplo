import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsListContComponent } from './goods-list-cont.component';

describe('GoodsListContComponent', () => {
  let component: GoodsListContComponent;
  let fixture: ComponentFixture<GoodsListContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsListContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsListContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
