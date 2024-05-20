import { config } from "../config";

export class Elevator {
  private working: boolean = true;
  public elevatorId: number;
  private targetFloor: number = 1;
  public pendingRequests: number[] = [];
  private busy: boolean = false;
  public timer: number = 0;
  private intervalTimerId: number | null = null;

  constructor(elevatorId: number) {
    this.elevatorId = elevatorId;
  }

  // Activates or deactivates the elevator
  public activateDeactivate(): void {
    this.working = !this.working;
  }

  // Returns if the elevator is currently working
  public isWorking(): boolean {
    return this.working;
  }

  // Processes the next request in the queue
  public processNextRequest(): number {
    const nextFloor = this.pendingRequests.shift() ?? -1;
    if (nextFloor !== -1) {
      const time = Math.abs(nextFloor - this.targetFloor) * config.elevatorSpeed + 2;
      this.targetFloor = nextFloor;
      this.busy = true;
      this.startBusyTimer(time);
    }
    return this.targetFloor;
  }

  // Returns the current floor the elevator is on
  public getTargetFloor(): number {
    return this.targetFloor;
  }

  // Returns the number of pending requests
  public hasPendingRequests(): number {
    return this.pendingRequests.length;
  }

  // Returns the next requested floor
  public getNextRequestFloor(): number {
    return this.pendingRequests[0];
  }

  // Returns the last requested floor
  public getLastRequestFloor(): number {
    return this.pendingRequests.length ? this.pendingRequests[this.pendingRequests.length - 1] : this.targetFloor;
  }

  // Returns the elevator ID
  public getId(): number {
    return this.elevatorId;
  }

  // Adds a floor request to the queue
  public addRequestToQueue(floor: number, addedTime: number): void {
    this.timer += (addedTime + 2);
    this.pendingRequests.push(floor);
    this.startRequestTimer();
  }

  // Adds a floor request with a specific total time
  public addRequest(floor: number, totalTime: number): void {
    this.pendingRequests.push(floor);
    this.timer = totalTime;
  }

  // Returns the current request timer
  public getRequestTimer(): number {
    return this.timer;
  }

  // Returns if the elevator is currently busy
  public isBusy(): boolean {
    return this.busy;
  }

  // Starts the busy timer for the elevator
  private startBusyTimer(timer: number): void {
    window.setTimeout(() => {
      this.busy = false;
    }, timer * 1000);
  }

  // Starts the request timer for the elevator
  private startRequestTimer(): void {
    if (this.intervalTimerId !== null) {
      clearInterval(this.intervalTimerId);
    }
    this.intervalTimerId = window.setInterval(() => {
      if (this.timer - 1 >= 0) {
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
