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
  // TODO: Ввести часы, как единицу времени

  goods: Array<GoodsModel> = [];

  profit: number = 0;
  fullExpectedProfit: number = 0;
  fullDifference: number = 0;
  currentProfit: Array<number> = [];
  expectedProfit: Array<number> = [];

  maxOnShelfAmount: number = 100;
  currentOnShelfAmount: number = 0;
  maxQuantity: number = 500;
  currentQuantity: number = 0;

  constructor() {
  }

  ngOnInit() {
    this.generateGoods(10);
    this.mainLoop(10);
  }

  // Функция создания записей о возможных товарах для продажи
  generateGoods = (goodsToGenerate) => {
    let i = 0;
    while (i < goodsToGenerate) {
      this.goods[i] = new GoodsModel();
      this.goods[i].Id = (i).toString();
      this.goods[i].Name = 'Good number ' + (i);
      this.goods[i].Category = Math.floor(Math.random() * 5) + 1;
      this.goods[i].PrimeCost = Math.floor(Math.random() * 1000) + 1;
      this.goods[i].Cost = Math.floor(this.goods[i].PrimeCost * (Math.random() + 1)); // Вычисляется с множителем [1, 2) от себестоимости
      this.goods[i].BuyPerDay = Math.floor(Math.random() * 15);
      this.goods[i].OnShelfAmount = Math.floor(this.maxOnShelfAmount / goodsToGenerate);
      this.goods[i].ShelfLife = Math.floor(Math.random() * 14) + 1;
      this.goods[i].Batches = [];
      // this.goods[i].OnShelfAmount = Math.floor(Math.random() * 10) + 1;

      this.currentOnShelfAmount += this.goods[i].OnShelfAmount;
      i++;
    }
    console.log(this.goods);
  };

  newSupply(goodID?: string, quantity?: number) {
    let batchNumber = 0;
    if (arguments.length) {
      // Поставка новой партии конкретного товара
      let newBatch: BatchModel = {
        Id: this.goods[goodID].Batches.length,
        CurrentShelfLife: this.goods[goodID].ShelfLife,
        Quantity: quantity,
        isValid: true,
        notValidReason: [],
      };
      quantity !== 0 ?
        this.goods[goodID].Batches.push(newBatch) : console.log('CRITICAL ERROR (Q) Попытка заказа пустой партии');
      console.log('|*|SUPPLY|*| Поставка партии товара ' + this.goods[goodID].Name + ' в количестве ' + quantity);
    } else {
      // Первая поставка
      this.goods.forEach((good, goodNumber, goods) => {
        good.Batches[batchNumber] = new BatchModel();
        good.Batches[batchNumber].Id = batchNumber.toString();
        good.Batches[batchNumber].CurrentShelfLife = good.ShelfLife;
        good.Batches[batchNumber].Quantity = Math.floor(this.maxQuantity / goods.length);
        // good.Batches[batchNumber].Quantity = 10;
        good.Batches[batchNumber].isValid = true;
        good.Batches[batchNumber].notValidReason = [];

        this.currentQuantity += good.Batches[batchNumber].Quantity;
      });
      console.log('|*|SUPPLY|*| Первая поставка');
    }
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

  callNewSupply = (good) => {
    let ready = false;
    let availableQuantity = this.maxQuantity - this.currentQuantity;
    let multiplier = 0.9;
    let newQuantity = Math.floor(good.BuyPerDay * good.ShelfLife * multiplier);
    // newQuantity = 10;
    while (!ready) {
      if (newQuantity > availableQuantity) {
        newQuantity *= multiplier
      } else {
        ready = true;
        this.newSupply(good.Id.toString(), newQuantity);
      }
    }
  };

  checkIsGoodEnded = (good: GoodsModel, batch: BatchModel) => {
    if (batch.Quantity < 0) {
      console.log('CRITICAL ERROR (Q) Товар с отрицательным количеством (' + good.Name, batch.Quantity + ')');
    }
    if (batch.Quantity === 0) {
      batch.isValid = false;
      batch.notValidReason[0] = 'ENDED';
      console.log('|*|ENDED|*| Товар ' + good.Name + ' закончился');
      batch.CurrentShelfLife > 1 ? this.callNewSupply(good) : null;
    }
  };

  checkIsGoodExpired = (good: GoodsModel, batch: BatchModel) => {
    // TODO: Заранее предупреждать об истекании срока годности товара ( увеличить вместимость полок )
    if (batch.CurrentShelfLife < 0) {
      console.log('CRITICAL ERROR (CSL) Товар с отрицательным сроком годности (' + good.Name, batch.CurrentShelfLife + ')');
    }
    if (batch.CurrentShelfLife === 0) {
      batch.isValid = false;
      batch.notValidReason[1] = 'EXPIRED';
      this.currentProfit[+good.Id] = -1 * batch.Quantity * good.Cost;
      console.log('|*|EXPIRED|*| Партия товара ' + good.Name
        + ' в количестве ' + batch.Quantity + ' единиц, просрочилась. Потери в прибыли составили (' +
        this.currentProfit[+good.Id] + ')');
      this.profit += this.currentProfit[+good.Id];
      batch.Quantity > 1 ? this.callNewSupply(good) : null;
      // TODO: Рекомендации по корректировке поставок товара ( поставлять меньше )
      // TODO: **Обрабатывать значение потерь в прибыли ( Реализована разница в финальных реальной и ожидаемой прибылях )
    }
  };

  mainLoop = (days) => {
    // Цикл, имитирующий течение времени ( по дням )
    while (this.day <= days) {

      // TODO: **Реализовать сравнение текущей прибыли и ожидаемой ( Реализовано сравнение частных и финальной реальной и ожидаемой прибылей )
      console.log('|***| День ' + this.day + ' |***|');

      // Первая поставка со стандартными значениями параметров
      if (this.day === 1) this.newSupply(); // Первая поставка

      // Цикл перебора для каждого типа товара
      this.goods.forEach((good, goodNumber, goods) => {

        // Вычисление ожидаемой прибыли для конкретной партии товаров / Ожидаемая прибыль расчитывается исходя из спроса на товары
        this.expectedProfit[goodNumber] = this.goods[goodNumber].BuyPerDay * this.goods[goodNumber].Cost;
        // Вычисление финальной ожидаемой прибыли
        this.fullExpectedProfit += this.expectedProfit[goodNumber];

        // Поиск партии товара с наименьшим сроком годности
        let shelfLifeArr: Array<any> = good.Batches.map((batch) => {
          return batch.CurrentShelfLife > 0 && batch.Quantity > 0 ? batch.CurrentShelfLife : Infinity;
        });
        let batch: BatchModel = good.Batches[shelfLifeArr.indexOf(Math.min.apply(null, shelfLifeArr))];
        // Проверка срока годности партии товаров
        if (batch.CurrentShelfLife > 0) {
          batch.CurrentShelfLife--;
        } else {
          this.checkIsGoodExpired(good, batch);
        }

        // Проверка наличия товаров данной партии
        this.checkIsGoodEnded(good, batch);

        // Главная проверка на валидность партии товаров
        if (batch.isValid) {

          // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
          // при условии, что товара в зале хватит для покупок на день
          if (batch.Quantity >= good.OnShelfAmount && good.OnShelfAmount >= good.BuyPerDay) {
            batch.Quantity -= good.BuyPerDay;
            this.currentQuantity -= good.BuyPerDay;
            this.currentProfit[goodNumber] = good.BuyPerDay * good.Cost;
            this.profit += this.currentProfit[goodNumber];
            this.checkIsGoodEnded(good, batch);
          }
          // Проверка, хватит ли товара со склада, чтобы заполнить все полки в зале
          // при условии, что потребности в товаре будет больше, чем есть на полках
          else if (batch.Quantity >= good.OnShelfAmount && good.OnShelfAmount < good.BuyPerDay) {
            // TODO: Рекомендация по увеличению количества товаров на полках в зале
            batch.Quantity -= good.OnShelfAmount;
            this.currentQuantity -= good.OnShelfAmount;
            this.currentProfit[goodNumber] = good.OnShelfAmount * good.Cost;
            this.profit += this.currentProfit[goodNumber];
            this.checkIsGoodEnded(good, batch);
          }
          // Ситуация, когда товара со склада недостаточно, чтобы заполнить все полки в зале
          else if (batch.Quantity < good.OnShelfAmount) {
            // Ситуация, когда товара со склада хватит, чтобы удовлетворить потребности в товаре
            if (batch.Quantity >= good.BuyPerDay) {
              batch.Quantity -= good.BuyPerDay;
              this.currentQuantity -= good.BuyPerDay;
              this.currentProfit[goodNumber] = good.BuyPerDay * good.Cost;
              this.profit += this.currentProfit[goodNumber];
              this.checkIsGoodEnded(good, batch);
            }
            // Ситуация, когда товара со склада меньше, чем потребности в товаре
            else if (batch.Quantity < good.BuyPerDay) {
              this.currentQuantity -= batch.Quantity;
              this.currentProfit[goodNumber] = batch.Quantity * good.Cost;
              this.profit += this.currentProfit[goodNumber];
              // TODO: Продажа товаров из другой партии
              batch.Quantity = 0;
              this.checkIsGoodEnded(good, batch);
            }
          }
          this.checkIsGoodExpired(good, batch);
        } else {
          let reasons: string = '';
          batch.notValidReason.forEach((reason) => {
            if (reason) reasons += reason + ' ';
          });
          console.log('|*|INVALID|*| Партия товара ' + good.Name + ' под номером ' + batch.Id + ' невалидна, т.к - ' + reasons);
        }

        // Сравнение реальной частной прибыли для конкретного типа товара с ожидаемой частной прибылью
        if (this.currentProfit[goodNumber] === this.expectedProfit[goodNumber]) {
          console.log('|*|PROFIT|*| Реальная частная прибыль (' + this.currentProfit[goodNumber] +
            ') для товара ' + good.Name + ' совпала с ожидаемой');
        } else if (this.currentProfit[goodNumber] < this.expectedProfit[goodNumber]) {
          let difference = this.expectedProfit[goodNumber] - this.currentProfit[goodNumber];
          console.log('|*|PROFIT|*| Реальная частная прибыль (' + this.currentProfit[goodNumber] +
            ') для товара ' + good.Name + ' оказалась меньше ожидаемой (' + this.expectedProfit[goodNumber] +
            '), разница составила (' + difference + ')');
        }
      });

      // TODO: Реализовать динамический спрос на товары
      // TODO: Реализовать динамическое изменение кол-ва товаров на полках
      // TODO: Ввести себестоимость в алгоритм
      this.day++;
    }

    // // Сравнение финальной реальной прибыли товара с финальной ожидаемой
    // // TODO: Представлять разницу в реальной и ожидаемой прибыли более наглядно ( в процентах )
    // if (this.profit === this.fullExpectedProfit) {
    //   console.log('|*|FINAL PROFIT|*| Финальная реальная прибыль (' + this.profit + ') совпала с ожидаемой');
    // } else if (this.profit < this.fullExpectedProfit) {
    //   this.fullDifference = this.fullExpectedProfit - this.profit;
    //   console.log('|*|FINAL PROFIT|*| Финальная реальная прибыль (' + this.profit + ') оказалась меньше ожидаемой (' +
    //     this.fullExpectedProfit + '), разница составила (' + this.fullDifference + ')');
    // }
  };


}
