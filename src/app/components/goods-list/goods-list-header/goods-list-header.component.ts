import {Component, Input, OnInit} from '@angular/core';
import {GoodsModel} from '../../../models/goods.model';

@Component({
  selector: 'app-goods-list-header',
  templateUrl: './goods-list-header.component.html',
  styleUrls: ['./goods-list-header.component.css']
})
export class GoodsListHeaderComponent implements OnInit {

  @Input() good: GoodsModel;
  propertyArray = [];

  constructor() { }

  ngOnInit() {
    this.dynamicRender();
  }

  dynamicRender = () => {
    let i = 0;
    Object.keys(this.good).map((key: string) => {
      this.propertyArray[i] = key.replace(/[\s_]+|([a-z0-9])(?=[A-Z])/g, "$1 ");
      i++;
      // console.log(key, this.good[key]);
    });
  };
}
