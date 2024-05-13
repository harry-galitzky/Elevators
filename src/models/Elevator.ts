export class Elevator {
  public elevatorId: number;
  private currentFloor: number = 1;
  private targetFloor: number = 1;
  public areWaiting: number[] = [];
  public busy: number = 0;
  public timer: number = 0;

  private intervalTimerId: number | null = null;
  private intervalBusyId: number | null = null;

  constructor(elevatorId: number) {
    this.elevatorId = elevatorId;
  }

  public moveToNextFloor(): number {
    const nextFloor = this.areWaiting.shift() ?? null;
    if (nextFloor === null) {
      return -1;
    }
    this.currentFloor = this.targetFloor;
    this.targetFloor = nextFloor;

    const addedTime = Math.abs(this.currentFloor - this.targetFloor) * 0.5 + 2;
    this.busy = addedTime;
    this.startBusy(this.busy);

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
    if (this.areWaiting.length) {
      return this.areWaiting[this.areWaiting.length - 1];
    } else {
      return this.currentFloor;
    }
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

  public getBusy(): number {
    return this.busy;
  }

  public startBusy(timer: number): void {
    if (this.intervalBusyId !== null) {
      clearInterval(this.intervalBusyId);
    }
    this.intervalBusyId = window.setInterval(() => {
      if (this.busy > 0) {
        this.busy -= 1;
      } else {
        this.busy = 0;
        if (this.intervalBusyId !== null) {
          clearInterval(this.intervalBusyId);
          this.intervalBusyId = null;
        }
      }
    }, 1000);
  }

  public startTimer(): void {
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
