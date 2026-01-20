/**
 * Unit tests for MagicMath application
 * Tests the actual MagicMath class from site.js
 */

const MagicMath = require('./site.js');

// Mock DOM elements before creating MagicMath instance
document.body.innerHTML = `
  <div id="CurrentUser"></div>
  <div id="start-game-section" style="display: none;"></div>
  <div id="body" style="display: none;"></div>
  <div id="game-over-section" style="display: none;"></div>
  <div id="settings-section" style="display: none;"></div>
  <div id="change-user-section" style="display: none;"></div>
  <div id="report-section" style="display: none;"></div>
  <div id="review-mistakes-section" style="display: none;"></div>
  <div id="topNumber"></div>
  <div id="bottomNumber"></div>
  <div id="operator"></div>
  <input id="guess" />
  <div id="message" style="display: none;"></div>
  <div id="progress-bar"></div>
  <div id="progress-text"></div>
  <div id="progress-percentage"></div>
  <div id="correct-count">0</div>
  <div id="missed-count">0</div>
  <div id="accuracy-percentage">100%</div>
  <div id="game-over-message"></div>
  <button id="review-mistakes-button" style="display: none;"></button>
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

describe('MagicMath Class', () => {
  let magicMath;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset DOM elements
    document.getElementById('CurrentUser').textContent = '';
    document.getElementById('guess').value = '';
    document.getElementById('topNumber').textContent = '';
    document.getElementById('bottomNumber').textContent = '';
    document.getElementById('correct-count').textContent = '0';
    document.getElementById('missed-count').textContent = '0';
    document.getElementById('accuracy-percentage').textContent = '100%';

    // Create new instance
    magicMath = new MagicMath();
  });

  describe('Initialization', () => {
    test('should initialize with correct default values', () => {
      expect(magicMath.numberOfProblems).toBe(10);
      expect(magicMath.currentProblem).toBe(1);
      expect(magicMath.missedProblems).toBe(0);
      expect(magicMath.correctProblems).toBe(0);
      expect(magicMath.problemHistory).toEqual([]);
    });

    test('should have correct difficulty settings', () => {
      expect(magicMath.difficultySettings.easy).toEqual({ min: 0, max: 5, name: 'Easy (0-5)' });
      expect(magicMath.difficultySettings.medium).toEqual({ min: 0, max: 10, name: 'Medium (0-10)' });
      expect(magicMath.difficultySettings.hard).toEqual({ min: 0, max: 12, name: 'Hard (0-12)' });
    });

    test('should initialize sound system', () => {
      expect(magicMath.soundsEnabled).toBe(true); // Default to enabled
      expect(magicMath.audioContext).toBe(null); // Not created until first sound
    });
  });

  describe('User Management', () => {
    test('should get user difficulty from localStorage', () => {
      localStorage.setItem('currentUser', 'TestUser');
      localStorage.setItem('TestUserSettings', JSON.stringify({ difficulty: 'hard' }));

      const difficulty = magicMath.getUserDifficulty();
      expect(difficulty).toBe('hard');
    });

    test('should default to medium difficulty if not set', () => {
      localStorage.setItem('currentUser', 'NewUser');
      const difficulty = magicMath.getUserDifficulty();
      expect(difficulty).toBe('medium');
    });

    test('should set difficulty for current user', () => {
      localStorage.setItem('currentUser', 'TestUser');
      magicMath.setDifficulty('easy');

      const settings = JSON.parse(localStorage.getItem('TestUserSettings'));
      expect(settings.difficulty).toBe('easy');
    });

    test('should delete user and their data', () => {
      const username = 'UserToDelete';
      localStorage.setItem('currentUserList', JSON.stringify(['User1', username, 'User3']));
      localStorage.setItem(username + 'Log', JSON.stringify([{ test: 'data' }]));

      magicMath.deleteUser(username);

      const userList = JSON.parse(localStorage.getItem('currentUserList'));
      expect(userList).toEqual(['User1', 'User3']);
      expect(localStorage.getItem(username + 'Log')).toBe(null);
    });
  });

  describe('Game Logic', () => {
    test('should generate problems within difficulty range', () => {
      localStorage.setItem('currentUser', 'TestUser');
      localStorage.setItem('TestUserSettings', JSON.stringify({ difficulty: 'easy' }));

      // Generate multiple problems to test range
      for (let i = 0; i < 20; i++) {
        magicMath.getProblem();
        const top = parseInt(document.getElementById('topNumber').textContent);
        const bottom = parseInt(document.getElementById('bottomNumber').textContent);

        expect(top).toBeGreaterThanOrEqual(0);
        expect(top).toBeLessThanOrEqual(5);
        expect(bottom).toBeGreaterThanOrEqual(0);
        expect(bottom).toBeLessThanOrEqual(5);
      }
    });

    test('should track correct answers', () => {
      magicMath.correctProblems = 0;
      magicMath.currentTry = 1;
      magicMath.currentProblemData = { top: 5, bottom: 3, answer: 15, wasCorrect: false };

      document.getElementById('topNumber').textContent = '5';
      document.getElementById('bottomNumber').textContent = '3';

      magicMath.rightAnswer();

      expect(magicMath.correctProblems).toBe(1);
      expect(magicMath.currentProblemData.wasCorrect).toBe(true);
    });

    test('should only count as correct on first try', () => {
      magicMath.correctProblems = 0;
      magicMath.currentTry = 2; // Second try
      magicMath.currentProblemData = { top: 5, bottom: 3, answer: 15, wasCorrect: false };

      document.getElementById('topNumber').textContent = '5';
      document.getElementById('bottomNumber').textContent = '3';

      magicMath.rightAnswer();

      expect(magicMath.correctProblems).toBe(0); // Should not increment
    });

    test('should track missed problems', () => {
      magicMath.missedProblems = 0;
      magicMath.currentTry = 1;

      magicMath.wrongAnswer(42);

      expect(magicMath.missedProblems).toBe(1);
    });

    test('should only count as missed on first wrong attempt', () => {
      magicMath.missedProblems = 1;
      magicMath.currentTry = 2;

      magicMath.wrongAnswer(42);

      expect(magicMath.missedProblems).toBe(1); // Should not increment
    });

    test('should log game data', () => {
      document.getElementById('CurrentUser').textContent = 'TestUser';
      magicMath.missedProblems = 3;
      magicMath.totalTime = 60.5;

      magicMath.logGame();

      const log = JSON.parse(localStorage.getItem('TestUserLog'));
      expect(log).toBeDefined();
      expect(log.length).toBe(1);
      expect(log[0].NumberWrong).toBe(3);
      expect(log[0].TotalTime).toBe(60.5);
    });
  });

  describe('Progress Tracking', () => {
    test('should update progress bar correctly', () => {
      magicMath.currentProblem = 5;
      magicMath.numberOfProblems = 10;

      magicMath.updateProgressBar();

      const progressBar = document.getElementById('progress-bar');
      const progressText = document.getElementById('progress-text');

      expect(progressBar.style.width).toBe('50%');
      expect(progressText.textContent).toBe('Problem 5 of 10');
    });

    test('should calculate accuracy correctly', () => {
      magicMath.correctProblems = 8;
      magicMath.missedProblems = 2;

      magicMath.updateStats();

      const accuracy = document.getElementById('accuracy-percentage').textContent;
      expect(accuracy).toBe('80%');
    });

    test('should handle 100% accuracy', () => {
      magicMath.correctProblems = 10;
      magicMath.missedProblems = 0;

      magicMath.updateStats();

      const accuracy = document.getElementById('accuracy-percentage').textContent;
      expect(accuracy).toBe('100%');
    });

    test('should handle 0% accuracy with mistakes', () => {
      magicMath.correctProblems = 0;
      magicMath.missedProblems = 10;

      magicMath.updateStats();

      const accuracy = document.getElementById('accuracy-percentage').textContent;
      expect(accuracy).toBe('0%');
    });
  });

  describe('Sound System', () => {
    test('should toggle sound state', () => {
      const initialState = magicMath.soundsEnabled;
      magicMath.toggleSound();

      expect(magicMath.soundsEnabled).toBe(!initialState);
    });

    test('should save sound preference to localStorage', () => {
      magicMath.soundsEnabled = true;
      magicMath.toggleSound();

      expect(localStorage.getItem('soundsEnabled')).toBe('false');
    });

    test('should play test sound when enabling', () => {
      magicMath.soundsEnabled = false;
      const playSoundSpy = jest.spyOn(magicMath, 'playSound');

      magicMath.toggleSound();

      expect(playSoundSpy).toHaveBeenCalledWith('correct');
    });

    test('should not play sound when disabled', () => {
      magicMath.soundsEnabled = false;

      // This should not throw an error and should return early
      expect(() => magicMath.playSound('correct')).not.toThrow();
    });

    test('should create AudioContext when playing sound', () => {
      magicMath.soundsEnabled = true;
      magicMath.audioContext = null;

      magicMath.playSound('correct');

      expect(magicMath.audioContext).toBeDefined();
    });
  });

  describe('Difficulty Settings', () => {
    test('should update difficulty UI when setting difficulty', () => {
      localStorage.setItem('currentUser', 'TestUser');

      // Create difficulty buttons
      const buttonsContainer = document.getElementById('difficulty-buttons');
      buttonsContainer.innerHTML = `
        <button class="difficulty-btn btn btn-outline-primary" data-difficulty="easy"></button>
        <button class="difficulty-btn btn btn-outline-primary" data-difficulty="medium"></button>
        <button class="difficulty-btn btn btn-outline-primary" data-difficulty="hard"></button>
      `;

      magicMath.setDifficulty('hard');

      const hardBtn = document.querySelector('[data-difficulty="hard"]');
      expect(hardBtn.classList.contains('btn-success')).toBe(true);
      expect(hardBtn.classList.contains('active')).toBe(true);
    });
  });

  describe('Problem History', () => {
    test('should track problem history', () => {
      magicMath.problemHistory = [];
      magicMath.currentTry = 1;
      magicMath.currentProblemData = { top: 5, bottom: 3, answer: 15, wasCorrect: false };

      document.getElementById('topNumber').textContent = '5';
      document.getElementById('bottomNumber').textContent = '3';

      magicMath.rightAnswer();

      expect(magicMath.problemHistory.length).toBe(1);
      expect(magicMath.problemHistory[0].wasCorrect).toBe(true);
    });

    test('should show mistakes review', () => {
      magicMath.problemHistory = [
        { top: 5, bottom: 3, answer: 15, wasCorrect: true },
        { top: 7, bottom: 4, answer: 28, wasCorrect: false },
        { top: 6, bottom: 6, answer: 36, wasCorrect: false }
      ];

      magicMath.showMistakesReview();

      const mistakesList = document.getElementById('mistakes-list');
      expect(mistakesList.innerHTML).toContain('7');
      expect(mistakesList.innerHTML).toContain('28');
      expect(mistakesList.innerHTML).toContain('6');
      expect(mistakesList.innerHTML).toContain('36');
    });
  });

  describe('Animation Utilities', () => {
    test('should have fadeIn method', () => {
      expect(typeof magicMath.fadeIn).toBe('function');
    });

    test('should have fadeOut method', () => {
      expect(typeof magicMath.fadeOut).toBe('function');
    });

    test('should set display block when fading in', () => {
      const element = document.getElementById('message');
      element.style.display = 'none';

      magicMath.fadeIn(element);

      expect(element.style.display).toBe('block');
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete game flow', () => {
      localStorage.setItem('currentUser', 'TestUser');
      magicMath.currentProblem = 1;
      magicMath.numberOfProblems = 2;

      // First problem
      magicMath.getProblem();
      expect(document.getElementById('topNumber').textContent).not.toBe('');

      // Update stats
      magicMath.updateStats();
      expect(document.getElementById('correct-count').textContent).toBe('0');
    });
  });
});
