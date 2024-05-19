import { Elevator } from "../models/Elevator";

export class ElevatorFactory {
  private static elevators: Elevator[] = [];

  // Creates a new elevator or reactivates an existing one
  static createElevator(elevatorId: number): Elevator {
    let availableElevator = this.elevators.find(elevator => elevator.elevatorId === elevatorId && !elevator.isWorking());

    if (!availableElevator) {
      availableElevator = new Elevator(elevatorId);
      this.elevators.push(availableElevator);
    } else {
      availableElevator.activateDeactivate();
    }

    return availableElevator;
  }
}
