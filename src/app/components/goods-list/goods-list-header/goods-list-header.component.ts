import {Component, Input, OnInit} from '@angular/core';
import {GoodsModel} from '../../../models/goods.model';

@Component({
  selector: 'app-goods-list-header',
  templateUrl: './goods-list-header.component.html',
  styleUrls: ['./goods-list-header.component.css']
})
export class GoodsListHeaderComponent implements OnInit {

  @Input() goods: Array<GoodsModel>;
  propertyArray = [];

  constructor() { }

  ngOnInit() {
    let i = 0;
    Object.keys(this.goods[0]).map((key: string) => {
      this.propertyArray[i] = key.replace(/[\s_]+|([a-z0-9])(?=[A-Z])/g, "$1 ");
      i++;
      // console.log(key, this.goods[0][key]);
    });
  }
}
