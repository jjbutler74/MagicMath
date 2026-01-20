# Magic Math

Magic Math is a modern web-based multiplication practice game designed to help students master their times tables. Built with HTML, CSS, ES6+ JavaScript, Bootstrap 5, and Chart.js 4, the game presents random multiplication problems, tracks performance using browser's local storage, and displays interactive performance charts.

## Features

- **Multiple Difficulty Levels**: Easy (0-5), Medium (0-10), and Hard (0-12) ranges
- **User Management**: Create and manage multiple user profiles
- **Progress Tracking**: Real-time progress bar and accuracy statistics during gameplay
- **Review Mistakes**: Review incorrect problems after completing a game
- **Sound Effects**: Optional audio feedback with Web Audio API
- **Performance Charts**: Visualize progress over time with Chart.js
- **Persistent Settings**: Per-user difficulty and sound preferences saved locally
- **Grade-School Format**: Problems displayed in traditional textbook style

## Running the App

No server setup is required. Clone or download this repository and open `index.html` with any modern web browser.

### Opening `index.html`

From the project directory run one of the following commands or double-click the file:

- Linux: `xdg-open index.html`
- macOS: `open index.html`
- Windows: `start index.html`

Once the page loads you can select a user and start solving math problems.

## Running Tests

The application includes a comprehensive test suite with 30+ unit tests.

### Browser-Based Tests

Open `test-runner.html` in your browser to run all tests and view results:

```bash
# Linux
xdg-open test-runner.html

# macOS
open test-runner.html

# Windows
start test-runner.html
```

### Jest Tests (Optional)

If you have Node.js installed, you can run tests with Jest:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

See [TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md) for detailed testing information.

## Technologies Used

- **HTML5 & CSS3**: Modern semantic markup and responsive styling
- **ES6+ JavaScript**: Classes, arrow functions, template literals
- **Bootstrap 5.3.2**: UI components and responsive grid
- **Chart.js 4.4.1**: Interactive data visualization
- **Web Audio API**: Programmatic sound generation
- **LocalStorage API**: Client-side data persistence

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- Web Audio API
- LocalStorage API
- CSS Grid and Flexbox
