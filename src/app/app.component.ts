import {Component, OnInit} from '@angular/core';
import {GoodsModel} from 'src/app/models/goods.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  day: number = 1;
  goods: Array<GoodsModel> = [];

  profit: number = 0;
  fullExpectedProfit: number = 0;
  fullDifference: number = 0;
  currentProfit: Array<number> = [];
  expectedProfit: Array<number> = [];

  maxOnShelfAmount: number = 50;
  maxQuantity: number = 500;

  goodsForNewSupply: Array<object> = [
    {
      id: "",
      amount: 0,
    }
  ];

  constructor() {

  }

  ngOnInit() {
    this.generateGoods(10);
    // this.mainLoop();
  }

  newSupply = (goods) => {
    goods.map((good) => {
      this.goods[good.id].Quantity += good.amount;
    });
  };

  getGeneralParameters = () => {
    return {
      day: this.day,
      goods: this.goods,
      profit: this.profit,
      fullExpectedProfit: this.fullExpectedProfit,
      fullDifference: this.fullDifference,
      currentProfit: this.currentProfit,
      expectedProfit: this.expectedProfit,
      maxOnShelfAmount: this.maxOnShelfAmount,
      maxQuantity: this.maxQuantity,
    };
  };

  mainLoop = () => {
    // Цикл, имитирующий течение времени ( по дням )
    while (this.day <= 5) {
      // Номер партии товаров
      let good_number = 0;

      // TODO: **Реализовать сравнение текущей прибыли и ожидаемой ( Реализовано сравнение частных и финальной реальной и ожидаемой прибылей )
      console.log('|***| День ' + this.day + ' |***|');

      // Цикл перебора для каждой партии товаров
      while (good_number < this.goods.length) {

        // Вычисление ожидаемой прибыли для конкретной партии товаров
        // Ожидаемая прибыль расчитывается исходя из спроса на товары
        this.expectedProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
        // Вычисление финальной ожидаемой прибыли
        this.fullExpectedProfit += this.expectedProfit[good_number];

        // Проверка срока годности партии товаров
        // TODO: Заранее предупреждать об истекании срока годности товара ( увеличить вместимость полок )
        if (this.goods[good_number].CurrentShelfLife > 0) {
          this.goods[good_number].CurrentShelfLife--;
        } else {
          this.goods[good_number].isValid = false;
          this.goods[good_number].notValidReason = 'Партия просрочена';
          this.currentProfit[good_number] = -1 * this.goods[good_number].Quantity * this.goods[good_number].Cost;
          console.log('|*|ПРОСРОЧЕН|*| Партия товара ' + this.goods[good_number].Name
            + ' в количестве ' + this.goods[good_number].Quantity + ' единиц, просрочилась. Потери в прибыли составили (' +
            this.currentProfit[good_number] + ')');
          this.profit += this.currentProfit[good_number];
          // TODO: Рекомендации по корректировке поставок товара ( поставлять меньше )
          // TODO: **Обрабатывать значение потерь в прибыли ( Реализована разница в финальных реальной и ожидаемой прибылях )
        }

        // Проверка наличия товаров данной партии
        if (this.goods[good_number].Quantity <= 0) {
          this.goods[good_number].isValid = false;
          this.goods[good_number].notValidReason = 'Товар закончился';
          this.currentProfit[good_number] = 0;
          console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + this.goods[good_number].Name + ' закончился');
          // TODO: Рекомендации по корректировке поставок товара ( поставлять больше )
        }

        // Главная проверка на валидность партии товаров
        if (this.goods[good_number].isValid) {

          // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
          // при условии, что товара в зале хватит для покупок на день
          if (
            this.goods[good_number].Quantity >= this.goods[good_number].OnShelfAmount &&
            this.goods[good_number].OnShelfAmount >= this.goods[good_number].BuyPerDay
          ) {
            this.goods[good_number].Quantity -= this.goods[good_number].BuyPerDay;
            this.currentProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
            this.profit += this.currentProfit[good_number];

          }
          // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
          // при условии, что потребности в товаре будет больше, чем есть на полках
          else if (
            this.goods[good_number].Quantity >= this.goods[good_number].OnShelfAmount &&
            this.goods[good_number].OnShelfAmount < this.goods[good_number].BuyPerDay
          ) {
            // TODO: Рекомендация по увеличению количества товаров на полках в зале
            this.goods[good_number].Quantity -= this.goods[good_number].OnShelfAmount;
            this.currentProfit[good_number] = this.goods[good_number].OnShelfAmount * this.goods[good_number].Cost;
            this.profit += this.currentProfit[good_number];
          }
          // Ситуация, когда товара со склада недостаточно, чтобы заполнить все полки в зале
          else if (this.goods[good_number].Quantity < this.goods[good_number].OnShelfAmount) {
            // Ситуация, когда товара со склада хватит, чтобы удовлетворить потребности в товаре
            if (this.goods[good_number].Quantity >= this.goods[good_number].BuyPerDay) {
              this.goods[good_number].Quantity -= this.goods[good_number].BuyPerDay;
              this.currentProfit[good_number] = this.goods[good_number].BuyPerDay * this.goods[good_number].Cost;
              this.profit += this.currentProfit[good_number];
            }
            // Ситуация, когда товара со склада меньше, чем потребности в товаре
            else if (this.goods[good_number].Quantity < this.goods[good_number].BuyPerDay) {
              this.currentProfit[good_number] = this.goods[good_number].Quantity * this.goods[good_number].Cost;
              this.profit += this.currentProfit[good_number];
              this.goods[good_number].Quantity = 0;
              this.goods[good_number].isValid = false;
              this.goods[good_number].notValidReason = 'Товар закончился';
              console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + this.goods[good_number].Name + ' закончился');
            }
          }

          // Сравнение реальной частной прибыли для конкретной партии товаров с ожидаемой частной прибылью
          if (this.currentProfit[good_number] === this.expectedProfit[good_number]) {
            console.log('|*|ПРИБЫЛЬ|*| Реальная частная прибыль (' + this.currentProfit[good_number] +
              ') для товара ' + this.goods[good_number].Name + ' совпала с ожидаемой');
            good_number++;
          } else if (this.currentProfit[good_number] < this.expectedProfit[good_number]) {
            let difference = this.expectedProfit[good_number] - this.currentProfit[good_number];
            console.log('|*|ПРИБЫЛЬ|*| Реальная частная прибыль (' + this.currentProfit[good_number] +
              ') для товара ' + this.goods[good_number].Name + ' оказалась меньше ожидаемой (' + this.expectedProfit[good_number] +
              '), разница составила (' + difference + ')');
            good_number++;
          }

        } else {
          console.log('|*|НЕВАЛИДНЫЙ|*| Партия товара ' + this.goods[good_number].Name
            + ' невалидна по причине - ' + this.goods[good_number].notValidReason);
          good_number++;
        }
      }

      // TODO: Реализовать динамический спрос на товары
      // TODO: Реализовать динамическое изменение кол-ва товаров на полках
      // TODO: Ввести себестоимость в алгоритм
      this.day++;
    }

    // Сравнение финальной реальной прибыли товара с финальной ожидаемой
    // TODO: Представлять разницу в реальной и ожидаемой прибыли более наглядно ( в процентах )
    if (this.profit === this.fullExpectedProfit) {
      console.log('|*|ПРИБЫЛЬ|*| Финальная реальная прибыль (' + this.profit + ') совпала с ожидаемой');
    } else if (this.profit < this.fullExpectedProfit) {
      this.fullDifference = this.fullExpectedProfit - this.profit;
      console.log('|*|ПРИБЫЛЬ|*| Финальная реальная прибыль (' + this.profit + ') оказалась меньше ожидаемой (' +
        this.fullExpectedProfit + '), разница составила (' + this.fullDifference + ')');
    }
  };

  // Функция создания записей о возможных товарах для продажи
  generateGoods = (goodsToGenerate) => {
    let i = 0;
    while (i < goodsToGenerate) {
      this.goods[i] = new GoodsModel();
      this.goods[i].Id = (i).toString();
      this.goods[i].Name = 'Good number ' + (i);
      // this.goods[i].Category = Math.floor(Math.random() * 5) + 1;
      this.goods[i].PrimeCost = Math.floor(Math.random() * 1000) + 1;
      this.goods[i].Cost = Math.floor(this.goods[i].PrimeCost * (Math.random() + 1));
      this.goods[i].ShelfLife = Math.floor(Math.random() * 20) + 1;
      this.goods[i].CurrentShelfLife = this.goods[i].ShelfLife;
      this.goods[i].Quantity = 0;
      // this.goods[i].Quantity = Math.floor(this.maxQuantity / goodsToGenerate);
      // this.goods[i].Quantity = Math.floor(Math.random() * 50) + 1;
      this.goods[i].BuyPerDay = Math.floor(Math.random() * 10);
      this.goods[i].OnShelfAmount = Math.floor(this.maxOnShelfAmount / goodsToGenerate);
      // this.goods[i].OnShelfAmount = Math.floor(Math.random() * 10) + 1;
      this.goods[i].isValid = true;
      this.goods[i].notValidReason = '-';
      i++;
    }
    console.log(this.goods);
  };


}
