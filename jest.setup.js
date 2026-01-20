// Mock localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

global.localStorage = localStorageMock;

// Mock AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn().mockReturnValue({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    frequency: {
      setValueAtTime: jest.fn()
    },
    type: 'sine'
  }),
  createGain: jest.fn().mockReturnValue({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn()
    }
  }),
  destination: {},
  currentTime: 0
}));

// Mock bootstrap Modal
global.bootstrap = {
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
};
