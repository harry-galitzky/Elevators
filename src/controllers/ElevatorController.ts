import { Elevator } from "../models/Elevator";
import { Floor } from "../models/Floor";

export class ElevatorController {
  private elevators: Elevator[];
  private floors: Floor[];

  constructor(elevators: Elevator[], floors: Floor[]) {
    this.elevators = elevators;
    this.floors = floors;
  }

  public callElevatorToFloor(floorNumber: number): number {
    let minimalTime: number = Number.MAX_VALUE;
    let selectedElevator: Elevator = this.elevators[0];
    let totalTimeToMe: number = 0;

    this.elevators.forEach((elevator) => {
      const timeToMe = Math.abs(elevator.getLastWaiting() - floorNumber) * 0.5;
      const totalTime: number = timeToMe + elevator.getTimer();

      if (totalTime < minimalTime) {
        minimalTime = totalTime;
        selectedElevator = elevator;
        totalTimeToMe = timeToMe;
      }
    });
    selectedElevator.addFloorToList(floorNumber, totalTimeToMe);
    return minimalTime;
  }

  public NoWaiting(): boolean {
    return this.elevators.every((elevator) => elevator.getNumberAreWaiting() === 0);
  }
}
