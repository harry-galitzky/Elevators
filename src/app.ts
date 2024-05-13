import { Building } from "./models/Building";
import "../public/help.css";

const mainBuilding = new Building(10, 1);

const buildingContainer = document.getElementById("building-container");

const buildingElevator = document.createElement("div");

const buildingLine = document.createElement("div");
buildingLine.className = "building";

buildingElevator.className = "elevators";

buildingContainer?.appendChild(buildingElevator);

buildingContainer?.appendChild(buildingLine);

mainBuilding.getFloors().forEach((floor) => {
  const floorElement = document.createElement("div");
  floorElement.className = "floor";

  const buttonElement = document.createElement("div");
  buttonElement.className = "metal linear";
  buttonElement.textContent = `${floor.getNumber()}`;
  buttonElement.dataset.floor = `${floor.getNumber()}`;

  floorElement.appendChild(buttonElement);

  buildingLine.appendChild(floorElement);

  const floorLine = document.createElement("div");
  floorLine.className = "blackLine";

  buildingLine.appendChild(floorLine);
});

mainBuilding.getElevators().forEach((elevator, index) => {
  const elevatorElement = document.createElement("img");
  elevatorElement.id = `elevator-${elevator.elevatorId}`;
  elevatorElement.className = "elevator";
  buildingElevator.appendChild(elevatorElement);
});

let isWorking = false;

function checkFloors(): void {
  while (isWorking) {
    if (mainBuilding.emptyLists()) {
      isWorking = false;
      return;
    } else {
      checkNextStop();
    }
  }
}

function checkNextStop(): void {
  mainBuilding.getElevators().forEach((elevator) => {
    if (elevator.getNumberAreWaiting() > 0 && elevator.getBusy() <= 0) {
      const distance = Math.abs(
        elevator.getCurrentFloor() - elevator.getNextFloor()
      );
      moveToNextFloor(elevator.elevatorId, distance);
    }
  });
}

function moveToNextFloor(elevatorId: number, gap: number): void {
  const targetFloor = mainBuilding.nextFloor(elevatorId);

  const elevatorElement = document.getElementById(`elevator-${elevatorId}`);
  if (elevatorElement !== null) {
    elevatorElement.style.transform = `translateY(${
      (-targetFloor + 1) * 110
    }px)`;
    elevatorElement.style.transition = `transform ${gap * 0.5}s ease`;
  }
}

document.querySelectorAll(".metal.linear").forEach((button) => {
  button.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const floorStr = target.dataset.floor;
    if (floorStr) {
      const floorNumber = parseInt(floorStr);
      const timeToFloor = mainBuilding.AssociatingElevatorFloor(floorNumber);

      if (!isWorking) {
        isWorking = true;
        checkFloors();
      }
    }
  });
});
