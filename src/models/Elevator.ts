import { config } from "../config";

export class Elevator {
  private working: boolean = true;

  public elevatorId: number;
  private currentFloor: number = 1;
  private targetFloor: number = 1;
  public areWaiting: number[] = [];
  private busy: boolean = false;
  public timer: number = 0;
  private intervalTimerId: number | null = null;

  constructor(elevatorId: number) {
    this.elevatorId = elevatorId;
  }

  public activateDeactivate(): void {
    this.working =!this.working;
  }

  public getIsWorking(): boolean {
    return this.working;
  }

  public moveToNextFloor(): number {
    const nextFloor = this.areWaiting.shift() ?? -1;
    if (nextFloor !== -1) {
      this.currentFloor = this.targetFloor;
      this.targetFloor = nextFloor;
      const time = Math.abs(this.currentFloor - this.targetFloor) * config.elevatorSpeed + 2;
      this.busy = true;
      this.startBusy(time);
    }
    return this.targetFloor;
  }

  public getCurrentFloor(): number {
    return this.targetFloor;
  }

  public getNumberAreWaiting(): number {
    return this.areWaiting.length;
  }

  public getNextFloor(): number {
    return this.areWaiting[0];
  }

  public getLastWaiting(): number {
    return this.areWaiting.length ? this.areWaiting[this.areWaiting.length - 1] : this.currentFloor;
  }

  public getId(): number {
    return this.elevatorId;
  }

  public addFloorToList(floor: number, addedTime: number): void {
    this.timer += addedTime;
    this.areWaiting.push(floor);
    this.startTimer();
  }

  public getTimer(): number {
    return this.timer;
  }

  public getBusy(): boolean {
    return this.busy;
  }

  private startBusy(timer: number): void {
    window.setTimeout(() => {
      this.busy = false;
    }, timer * 1000);
  }

  private startTimer(): void {
    if (this.intervalTimerId !== null) {
      clearInterval(this.intervalTimerId);
    }
    this.intervalTimerId = window.setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 1;
      } else {
        this.timer = 0;
        if (this.intervalTimerId !== null) {
          clearInterval(this.intervalTimerId);
          this.intervalTimerId = null;
        }
      }
    }, 1000);
  }
}
