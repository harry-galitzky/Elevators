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
    this.elevatorController = new ElevatorController(this.elevators, this.floors);
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
    return this.elevatorController.selectElevator(floorNumber);
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
}
