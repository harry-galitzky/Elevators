import { Elevator } from "../models/Elevator";
import { config } from "../config";

export class ElevatorController {
  private elevators: Elevator[];

  constructor(elevators: Elevator[]) {
    this.elevators = elevators;
  }

  // Selects the optimal elevator for a floor request
  public selectElevator(floorNumber: number): number {
    let minimalTime: number = Number.MAX_VALUE;
    let selectedElevator: Elevator = this.elevators[0];
    let totalTimeToFloor: number = 0;

    this.elevators.forEach((elevator) => {
      const timeToFloor = Math.abs(elevator.getLastRequestFloor() - floorNumber) * config.elevatorSpeed;
      const totalTime: number = timeToFloor + elevator.getRequestTimer();

      if (totalTime < minimalTime) {
        minimalTime = totalTime;
        selectedElevator = elevator;
        totalTimeToFloor = timeToFloor;
      }
    });

    selectedElevator.addRequestToQueue(floorNumber, totalTimeToFloor);
    return minimalTime;
  }

  // Checks if there are no pending requests
  public noPendingRequests(): boolean {
    return this.elevators.every((elevator) => elevator.hasPendingRequests() === 0);
  }
}
