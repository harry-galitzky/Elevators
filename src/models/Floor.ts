export class Floor {
  private floorNumber: number;
  private buttonPressed: boolean = false;

  constructor(floorNumber: number) {
    this.floorNumber = floorNumber;
  }

  public getNumber(): number {
    return this.floorNumber;
  }

  public getButtonPressed(): boolean {
    return this.buttonPressed;
  }

  public elevatorArrived(): void {
    
}
}