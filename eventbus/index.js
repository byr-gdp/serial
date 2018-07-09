class EventBus {
  constructor() {
    this.listeners = [];
  }

  on(type, cb) {
    this.listeners.push({
      type,
      cb,
      once: false
    });
  }

  addListener(type, cb) {
    this.on(type, cb);
  }

  emit(type, ...args) {
    const listeners = this.listeners.filter(listener => listener.type === type);
    listeners.forEach(listener => {
      listener.cb.apply(null, args);
    });

    listeners.forEach(listener => {
      if (listener.once) {
        this.removeListener(type, listener.cb);
      }
    });
  }

  once(type, cb) {
    this.listeners.push({
      type,
      cb,
      once: true,
    });
  }

  removeListener(type, cb) {
    this.listeners = this.listeners.filter(listener => listener.type !== type || listener.cb !== cb);
  }

  removeAllListeners() {
    this.listeners.forEach(listener => this.removeListener(listener.type, listener.cb));
  }
}

module.exports = exports = EventBus;