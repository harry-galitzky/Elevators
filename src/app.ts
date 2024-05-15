import { Building } from "./models/Building";
import { config } from "./config";
import "../public/help.css";

const mainBuilding = new Building(config.numberOfFloors, config.numberOfElevators);

const buildingContainer = document.getElementById("building-container");

const buildingElevator = document.createElement("div");
const buildingLine = document.createElement("div");

buildingElevator.className = "elevators";
buildingLine.className = "building";

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

mainBuilding.getElevators().forEach((elevator) => {
  const elevatorElement = document.createElement("img");
  elevatorElement.id = `elevator-${elevator.elevatorId}`;
  elevatorElement.className = "elevator";
  buildingElevator.appendChild(elevatorElement);
});

let isWorking = false;

function checkFloors(): void {
  window.setInterval(() => {
      if (mainBuilding.emptyLists()) {
        isWorking = false;
        return;
      } else {
        checkNextStop();
    }
  }, 10)

}

function checkNextStop(): void {
  mainBuilding.getElevators().forEach((elevator) => {
    if (elevator.getNumberAreWaiting() > 0 && !elevator.getBusy()) {
      const distance = Math.abs(elevator.getCurrentFloor() - elevator.getNextFloor());
      moveToNextFloor(elevator.elevatorId, distance);
    }
    else{

    }
  });
}

function moveToNextFloor(elevatorId: number, gap: number): void {
  const targetFloor = mainBuilding.nextFloor(elevatorId);

  const elevatorElement = document.getElementById(`elevator-${elevatorId}`);
  if (elevatorElement !== null) {
    elevatorElement.style.transform = `translateY(${(-targetFloor + 1) * config.floorHeight}px)`;
    elevatorElement.style.transition = `transform ${gap * config.elevatorSpeed}s ease`;
  }
}

document.querySelectorAll(".metal.linear").forEach((button) => {
  button.addEventListener("click", (e: Event) => {
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
