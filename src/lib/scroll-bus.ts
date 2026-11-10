type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeScroll(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyScroll() {
  listeners.forEach((listener) => listener());
}
