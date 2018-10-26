export class GoodsModel {
  [key: string]: any;
  public Id: string;
  public Name: string;
  public Cost: number;
  public ShelfLife: number;
  public Quantity: number;
  public BuyPerDay: number;
  public OnShelfAmount: number;
  public isValid: boolean;
  public notValidReason: string;
}
