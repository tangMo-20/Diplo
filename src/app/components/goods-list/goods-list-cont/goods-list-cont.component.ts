import {Component, Input, OnInit} from '@angular/core';
import {GoodsModel} from '../../../models/goods.model';

@Component({
  selector: 'app-goods-list-cont',
  templateUrl: './goods-list-cont.component.html',
  styleUrls: ['./goods-list-cont.component.css']
})
export class GoodsListContComponent implements OnInit {

  @Input() goods: Array<GoodsModel>;

  constructor() { }

  ngOnInit() {
  }

}
