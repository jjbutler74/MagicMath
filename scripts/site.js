// Modern ES6+ Magic Math Application
class MagicMath {
  constructor() {
    this.numberOfProblems = 10;
    this.currentProblem = 1;
    this.missedProblems = 0;
    this.correctProblems = 0;
    this.totalAttempts = 0;
    this.startTime = 0;
    this.totalTime = 0;
    this.currentTry = 1;
    this.processing = false;
    this.startCurrentProblem = 0;
    this.problemHistory = []; // Track all problems in current game

    this.initializeApp();
  }

  initializeApp() {
    // Get Current User
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.noUser();
      this.changeUser();
    } else {
      document.getElementById('CurrentUser').textContent = currentUser;
      document.getElementById('start-game-section').style.display = 'block';
    }

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Submitted Guess
    document.getElementById('submitted-guess').addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.processing) return;

      const guessValue = document.getElementById('guess').value;
      if (!guessValue) return;

      const answerNum = parseInt(document.getElementById('topNumber').textContent) *
                        parseInt(document.getElementById('bottomNumber').textContent);

      if (parseInt(guessValue) === answerNum) {
        this.rightAnswer();
      } else {
        this.wrongAnswer(answerNum);
      }
    });

    // Change User button
    document.getElementById('change-user-button').addEventListener('click', () => {
      this.changeUser();
    });

    // See Report button
    document.getElementById('see-report-button').addEventListener('click', () => {
      this.seeReport();
    });

    // Add User Submit
    document.getElementById('add-user').addEventListener('submit', (e) => {
      e.preventDefault();
      const newUser = document.getElementById('new-user').value.trim();
      if (!newUser) return;

      // Check if name = you!
      if (newUser === 'you!') {
        document.getElementById('dialogMsg').textContent = "Don't be a smarty pants, pick another name!";
        const msgDialog = new bootstrap.Modal(document.getElementById('msgDialog'));
        msgDialog.show();
        return;
      }

      // Get User List
      let currentUserList = JSON.parse(localStorage.getItem('currentUserList'));
      if (!currentUserList) {
        currentUserList = [];
      } else {
        // Check if user already exists
        if (currentUserList.includes(newUser)) {
          const sentDialog = new bootstrap.Modal(document.getElementById('sentDialog'));
          sentDialog.show();
          return;
        }
      }

      currentUserList.push(newUser);
      localStorage.setItem('currentUserList', JSON.stringify(currentUserList));

      // Set User and Start New Game
      this.newUser(newUser);
    });

    // Start button
    document.getElementById('start-button').addEventListener('click', () => {
      document.getElementById('start-game-section').style.display = 'none';
      this.startGame();
    });

    // Play again button
    document.getElementById('play-again-button').addEventListener('click', () => {
      document.getElementById('game-over-section').style.display = 'none';
      document.getElementById('review-mistakes-section').style.display = 'none';
      this.startGame();
    });

    // Review mistakes button
    document.getElementById('review-mistakes-button').addEventListener('click', () => {
      this.showMistakesReview();
    });

    // Close review button
    document.getElementById('close-review-button').addEventListener('click', () => {
      document.getElementById('review-mistakes-section').style.display = 'none';
      document.getElementById('game-over-section').style.display = 'block';
    });

    // Only allow numbers for answers
    document.getElementById('guess').addEventListener('keyup', function() {
      if (/\D/g.test(this.value)) {
        this.value = this.value.replace(/\D/g, '');
      }
    });

    // Change User button(s) - delegated event
    document.getElementById('change-user-buttons').addEventListener('click', (e) => {
      if (e.target.classList.contains('user-btn')) {
        const currentUser = e.target.getAttribute('value');
        this.newUser(currentUser);
      }
    });

    // Delete User button(s) - delegated event
    document.getElementById('change-user-buttons').addEventListener('click', (e) => {
      if (e.target.classList.contains('user-delete-btn') ||
          e.target.closest('.user-delete-btn')) {
        const btn = e.target.classList.contains('user-delete-btn') ?
                    e.target : e.target.closest('.user-delete-btn');
        const userToDelete = btn.getAttribute('value');
        this.deleteUser(userToDelete);

        // Remove User from screen list
        btn.closest('p').remove();

        // If deleted user is the current user
        const currentUser = document.getElementById('CurrentUser').textContent;
        if (userToDelete === currentUser) {
          localStorage.removeItem('currentUser');
          this.noUser();
        }
      }
    });
  }

  startGame() {
    const bodySection = document.getElementById('body');
    bodySection.style.display = 'block';
    bodySection.style.opacity = '0';
    this.fadeIn(bodySection);

    this.currentProblem = 1;
    this.missedProblems = 0;
    this.correctProblems = 0;
    this.totalAttempts = 0;
    this.startTime = new Date().getTime();
    this.totalTime = 0;
    this.problemHistory = []; // Reset problem history

    // Reset stats display
    this.updateStats();

    // Get 1st problem
    this.getProblem();
  }

  changeUser() {
    document.getElementById('body').style.display = 'none';
    document.getElementById('start-game-section').style.display = 'none';
    document.getElementById('game-over-section').style.display = 'none';
    document.getElementById('report-section').style.display = 'none';
    document.getElementById('new-user').value = '';
    document.getElementById('change-user-section').style.display = 'block';

    let userHtml = '';
    let userMessage = 'Add User';

    // Get User Array
    const currentUserList = JSON.parse(localStorage.getItem('currentUserList'));
    if (currentUserList) {
      userMessage = 'Change or Add User';
      currentUserList.forEach(value => {
        userHtml += `<p><button type="button" value="${value}" class="user-btn btn btn-info btn-lg">${value}</button>`;
        userHtml += ` <button type="button" value="${value}" class="user-delete-btn btn btn-sm"><i class="bi bi-trash"></i></button></p>`;
      });
    }

    document.getElementById('change-user-buttons').innerHTML = userHtml;
    document.getElementById('change-user-message').textContent = userMessage;
  }

  noUser() {
    document.getElementById('CurrentUser').textContent = 'you!';
  }

  newUser(currentUser) {
    localStorage.setItem('currentUser', currentUser);
    document.getElementById('CurrentUser').textContent = currentUser;
    document.getElementById('change-user-section').style.display = 'none';
    document.getElementById('report-section').style.display = 'none';
    document.getElementById('start-game-section').style.display = 'block';
  }

  deleteUser(userToDelete) {
    // Delete Users from Array
    let currentUserList = JSON.parse(localStorage.getItem('currentUserList'));
    if (currentUserList) {
      // Get User Position in Array
      const userToDeleteArrayPosition = currentUserList.indexOf(userToDelete);
      // Cut User out of the Array
      currentUserList.splice(userToDeleteArrayPosition, 1);
      // Save User List
      localStorage.setItem('currentUserList', JSON.stringify(currentUserList));
    }

    // Delete Users Log
    const key = userToDelete + 'Log';
    localStorage.removeItem(key);
  }

  getProblem() {
    this.currentTry = 1;
    this.startCurrentProblem = new Date().getTime();
    const topNum = Math.floor(Math.random() * 13); // 0 to 12
    const bottomNum = Math.floor(Math.random() * 13); // 0 to 12

    // Store current problem
    this.currentProblemData = {
      top: topNum,
      bottom: bottomNum,
      answer: topNum * bottomNum,
      wasCorrect: false
    };

    document.getElementById('topNumber').textContent = topNum;
    document.getElementById('operator').textContent = '×';
    document.getElementById('bottomNumber').textContent = bottomNum;
    document.getElementById('guess').value = '';
    document.getElementById('message').style.display = 'none';
    document.getElementById('guess').focus();
    this.processing = false;

    // Update progress bar
    this.updateProgressBar();
  }

  updateProgressBar() {
    const percentage = (this.currentProblem / this.numberOfProblems) * 100;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');

    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressText.textContent = `Problem ${this.currentProblem} of ${this.numberOfProblems}`;
    progressPercentage.textContent = `${Math.round(percentage)}%`;
  }

  updateStats() {
    document.getElementById('correct-count').textContent = this.correctProblems;
    document.getElementById('missed-count').textContent = this.missedProblems;

    // Calculate accuracy
    const totalProblems = this.correctProblems + this.missedProblems;
    let accuracy = 100;
    if (totalProblems > 0) {
      accuracy = Math.round((this.correctProblems / totalProblems) * 100);
    }
    document.getElementById('accuracy-percentage').textContent = `${accuracy}%`;
  }

  rightAnswer() {
    this.processing = true;

    // Only count as correct if it's the first try
    if (this.currentTry === 1) {
      this.correctProblems++;
      this.currentProblemData.wasCorrect = true;
    }

    // Save problem to history
    this.problemHistory.push({ ...this.currentProblemData });

    const messageEl = document.getElementById('message');
    messageEl.textContent = 'You got it!';
    this.fadeIn(messageEl);
    setTimeout(() => this.fadeOut(messageEl), 500);

    this.totalTime = (new Date().getTime() - this.startTime) / 1000;
    const totalTimeRounded = Math.round(this.totalTime);

    // Update stats
    this.updateStats();

    if (this.currentProblem < this.numberOfProblems) {
      this.currentProblem++;
      setTimeout(() => this.getProblem(), 1000);
    } else {
      setTimeout(() => {
        document.getElementById('body').style.display = 'none';

        // Show/hide review button based on if there are mistakes
        const reviewBtn = document.getElementById('review-mistakes-button');
        if (this.missedProblems > 0) {
          reviewBtn.style.display = 'inline-block';
        } else {
          reviewBtn.style.display = 'none';
        }

        document.getElementById('game-over-message').textContent =
          `Good job! You only missed ${this.missedProblems} problems and it only took you ${totalTimeRounded} seconds!`;
        const gameOverSection = document.getElementById('game-over-section');
        gameOverSection.style.display = 'block';
        gameOverSection.style.opacity = '0';
        this.fadeIn(gameOverSection);
      }, 1000);

      this.logGame();
    }
  }

  logGame() {
    const key = document.getElementById('CurrentUser').textContent + 'Log';
    const log = {
      Date: new Date().toISOString(),
      NumberWrong: this.missedProblems,
      TotalTime: this.totalTime
    };

    let userLog = JSON.parse(localStorage.getItem(key));
    if (!userLog) {
      userLog = [];
    }
    userLog.push(log);
    localStorage.setItem(key, JSON.stringify(userLog));
  }

  wrongAnswer(answerNum) {
    // Only count as missed on the first wrong attempt
    if (this.currentTry === 1) {
      this.missedProblems++;
      this.updateStats();
    }

    this.currentTry++;
    const messageEl = document.getElementById('message');

    if (this.currentTry < 4) {
      messageEl.textContent = 'Try Again';
      this.fadeIn(messageEl);
      setTimeout(() => this.fadeOut(messageEl), 500);
    } else {
      messageEl.textContent = `The Answer is ${answerNum}`;
      this.fadeIn(messageEl);
      setTimeout(() => this.fadeOut(messageEl), 1000);
    }
    document.getElementById('guess').select();
  }

  showMistakesReview() {
    document.getElementById('game-over-section').style.display = 'none';
    document.getElementById('review-mistakes-section').style.display = 'block';

    const mistakesList = document.getElementById('mistakes-list');
    const mistakes = this.problemHistory.filter(p => !p.wasCorrect);

    let html = '<div class="mistakes-grid">';
    mistakes.forEach((problem) => {
      html += `
        <div class="mistake-card">
          <div class="mistake-number">Problem ${this.problemHistory.indexOf(problem) + 1}</div>
          <div class="mistake-problem">
            <div class="mistake-top">${problem.top}</div>
            <div class="mistake-bottom">× ${problem.bottom}</div>
            <div class="mistake-line"></div>
            <div class="mistake-answer">${problem.answer}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    mistakesList.innerHTML = html;
  }

  seeReport() {
    document.getElementById('body').style.display = 'none';
    document.getElementById('start-game-section').style.display = 'none';
    document.getElementById('game-over-section').style.display = 'none';
    document.getElementById('change-user-section').style.display = 'none';
    document.getElementById('review-mistakes-section').style.display = 'none';
    document.getElementById('report-section').style.display = 'block';

    const key = document.getElementById('CurrentUser').textContent + 'Log';
    const userLog = JSON.parse(localStorage.getItem(key));

    const chartDates = [];
    const chartNumberWrong = [];
    const chartTime = [];

    if (userLog) {
      userLog.forEach(value => {
        const date = new Date(value.Date);
        const formatDate = date.toLocaleDateString('en-US');
        chartDates.push(formatDate);
        chartNumberWrong.push(value.NumberWrong);
        chartTime.push(value.TotalTime);
      });
    }

    this.drawChart(chartDates, chartNumberWrong, chartTime);
  }

  drawChart(labels, wrongData, timeData) {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    // Destroy previous chart if it exists
    if (window.magicMathChart) {
      window.magicMathChart.destroy();
    }

    // Get largest chart value for scaling
    const combinedArray = [...wrongData, ...timeData];
    const largest = Math.max(...combinedArray);

    let suggestedMax;
    if (largest <= 10) suggestedMax = 10;
    else if (largest <= 20) suggestedMax = 20;
    else if (largest <= 40) suggestedMax = 40;
    else if (largest <= 60) suggestedMax = 60;
    else if (largest <= 80) suggestedMax = 80;
    else if (largest <= 100) suggestedMax = 100;
    else if (largest <= 200) suggestedMax = 200;
    else suggestedMax = Math.ceil(largest / 100) * 100;

    // Create chart using Chart.js v4
    window.magicMathChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Number of Wrong Answers',
            data: wrongData,
            borderColor: 'rgba(151,187,205,1)',
            backgroundColor: 'rgba(151,187,205,0.5)',
            fill: true,
            tension: 0.1
          },
          {
            label: 'Total Time',
            data: timeData,
            borderColor: 'rgba(220,220,220,1)',
            backgroundColor: 'rgba(220,220,220,0.5)',
            fill: true,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: suggestedMax
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.magicMathChart) {
        window.magicMathChart.resize();
      }
    });
  }

  // Utility functions for animations
  fadeIn(element, duration = 400) {
    element.style.display = 'block';
    element.style.opacity = '0';

    let opacity = 0;
    const increment = 50 / duration;
    const timer = setInterval(() => {
      opacity += increment;
      if (opacity >= 1) {
        opacity = 1;
        clearInterval(timer);
      }
      element.style.opacity = opacity;
    }, 50);
  }

  fadeOut(element, duration = 400) {
    let opacity = parseFloat(window.getComputedStyle(element).opacity) || 1;
    const decrement = 50 / duration;
    const timer = setInterval(() => {
      opacity -= decrement;
      if (opacity <= 0) {
        opacity = 0;
        element.style.opacity = '0';
        element.style.display = 'none';
        clearInterval(timer);
      } else {
        element.style.opacity = opacity;
      }
    }, 50);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.magicMath = new MagicMath();
});
