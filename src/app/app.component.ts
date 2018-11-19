import {Component, OnInit} from '@angular/core';
import {GoodsModel} from 'src/app/models/goods.model';
import {BatchModel} from './models/batch.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  day: number = 1;
  hour: number = 0;
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
      id: '',
      amount: 0,
    }
  ];

  constructor() {

  }

  ngOnInit() {
    this.generateGoods(10);
    this.mainLoop(5);
  }

  newSupply = (goods) => {
    // goods.map((good) => {
    //   this.goods[good.id].Quantity += good.amount;
    // });
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

  mainLoop = (days) => {
    // Цикл, имитирующий течение времени ( по дням )
    while (this.day <= days) {

      // TODO: **Реализовать сравнение текущей прибыли и ожидаемой ( Реализовано сравнение частных и финальной реальной и ожидаемой прибылей )
      console.log('|***| День ' + this.day + ' |***|');

      // Цикл перебора для каждого типа товара
      this.goods.forEach((good, goodNumber, goods) => {

        // Вычисление ожидаемой прибыли для конкретной партии товаров / Ожидаемая прибыль расчитывается исходя из спроса на товары
        this.expectedProfit[goodNumber] = this.goods[goodNumber].BuyPerDay * this.goods[goodNumber].Cost;
        // Вычисление финальной ожидаемой прибыли
        this.fullExpectedProfit += this.expectedProfit[goodNumber];

        // Цикл перебора для каждой партии товаров
        good.Batches.forEach((batch, batchNumber, batches) => {

          // Проверка срока годности партии товаров
          // TODO: Заранее предупреждать об истекании срока годности товара ( увеличить вместимость полок )
          if (batch.CurrentShelfLife > 0) {
            batch.CurrentShelfLife--;
          } else {
            batch.isValid = false;
            batch.notValidReason = 'Партия просрочена';
            this.currentProfit[goodNumber] = -1 * batch.Quantity * good.Cost;
            console.log('|*|ПРОСРОЧЕН|*| Партия товара ' + good.Name
              + ' в количестве ' + batch.Quantity + ' единиц, просрочилась. Потери в прибыли составили (' +
              this.currentProfit[goodNumber] + ')');
            this.profit += this.currentProfit[goodNumber];
            // TODO: Рекомендации по корректировке поставок товара ( поставлять меньше )
            // TODO: **Обрабатывать значение потерь в прибыли ( Реализована разница в финальных реальной и ожидаемой прибылях )
          }

          // Проверка наличия товаров данной партии
          if (batch.Quantity <= 0) {
            batch.isValid = false;
            batch.notValidReason = 'Товар закончился';
            this.currentProfit[goodNumber] = 0;
            console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + good.Name + ' закончился');
            // TODO: Рекомендации по корректировке поставок товара ( поставлять больше )
          }

          // Главная проверка на валидность партии товаров
          if (batch.isValid) {

            // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
            // при условии, что товара в зале хватит для покупок на день
            if (batch.Quantity >= good.OnShelfAmount && good.OnShelfAmount >= good.BuyPerDay) {
              batch.Quantity -= good.BuyPerDay;
              this.currentProfit[goodNumber] = good.BuyPerDay * good.Cost;
              this.profit += this.currentProfit[goodNumber];
            }
            // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
            // при условии, что потребности в товаре будет больше, чем есть на полках
            else if (batch.Quantity >= good.OnShelfAmount && good.OnShelfAmount < good.BuyPerDay) {
              // TODO: Рекомендация по увеличению количества товаров на полках в зале
              batch.Quantity -= good.OnShelfAmount;
              this.currentProfit[goodNumber] = good.OnShelfAmount * good.Cost;
              this.profit += this.currentProfit[goodNumber];
            }
            // Ситуация, когда товара со склада недостаточно, чтобы заполнить все полки в зале
            else if (batch.Quantity < good.OnShelfAmount) {
              // Ситуация, когда товара со склада хватит, чтобы удовлетворить потребности в товаре
              if (batch.Quantity >= good.BuyPerDay) {
                batch.Quantity -= good.BuyPerDay;
                this.currentProfit[goodNumber] = good.BuyPerDay * good.Cost;
                this.profit += this.currentProfit[goodNumber];
              }
              // Ситуация, когда товара со склада меньше, чем потребности в товаре
              else if (batch.Quantity < good.BuyPerDay) {
                this.currentProfit[goodNumber] = batch.Quantity * good.Cost;
                this.profit += this.currentProfit[goodNumber];
                batch.Quantity = 0;
                batch.isValid = false;
                batch.notValidReason = 'Товар закончился';
                console.log('|*|ЗАКОНЧИЛСЯ|*| Товар ' + good.Name + ' закончился');
              }
            }
          } else {
            console.log('|*|НЕВАЛИДНЫЙ|*| Партия товара ' + good.Name + ' невалидна по причине - ' + batch.notValidReason);
          }
        });

        // Сравнение реальной частной прибыли для конкретного типа товара с ожидаемой частной прибылью
        if (this.currentProfit[goodNumber] === this.expectedProfit[goodNumber]) {
          console.log('|*|ПРИБЫЛЬ|*| Реальная частная прибыль (' + this.currentProfit[goodNumber] +
            ') для товара ' + good.Name + ' совпала с ожидаемой');
        } else if (this.currentProfit[goodNumber] < this.expectedProfit[goodNumber]) {
          let difference = this.expectedProfit[goodNumber] - this.currentProfit[goodNumber];
          console.log('|*|ПРИБЫЛЬ|*| Реальная частная прибыль (' + this.currentProfit[goodNumber] +
            ') для товара ' + good.Name + ' оказалась меньше ожидаемой (' + this.expectedProfit[goodNumber] +
            '), разница составила (' + difference + ')');
        }

        // TODO: Реализовать динамический спрос на товары
        // TODO: Реализовать динамическое изменение кол-ва товаров на полках
        // TODO: Ввести себестоимость в алгоритм
        this.day++;
      });
      // Old algorithm
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
      this.goods[i].Category = Math.floor(Math.random() * 5) + 1;
      this.goods[i].PrimeCost = Math.floor(Math.random() * 1000) + 1;
      this.goods[i].Cost = Math.floor(this.goods[i].PrimeCost * (Math.random() + 1));
      this.goods[i].BuyPerDay = Math.floor(Math.random() * 10);
      this.goods[i].OnShelfAmount = Math.floor(this.maxOnShelfAmount / goodsToGenerate);
      this.goods[i].ShelfLife = Math.floor(Math.random() * 20) + 1;
      this.goods[i].Batches = [];
      // this.goods[i].OnShelfAmount = Math.floor(Math.random() * 10) + 1;

      // this.goods[i].Batches[0] = new BatchModel();
      // this.goods[i][0].Batches[0].ShelfLife = Math.floor(Math.random() * 20) + 1;
      // this.goods[i][0].Batches[0].CurrentShelfLife = this.goods[i][0].Batch.ShelfLife;
      // this.goods[i][0].Batches[0].Quantity = 0;
      // // this.goods[i].Quantity = Math.floor(this.maxQuantity / goodsToGenerate);
      // // this.goods[i].Quantity = Math.floor(Math.random() * 50) + 1;
      // this.goods[i][0].Batches[0].isValid = true;
      // this.goods[i][0].Batches[0].notValidReason = '-';
      i++;
    }
    console.log(this.goods);
  };


}
