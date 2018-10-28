import {Component, OnInit} from '@angular/core';
import {GoodsModel} from 'src/app/models/goods.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  day = 1;
  goods: Array<GoodsModel> = [];
  profit = 0;
  fullExpectedProfit = 0;
  currentProfit: Array<number> = [];
  expectedProfit = 0;

  constructor() {

  }

  ngOnInit() {
    this.generateGoods();
    this.mainLoop();
  }

  mainLoop() {
    while (this.day <= 5) {
      // TODO: Реализовать сравнение текущей прибыли и ожидаемой
      console.log('|-*-| День ' + this.day + ' |-*-|');
      let good_number = 0;
      while(good_number < this.goods.length){
        // Вычисление полной ожидаемой прибыли
        this.fullExpectedProfit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
        good_number++;
      }
      good_number = 0;
      while (good_number < this.goods.length) {
        // Вычисление ожидаемой прибыли для конкретного товара
        this.expectedProfit = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
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
              this.currentProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
              this.profit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
            }
            // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
            // при условии, что потребности в товаре будет больше, чем есть на полках
            else if (
              this.goods[good_number].Quantity >= this.goods[good_number].OnShelfAmount &&
              this.goods[good_number].OnShelfAmount < this.goods[good_number].BuyPerDay
            ) {
              this.goods[good_number].Quantity -= this.goods[good_number].OnShelfAmount;
              this.currentProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
              this.profit += this.goods[good_number].OnShelfAmount * this.goods[good_number].Cost;
            }
            // Ситуация, когда товара со склада недостаточно, чтобы заполнить все полки в зале
            else if (this.goods[good_number].Quantity < this.goods[good_number].OnShelfAmount) {
              // Ситуация, когда товара со склада больше, чем потребности в товаре
              if (this.goods[good_number].Quantity > this.goods[good_number].BuyPerDay) {
                this.goods[good_number].Quantity -= this.goods[good_number].BuyPerDay;
                this.currentProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
                this.profit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
              }
              // Ситуация, когда товара со склада меньше, чем потребности в товаре
              else if (this.goods[good_number].Quantity < this.goods[good_number].BuyPerDay){
                this.goods[good_number].Quantity = 0;
                this.currentProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
                this.profit += this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
                console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + this.goods[good_number].Name + ' закончился');
              }
            }

            // Сравнение реальной частной прибыли для конкретного товара с ожидаемой
            // if(this.currentProfit[good_number] === this.expectedProfit){
            //   console.log('|*|ПРИБЫЛЬ|*| Реальная частная прибыль (' + this.currentProfit[good_number] +
            //     ') для товара ' + this.goods[good_number].Name + ' совпала с ожидаемой');
            // } else if (this.currentProfit[good_number] < this.expectedProfit) {
            //   console.log('|*|ПРИБЫЛЬ|*| Реальная частная прибыль (' + this.currentProfit[good_number] +
            //     ') для товара ' + this.goods[good_number].Name + ' оказалась меньше ожидаемой (' + this.expectedProfit + ')');
            // }

          } else {
            this.goods[good_number].isValid = false;
            this.goods[good_number].notValidReason = 'Товар закончился';
            this.currentProfit[good_number] = 0;
            console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + this.goods[good_number].Name + ' закончился');
            // TODO: Рекомендации по корректировке поставок товара ( поставлять больше )
            good_number++;
            continue;
          }

          // Проверка по сроку годность партии товара
          // TODO: Заранее предупреждать об истекании срока годности товара
          if (this.goods[good_number].CurrentShelfLife > 0) {
            this.goods[good_number].CurrentShelfLife--;
          } else {
            this.goods[good_number].isValid = false;
            this.goods[good_number].notValidReason = 'Партия просрочена';
            console.log('|*|ПРОСРОЧЕН|*| Партия товара ' + this.goods[good_number].Name
              + ' в количестве ' + this.goods[good_number].Quantity + ' единиц, просрочилась');
            console.log('|*|ПРОСРОЧЕН|*| Потери в прибыли составили ' + this.goods[good_number].Quantity * this.goods[good_number].Cost);
            // TODO: Рекомендации по корректировке поставок товара ( поставлять меньше )
            // TODO: Обрабатывать значение потерь в прибыли
            good_number++;
            continue;
          }
          good_number++;
        } else {
          console.log('|*|НЕВАЛИДНЫЙ|*| Партия товара ' + this.goods[good_number].Name
            + ' невалидна по причине - ' + this.goods[good_number].notValidReason);
          good_number++;
        }
      }

      // Сравнение реальной прибыли товара с ожидаемой
      // if(this.profit === this.fullExpectedProfit){
      //   console.log('|*|ПРИБЫЛЬ|*| Реальная прибыль (' + this.profit + ') совпала с полной ожидаемой');
      // } else if (this.profit < this.fullExpectedProfit) {
      //   console.log('|*|ПРИБЫЛЬ|*| Реальная прибыль (' + this.profit + ') оказалась меньше полной ожидаемой (' + this.fullExpectedProfit + ')');
      // }

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
      this.goods[i].CurrentShelfLife = this.goods[i].ShelfLife;
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
