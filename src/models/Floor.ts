export class Floor {
  private floorNumber: number;
  private buttonPressed: boolean = false;

  constructor(floorNumber: number) {
    this.floorNumber = floorNumber;
  }

  // Returns the floor number
  public getNumber(): number {
    return this.floorNumber;
  }

  // Returns if the button is pressed
  public isButtonPressed(): boolean {
    return this.buttonPressed;
  }

  // Toggles the state of the button
  public toggleButtonState(): void {
    this.buttonPressed = !this.buttonPressed;
  }
}
