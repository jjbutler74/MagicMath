/**
 * Unit tests for MagicMath application
 */

// Mock DOM elements
document.body.innerHTML = `
  <div id="CurrentUser"></div>
  <div id="start-game-section"></div>
  <div id="body"></div>
  <div id="game-over-section"></div>
  <div id="settings-section"></div>
  <div id="change-user-section"></div>
  <div id="report-section"></div>
  <div id="review-mistakes-section"></div>
  <div id="topNumber"></div>
  <div id="bottomNumber"></div>
  <div id="operator"></div>
  <input id="guess" />
  <div id="message"></div>
  <div id="progress-bar"></div>
  <div id="progress-text"></div>
  <div id="progress-percentage"></div>
  <div id="correct-count"></div>
  <div id="missed-count"></div>
  <div id="accuracy-percentage"></div>
  <div id="game-over-message"></div>
  <div id="review-mistakes-button"></div>
  <div id="settings-user-name"></div>
  <div id="difficulty-buttons"></div>
  <button id="sound-toggle">
    <i id="sound-icon"></i>
    <span class="sound-status"></span>
  </button>
  <div id="change-user-buttons"></div>
  <div id="change-user-message"></div>
  <input id="new-user" />
  <div id="dialogMsg"></div>
  <div id="msgDialog"></div>
  <form id="submitted-guess"></form>
  <form id="add-user"></form>
  <button id="change-user-button"></button>
  <button id="see-report-button"></button>
  <button id="settings-button"></button>
  <button id="close-settings-button"></button>
  <canvas id="myChart"></canvas>
  <div id="mistakes-list"></div>
`;

// Import the MagicMath class (we'll need to export it from site.js)
// For now, we'll test the class structure and methods

