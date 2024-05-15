import { Elevator } from "../models/Elevator";

export class ElevatorFactory {
  private static elevators: Elevator[] = [];

  static createElevator(elevatorId: number): Elevator {
    let availableElevator = this.elevators.find(elevator => elevator.elevatorId === elevatorId && !elevator.getIsWorking());

    if (!availableElevator) {
      availableElevator = new Elevator(elevatorId);
      this.elevators.push(availableElevator);
    } else {
      availableElevator.activateDeactivate();
    }

    return availableElevator;
  }
}
