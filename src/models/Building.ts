import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { ElevatorController } from "../controllers/ElevatorController";

export class Building {
  private floors: Floor[];
  private elevators: Elevator[];
  private elevatorController: ElevatorController;

  constructor(numberOfFloors: number, numberOfElevators: number) {
    this.floors = Array.from(
      { length: numberOfFloors },
      (_, index) => new Floor(numberOfFloors - index)
    );

    this.elevators = Array.from(
      { length: numberOfElevators },
      (_, index: number) => new Elevator(index)
    );
    this.elevatorController = new ElevatorController(
      this.elevators,
      this.floors
    );
  }

  public getFloors(): Floor[] {
    return this.floors;
  }

  public getElevators(): Elevator[] {
    return this.elevators;
  }

  public AssociatingElevatorFloor(floorNumber: number): number {
    const time = this.elevatorController.callElevatorToFloor(floorNumber);
    return time;
  }

  public emptyLists(): boolean {
    return this.elevatorController.NoWaiting();
  }

  public nextFloor(elevatorId: number): number {
    const elevator = this.elevators.find((e) => e.getId() === elevatorId);

    if (elevator) {
      const floor = elevator.moveToNextFloor();
      if (floor != null) {
        return floor;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }
}