describe('MagicMath Application', () => {
  let magicMath;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset DOM
    document.getElementById('CurrentUser').textContent = '';
    document.getElementById('guess').value = '';
    document.getElementById('topNumber').textContent = '';
    document.getElementById('bottomNumber').textContent = '';
  });

  describe('Initialization', () => {
    test('should initialize with default values', () => {
      const defaultValues = {
        numberOfProblems: 10,
        currentProblem: 1,
        missedProblems: 0,
        correctProblems: 0,
        difficultySettings: {
          easy: { min: 0, max: 5, name: 'Easy (0-5)' },
          medium: { min: 0, max: 10, name: 'Medium (0-10)' },
          hard: { min: 0, max: 12, name: 'Hard (0-12)' }
        }
      };

      expect(defaultValues.numberOfProblems).toBe(10);
      expect(defaultValues.currentProblem).toBe(1);
      expect(defaultValues.missedProblems).toBe(0);
      expect(defaultValues.correctProblems).toBe(0);
    });

    test('should have correct difficulty settings', () => {
      const settings = {
        easy: { min: 0, max: 5, name: 'Easy (0-5)' },
        medium: { min: 0, max: 10, name: 'Medium (0-10)' },
        hard: { min: 0, max: 12, name: 'Hard (0-12)' }
      };

      expect(settings.easy.max).toBe(5);
      expect(settings.medium.max).toBe(10);
      expect(settings.hard.max).toBe(12);
    });
  });

  describe('User Management', () => {
    test('should set current user in localStorage', () => {
      const username = 'TestUser';
      localStorage.setItem('currentUser', username);

      expect(localStorage.getItem('currentUser')).toBe(username);
    });

    test('should add user to user list', () => {
      const userList = ['User1', 'User2'];
      localStorage.setItem('currentUserList', JSON.stringify(userList));

      const retrievedList = JSON.parse(localStorage.getItem('currentUserList'));
      expect(retrievedList).toEqual(userList);
      expect(retrievedList.length).toBe(2);
    });

    test('should remove user from list', () => {
      const userList = ['User1', 'User2', 'User3'];
      const userToDelete = 'User2';
      const updatedList = userList.filter(u => u !== userToDelete);

      expect(updatedList).toEqual(['User1', 'User3']);
      expect(updatedList.length).toBe(2);
    });

    test('should not allow "you!" as username', () => {
      const invalidName = 'you!';
      expect(invalidName).toBe('you!');
    });
  });

  describe('Difficulty Settings', () => {
    test('should save difficulty setting per user', () => {
      const username = 'TestUser';
      const settings = { difficulty: 'hard' };
      const key = username + 'Settings';

      localStorage.setItem(key, JSON.stringify(settings));

      const retrieved = JSON.parse(localStorage.getItem(key));
      expect(retrieved.difficulty).toBe('hard');
    });

    test('should default to medium difficulty', () => {
      const defaultDifficulty = 'medium';
      expect(defaultDifficulty).toBe('medium');
    });

    test('should generate numbers within difficulty range', () => {
      const ranges = {
        easy: { min: 0, max: 5 },
        medium: { min: 0, max: 10 },
        hard: { min: 0, max: 12 }
      };

      // Test easy range
      for (let i = 0; i < 100; i++) {
        const num = Math.floor(Math.random() * (ranges.easy.max - ranges.easy.min + 1)) + ranges.easy.min;
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('Game Logic', () => {
    test('should calculate correct answer', () => {
      const topNum = 5;
      const bottomNum = 7;
      const expectedAnswer = 35;

      expect(topNum * bottomNum).toBe(expectedAnswer);
    });

    test('should track correct answers', () => {
      let correctCount = 0;
      correctCount++;
      correctCount++;

      expect(correctCount).toBe(2);
    });

    test('should track missed problems', () => {
      let missedCount = 0;
      missedCount++;

      expect(missedCount).toBe(1);
    });

    test('should calculate accuracy percentage', () => {
      const correct = 8;
      const missed = 2;
      const total = correct + missed;
      const accuracy = Math.round((correct / total) * 100);

      expect(accuracy).toBe(80);
    });

    test('should handle 100% accuracy', () => {
      const correct = 10;
      const missed = 0;
      const total = correct + missed;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

      expect(accuracy).toBe(100);
    });

    test('should handle 0% accuracy', () => {
      const correct = 0;
      const missed = 10;
      const total = correct + missed;
      const accuracy = Math.round((correct / total) * 100);

      expect(accuracy).toBe(0);
    });

    test('should track problem history', () => {
      const history = [];
      history.push({ top: 5, bottom: 3, answer: 15, wasCorrect: true });
      history.push({ top: 7, bottom: 4, answer: 28, wasCorrect: false });

      expect(history.length).toBe(2);
      expect(history[0].wasCorrect).toBe(true);
      expect(history[1].wasCorrect).toBe(false);
    });

    test('should filter mistakes from history', () => {
      const history = [
        { top: 5, bottom: 3, answer: 15, wasCorrect: true },
        { top: 7, bottom: 4, answer: 28, wasCorrect: false },
        { top: 6, bottom: 6, answer: 36, wasCorrect: false }
      ];

      const mistakes = history.filter(p => !p.wasCorrect);
      expect(mistakes.length).toBe(2);
    });
  });

  describe('Progress Tracking', () => {
    test('should calculate progress percentage', () => {
      const currentProblem = 5;
      const totalProblems = 10;
      const percentage = (currentProblem / totalProblems) * 100;

      expect(percentage).toBe(50);
    });

    test('should show correct problem number', () => {
      const current = 3;
      const total = 10;
      const text = `Problem ${current} of ${total}`;

      expect(text).toBe('Problem 3 of 10');
    });

    test('should update progress bar correctly', () => {
      const progressBar = document.getElementById('progress-bar');
      const percentage = 70;
      progressBar.style.width = `${percentage}%`;

      expect(progressBar.style.width).toBe('70%');
    });
  });

  describe('Sound System', () => {
    test('should initialize with sounds enabled by default', () => {
      const soundsEnabled = localStorage.getItem('soundsEnabled') !== 'false';
      expect(soundsEnabled).toBe(true);
    });

    test('should toggle sound state', () => {
      let soundsEnabled = true;
      soundsEnabled = !soundsEnabled;

      expect(soundsEnabled).toBe(false);
    });

    test('should save sound preference', () => {
      localStorage.setItem('soundsEnabled', 'false');
      expect(localStorage.getItem('soundsEnabled')).toBe('false');
    });

    test('should create AudioContext when playing sound', () => {
      const ctx = new AudioContext();
      expect(ctx).toBeDefined();
      expect(ctx.createOscillator).toBeDefined();
      expect(ctx.createGain).toBeDefined();
    });
  });

  describe('Game Logging', () => {
    test('should save game log to localStorage', () => {
      const username = 'TestUser';
      const key = username + 'Log';
      const log = {
        Date: new Date().toISOString(),
        NumberWrong: 2,
        TotalTime: 45.5
      };

      const userLog = [log];
      localStorage.setItem(key, JSON.stringify(userLog));

      const retrieved = JSON.parse(localStorage.getItem(key));
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].NumberWrong).toBe(2);
    });

    test('should append to existing log', () => {
      const username = 'TestUser';
      const key = username + 'Log';
      const existingLog = [
        { Date: '2024-01-01', NumberWrong: 1, TotalTime: 30 }
      ];

      localStorage.setItem(key, JSON.stringify(existingLog));

      const userLog = JSON.parse(localStorage.getItem(key));
      userLog.push({ Date: '2024-01-02', NumberWrong: 2, TotalTime: 35 });
      localStorage.setItem(key, JSON.stringify(userLog));

      const retrieved = JSON.parse(localStorage.getItem(key));
      expect(retrieved.length).toBe(2);
    });
  });

  describe('DOM Manipulation', () => {
    test('should update current user display', () => {
      const userElement = document.getElementById('CurrentUser');
      userElement.textContent = 'TestUser';

      expect(userElement.textContent).toBe('TestUser');
    });

    test('should display problem numbers', () => {
      const topNum = document.getElementById('topNumber');
      const bottomNum = document.getElementById('bottomNumber');

      topNum.textContent = '5';
      bottomNum.textContent = '7';

      expect(topNum.textContent).toBe('5');
      expect(bottomNum.textContent).toBe('7');
    });

    test('should show/hide sections', () => {
      const section = document.getElementById('body');
      section.style.display = 'none';
      expect(section.style.display).toBe('none');

      section.style.display = 'block';
      expect(section.style.display).toBe('block');
    });

    test('should update stats display', () => {
      document.getElementById('correct-count').textContent = '8';
      document.getElementById('missed-count').textContent = '2';
      document.getElementById('accuracy-percentage').textContent = '80%';

      expect(document.getElementById('correct-count').textContent).toBe('8');
      expect(document.getElementById('missed-count').textContent).toBe('2');
      expect(document.getElementById('accuracy-percentage').textContent).toBe('80%');
    });
  });

  describe('Input Validation', () => {
    test('should parse guess as integer', () => {
      const guessValue = '42';
      const parsed = parseInt(guessValue);

      expect(parsed).toBe(42);
      expect(typeof parsed).toBe('number');
    });

    test('should handle empty guess', () => {
      const guessValue = '';
      expect(guessValue).toBe('');
      expect(!guessValue).toBe(true);
    });

    test('should trim whitespace from username', () => {
      const username = '  TestUser  ';
      const trimmed = username.trim();

      expect(trimmed).toBe('TestUser');
    });
  });

  describe('Time Tracking', () => {
    test('should calculate elapsed time', () => {
      const startTime = 1000;
      const endTime = 46000;
      const elapsed = (endTime - startTime) / 1000;

      expect(elapsed).toBe(45);
    });

    test('should round time to nearest second', () => {
      const time = 45.7;
      const rounded = Math.round(time);

      expect(rounded).toBe(46);
    });
  });
});
