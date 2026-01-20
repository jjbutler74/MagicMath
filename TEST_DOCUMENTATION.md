# MagicMath Test Documentation

## Overview
This document describes the unit testing setup for the MagicMath application.

## Testing Framework
- **Jest**: Modern JavaScript testing framework
- **jsdom**: Simulates browser environment for DOM testing
- **Babel**: Transpiles ES6+ code for testing

## Setup

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Core Functionality Tests
- **Initialization**: Default values, difficulty settings
- **User Management**: Create, delete, validate users
- **Difficulty Settings**: Easy/Medium/Hard ranges, per-user settings
- **Game Logic**: Answer calculation, scoring, accuracy tracking
- **Progress Tracking**: Progress bar, problem counting
- **Sound System**: Audio initialization, toggle functionality
- **Game Logging**: Save/retrieve game history
- **DOM Manipulation**: Element updates, show/hide sections
- **Input Validation**: Parse integers, handle empty inputs
- **Time Tracking**: Calculate elapsed time, round seconds

### Test Files
- `scripts/site.test.js` - Main test suite with 50+ unit tests

## Test Structure

Each test suite is organized by functionality:
```javascript
describe('Category', () => {
  test('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

## Mocks

### LocalStorage Mock
Simulates browser localStorage for testing data persistence.

### AudioContext Mock
Mocks Web Audio API for testing sound functionality.

### Bootstrap Modal Mock
Mocks Bootstrap modals for testing UI interactions.

## Coverage Goals
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

## Running Coverage Report
```bash
npm run test:coverage
```

This generates a coverage report in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view detailed coverage.

## Continuous Integration
Tests should be run before:
- Committing changes
- Creating pull requests
- Deploying to production

## Future Testing
Consider adding:
- Integration tests for full game flow
- E2E tests with Playwright or Cypress
- Visual regression tests
- Performance tests
