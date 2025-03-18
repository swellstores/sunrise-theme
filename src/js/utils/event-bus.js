class EventBus {
  listeners = new Map();

  on(eventName, callback) {
    let list = this.listeners.get(eventName);

    if (!list) {
      list = new Set();
      this.listeners.set(eventName, list);
    }

    list.add(callback);

    return () => {
      list.delete(callback);
    }
  }

  off(eventName, callback) {
    let list = this.listeners.get(eventName);

    if (!list) {
      return;
    }

    list.delete(callback);
  }

  emit(eventName, data) {
    const list = this.listeners.get(eventName);

    if (!list) {
      return;
    }

    for (const callback of list) {
      callback(data);
    }
  }
}

export default new EventBus();
