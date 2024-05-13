export class Floor {
  private floorNumber: number;

  constructor(floorNumber: number) {
    this.floorNumber = floorNumber;
  }

  public getNumber(): number {
    return this.floorNumber;
  }
}
