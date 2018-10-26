import {Component, OnInit} from '@angular/core';
import {GoodsModel} from 'src/app/models/goods.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  day = 0;
  goods: Array<GoodsModel> = [];
  profit = 0;

  constructor() {

  }

  ngOnInit() {
    this.generateGoods();
    // this.mainLoop();
  }

  mainLoop() {
    while (this.day < 10) {
      // TODO: Реализовать сравнение текущей прибыли и ожидаемой
      console.log('|-*-| День ' + this.day + ' |-*-|');
      let good_number = 0;
      while (good_number < this.goods.length - 1) {
        // Первоначальная проверка на валидность
        if (this.goods[good_number].isValid) {


          // Проверка количества товара (наличие на складе, наличие в зале)
          // Проверка наличия товара
          if (this.goods[good_number].Quantity > 0) {
            // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
            // при условии, что товара в зале хватит для покупок на день
            if (
              this.goods[good_number].Quantity >= this.goods[good_number].OnShelfAmount &&
              this.goods[good_number].OnShelfAmount >= this.goods[good_number].BuyPerDay
            ) {
              this.goods[good_number].Quantity -= this.goods[good_number].BuyPerDay;
              this.profit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
            }
            // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
            // при условии, что потребности в товаре будет больше, чем есть на полках
            else if (
              this.goods[good_number].Quantity >= this.goods[good_number].OnShelfAmount &&
              this.goods[good_number].OnShelfAmount < this.goods[good_number].BuyPerDay
            ) {
              this.goods[good_number].Quantity -= this.goods[good_number].OnShelfAmount;
              this.profit += this.goods[good_number].OnShelfAmount * this.goods[good_number].Cost;
            }
            // Ситуация, когда товара со склада недостаточно, чтобы заполнить все полки в зале
            else if (this.goods[good_number].Quantity < this.goods[good_number].OnShelfAmount) {
              // Ситуация, когда товара со склада больше, чем потребности в товаре
              if (this.goods[good_number].Quantity > this.goods[good_number].BuyPerDay) {
                this.goods[good_number].Quantity -= this.goods[good_number].BuyPerDay;
                this.profit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
              }
              // Ситуация, когда товара со склада меньше, чем потребности в товаре
              else if (this.goods[good_number].Quantity < this.goods[good_number].BuyPerDay){
                this.profit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
                this.goods[good_number].Quantity = 0;
              }
            }
          } else {
            this.goods[good_number].isValid = false;
            this.goods[good_number].notValidReason = 'Товар закончился';
            console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + this.goods[good_number].Name + ' закончился');
            // TODO: Рекомендации по корректировке поставок товара ( поставлять больше )
            good_number++;
            continue;
          }

          // Проверка по сроку годность партии товара
          // TODO: Заранее предупреждать об истекании срока годности товара
          if (this.goods[good_number].ShelfLife > 1) {
            this.goods[good_number].ShelfLife--;
          } else {
            this.goods[good_number].isValid = false;
            this.goods[good_number].notValidReason = 'Партия просрочена';
            console.log('|*|ПРОСРОЧЕН|*| Партия товара ' + this.goods[good_number].Name
              + 'в количестве ' + this.goods[good_number].Quantity + 'просрочилась');
            console.log('|*|ПРОСРОЧЕН|*| Потери в прибыли составили ' + this.goods[good_number].Quantity * this.goods[good_number].Cost);
            // TODO: Рекомендации по корректировке поставок товара ( поставлять меньше )
            good_number++;
            continue;
          }
          good_number++;
        } else {
          console.log('|*|НЕВАЛИДНЫЙ|*| Партия товара ' + this.goods[good_number].Name
            + 'невалидна по причине - ' + this.goods[good_number].notValidReason);
          good_number++;
        }
      }

      this.day++;
    }
  }

  generateGoods() {
    let i = 0;
    while (i < 10) {
      this.goods[i] = new GoodsModel();
      this.goods[i].Id = (i + 1).toString();
      this.goods[i].Name = 'Good number ' + (i + 1);
      this.goods[i].Cost = Math.floor(Math.random() * 1000) + 1;
      this.goods[i].ShelfLife = Math.floor(Math.random() * 10) + 1;
      this.goods[i].Quantity = Math.floor(Math.random() * 100) + 1;
      this.goods[i].BuyPerDay = Math.floor(Math.random() * 10);
      this.goods[i].OnShelfAmount = Math.floor(Math.random() * 10) + 1;
      this.goods[i].isValid = true;
      this.goods[i].notValidReason = '-';
      i++;
    }
    console.log(this.goods);
  }

}
