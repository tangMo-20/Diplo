import {Component, Input, OnInit} from '@angular/core';
import {GoodsModel} from '../../../models/goods.model';

@Component({
  selector: 'app-good-item',
  templateUrl: './good-item.component.html',
  styleUrls: ['./good-item.component.css']
})
export class GoodItemComponent implements OnInit {

  @Input() good: GoodsModel;
  propertyArray = [];
  valueArray = [];

  constructor() { }

  ngOnInit() {
    let i = 0;
    Object.keys(this.good).map((key: string) => {
      this.propertyArray[i] = key.replace(/[\s_]+|([a-z0-9])(?=[A-Z])/g, "$1 ");
      this.valueArray[i] = this.good[key];
      i++;
      // console.log(key, this.goods[0][key]);
    });
  }

}
