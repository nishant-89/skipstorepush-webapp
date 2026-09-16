class EventListenerManager {
  private isEventListenerAttached = false;

  getIsEventListenerAttached(): boolean {
    return this.isEventListenerAttached;
  }

  setIsEventListenerAttached(value: boolean): void {
    this.isEventListenerAttached = value;
  }
}

export const eventListenerManager = new EventListenerManager();
