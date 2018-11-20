import {BatchModel} from './batch.model';

export class GoodsModel {
  public Id: string;
  public Batches: Array<BatchModel>;
  public Name: string;
  public Category: number;
  public PrimeCost: number;
  public Cost: number;
  public ShelfLife: number;
  public BuyPerDay: number;
  public OnShelfAmount: number;
}
