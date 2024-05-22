import { Building } from "./models/Building";
import { config } from "./config";
import "../public/help.css";

class ElevatorApp {
  private buildingId: number;
  private building: Building;
  private buildingContainer: HTMLElement | null;
  private buildingDiv: HTMLElement;
  private elevatorContainer: HTMLElement;
  private floorContainer: HTMLElement;
  private dingSound: HTMLAudioElement;
  private isSystemActive: boolean = false;

  constructor(_building: Building, _buildingId: number) {
    this.building = _building;
    this.buildingId = _buildingId;
    this.buildingContainer = document.getElementById("building-container");

    this.buildingDiv = this.createElement("div", "mainBuilding");
    this.elevatorContainer = this.createElement("div", "elevators");
    this.floorContainer = this.createElement("div", "building");

    this.buildingContainer?.appendChild(this.buildingDiv);
    this.appendToContainer(this.elevatorContainer);
    this.appendToContainer(this.floorContainer);

    this.dingSound = this.createAudioElement("/sounds/ding.mp3");

    this.setupFloors();
    this.setupElevators();
  }

  // Creates an HTML element with a given tag and class name
  private createElement(tag: string, className: string): HTMLElement {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  // Appends an element to the building container
  private appendToContainer(element: HTMLElement): void {
    this.buildingDiv.appendChild(element);
  }

  // Creates an audio element for the ding sound
  private createAudioElement(src: string): HTMLAudioElement {
    const audio = document.createElement('audio') as HTMLAudioElement;
    audio.src = src;
    audio.controls = true;
    return audio;
  }

  // Initializes the floor elements and buttons
  private setupFloors(): void {
    this.building.getFloors().forEach((floor) => {
      const floorElement = this.createElement("div", "floor");

      const buttonElement = this.createElement("div", "metal linear");
      buttonElement.textContent = `${floor.getNumber()}`;
      buttonElement.dataset.floor = `${floor.getNumber()}`;
      buttonElement.dataset.buildingId = `${this.buildingId}`;

      buttonElement.addEventListener("click", (e: Event) => this.handleFloorButtonClick(e));

      floorElement.id = `${this.buildingId}`;
      floorElement.appendChild(buttonElement);
      this.floorContainer.appendChild(floorElement);

      const floorLine = this.createElement("div", "blackLine");
      this.floorContainer.appendChild(floorLine);
    });
  }

  // Handles the click event for the floor buttons
  private handleFloorButtonClick(e: Event): void {
    const target = e.target as HTMLElement;
    const floorStr = target.dataset.floor;
    if (floorStr) {
      const floorNumber = parseInt(floorStr);
    if (!this.building.InvitedFloor(floorNumber)) {
      target.style.color = "green";
    }
      this.building.associateElevatorToFloor(floorNumber);
      if (!this.isSystemActive) {
        this.isSystemActive = true;
        this.monitorFloors();
      }
    }
  }

  // Initializes the elevator elements
  private setupElevators(): void {
    this.building.getElevators().forEach((elevator) => {
      const elevatorElement = this.createElement("img", "elevator");
      elevatorElement.id = `elevator-${elevator.elevatorId}-${this.buildingId}`;
      this.elevatorContainer.appendChild(elevatorElement);
    });
  }

  // Monitors the floors to check if there are pending requests
  private monitorFloors(): void {
    window.setInterval(() => {
      if (this.building.areAllRequestsHandled()) {
        this.isSystemActive = false;
        return;
      } else {
        this.processNextStop();
      }
    }, 10);
  }

  // Processes the next stop for each elevator
  private processNextStop(): void {
    this.building.getElevators().forEach((elevator) => {
      if (elevator.hasPendingRequests() && !elevator.isBusy()) {
        const distance = Math.abs(elevator.getTargetFloor() - elevator.getNextRequestFloor());
        this.moveElevatorToNextFloor(elevator.elevatorId, distance);
      }
    });
  }

  // Moves the elevator to the next requested floor
  private moveElevatorToNextFloor(elevatorId: number, distance: number): void {
    const targetFloor = this.building.getNextRequestFloor(elevatorId);
    const elevatorElement = document.getElementById(`elevator-${elevatorId}-${this.buildingId}`);
    if (elevatorElement !== null) {
      elevatorElement.style.transform = `translateY(${(-targetFloor + 1) * config.floorHeight}px)`;
      const time = distance * config.elevatorSpeed;
      elevatorElement.style.transition = `transform ${time}s ease`;
      const floorButton = document.querySelector(`[data-floor="${targetFloor}"][data-building-id="${this.buildingId}"]`);

      setTimeout(() => {
        this.dingSound.currentTime = 0;
        this.dingSound.play();
        this.building.releaseFloor(targetFloor)
        if (floorButton) {
          (floorButton as HTMLElement).style.color = 'hsla(0, 0%, 20%, 1)';
        }
      }, time * 1000);
    }
  }
}

config.Buildings.forEach((config, index) => {
  new ElevatorApp(new Building(config.numberOfFloors, config.numberOfElevators), index);
});
