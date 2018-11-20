export class BatchModel {
  public Id: string;
  public CurrentShelfLife: number;
  public Quantity: number;
  public isValid: boolean;
  public notValidReason: Array<string>;
}
