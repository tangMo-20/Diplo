import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GoodsListHeaderComponent } from './components/goods-list/goods-list-header/goods-list-header.component';
import { GoodsListContComponent } from './components/goods-list/goods-list-cont/goods-list-cont.component';
import { GoodItemComponent } from './components/goods-list/good-item/good-item.component';

@NgModule({
  declarations: [
    AppComponent,
    GoodsListHeaderComponent,
    GoodsListContComponent,
    GoodItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
