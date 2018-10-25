import {Component, OnInit} from '@angular/core';
import {GoodsModel} from 'src/app/models/goods.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  time = 0;
  goods: Array<GoodsModel> = [];

  constructor() {

  }

  ngOnInit() {
    this.generateGoods();
    this.mainLoop();
  }

  mainLoop() {
    while (this.time < 100) {


      this.time++;
    }
  }

  generateGoods() {
    let i = 0;
    while(i < 10){
      this.goods[i] = new GoodsModel();
      this.goods[i].Id = i.toString();
      this.goods[i].Name = "Good number " + (i + 1);
      this.goods[i].Cost = Math.floor(Math.random() * 1000) + 1;
      this.goods[i].ShelfLife = Math.floor(Math.random() * 100) + 1;
      this.goods[i].Quantity = Math.floor(Math.random() * 100) + 1;
      this.goods[i].BuyPerDay = Math.floor(Math.random() * 10);
      this.goods[i].a = Math.floor(Math.random() * 10);
      i++;
    }
    console.log(this.goods);
  }

}
