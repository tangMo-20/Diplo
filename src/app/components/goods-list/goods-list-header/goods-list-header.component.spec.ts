import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsListHeaderComponent } from './goods-list-header.component';

describe('GoodsListHeaderComponent', () => {
  let component: GoodsListHeaderComponent;
  let fixture: ComponentFixture<GoodsListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
