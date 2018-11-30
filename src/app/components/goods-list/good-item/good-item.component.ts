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
  reasonsArray = [];
  reasonsToDisplay = [];

  expanded = true;

  constructor() {
  }

  ngOnInit() {
    // this.dynamicRender();
    this.getInvalidReasons();
  }

  dynamicRender = () => {
    let i = 0;
    Object.keys(this.good).map((key: string) => {
      this.propertyArray[i] = key.replace(/[\s_]+|([a-z0-9])(?=[A-Z])/g, '$1 ');
      i++;
      // console.log(key, this.good[key]);
    });
  };

  getInvalidReasons = () => {
    this.good.Batches.forEach((batch, batchNumber) => {
      this.reasonsArray[batchNumber] = [];
      batch.notValidReason.forEach((reason, reasonNumber) => {
        if (reason) this.reasonsArray[batchNumber][reasonNumber] = reason;
      });
    });

    this.reasonsToDisplay = this.reasonsArray.map((batchReasons, index) => {
      if(batchReasons[index]){
        return batchReasons.join(' ');
      } else {
        return batchReasons.join(' ');
      }
    });
  };
}
