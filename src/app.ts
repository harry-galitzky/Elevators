import { Building } from "./models/Building";
import { config } from "./config";
import "../public/help.css";

class ElevatorApp {
  private building: Building;
  private buildingContainer: HTMLElement | null;
  private elevatorContainer: HTMLElement;
  private floorContainer: HTMLElement;
  private dingSound: HTMLAudioElement;
  private isSystemActive: boolean = false;

  constructor() {
    this.building = new Building(config.numberOfFloors, config.numberOfElevators);
    this.buildingContainer = document.getElementById("building-container");

    this.elevatorContainer = this.createElement("div", "elevators");
    this.floorContainer = this.createElement("div", "building");

    this.appendToContainer(this.elevatorContainer);
    this.appendToContainer(this.floorContainer);

    this.dingSound = this.createAudioElement("/sounds/ding.mp3");

    this.setupFloors();
    this.setupElevators();

    this.addEventListeners();
  }

  // Creates an HTML element with a given tag and class name
  private createElement(tag: string, className: string): HTMLElement {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  // Appends an element to the building container
  private appendToContainer(element: HTMLElement): void {
    this.buildingContainer?.appendChild(element);
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

      floorElement.appendChild(buttonElement);
      this.floorContainer.appendChild(floorElement);

      const floorLine = this.createElement("div", "blackLine");
      this.floorContainer.appendChild(floorLine);
    });
  }

  // Initializes the elevator elements
  private setupElevators(): void {
    this.building.getElevators().forEach((elevator) => {
      const elevatorElement = this.createElement("img", "elevator");
      elevatorElement.id = `elevator-${elevator.elevatorId}`;
      this.elevatorContainer.appendChild(elevatorElement);
    });
  }

  // Adds event listeners to the floor buttons
  private addEventListeners(): void {
    document.querySelectorAll(".metal.linear").forEach((button) => {
      button.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        const floorStr = target.dataset.floor;
        if (floorStr) {
          const floorNumber = parseInt(floorStr);
          this.building.associateElevatorToFloor(floorNumber);
          target.style.color = "green";

          if (!this.isSystemActive) {
            this.isSystemActive = true;
            this.monitorFloors();
          }
        }
      });
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
    const elevatorElement = document.getElementById(`elevator-${elevatorId}`);
    if (elevatorElement !== null) {
      elevatorElement.style.transform = `translateY(${(-targetFloor + 1) * config.floorHeight}px)`;
      const time = distance * config.elevatorSpeed;
      elevatorElement.style.transition = `transform ${time}s ease`;
      const floorButton = document.querySelector(`[data-floor="${targetFloor}"]`);

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

new ElevatorApp();
