import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { ElevatorController } from "../controllers/ElevatorController";
import { ElevatorFactory } from "../factories/ElevatorFactory";

export class Building {
  private floors: Floor[];
  private elevators: Elevator[];
  private elevatorController: ElevatorController;

  constructor(numberOfFloors: number, numberOfElevators: number) {
    this.floors = Array.from({ length: numberOfFloors }, (_, index) => new Floor(numberOfFloors - index));
    this.elevators = Array.from({ length: numberOfElevators }, (_, index: number) => ElevatorFactory.createElevator(index));
    this.elevatorController = new ElevatorController(this.elevators);
  }

  // Returns the list of floors in the building
  public getFloors(): Floor[] {
    return this.floors;
  }

  // Returns the list of elevators in the building
  public getElevators(): Elevator[] {
    return this.elevators;
  }

  // Associates an elevator to the requested floor
  public associateElevatorToFloor(floorNumber: number): number {
    const floor = this.floors.find(floor => floor.getNumber() === floorNumber);
    if (floor) {
      if (!this.isFloorInvited(floorNumber)) {
        floor.toggleButtonState();
        return this.elevatorController.selectElevator(floorNumber);
      }
    } else {
      throw new Error(`Floor number ${floorNumber} not found`);
    }
    return -1;
  }

  // Checks if a floor has already been invited
  public isFloorInvited(floorNumber: number): boolean {
    const floor = this.floors.find(floor => floor.getNumber() === floorNumber);
    return floor!.isButtonPressed();
  }

  // Checks if all requests have been handled
  public areAllRequestsHandled(): boolean {
    return this.elevatorController.noPendingRequests();
  }

  // Gets the next requested floor for the given elevator
  public getNextRequestFloor(elevatorId: number): number {
    const elevator = this.elevators.find((e) => e.getId() === elevatorId);
    return elevator ? elevator.processNextRequest() : -1;
  }

  // Releases the floor button state after a delay
  public releaseFloor(floorNumber: number): void {
    const floor = this.floors.find(floor => floor.getNumber() === floorNumber);
    if (floor) {
      setTimeout(() => {
        floor.toggleButtonState();
      }, 2000);
    }
  }
}
