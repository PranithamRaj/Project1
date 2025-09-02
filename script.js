(function () {
  'use strict';

  /**
   * Tic Tac Toe game state and UI wiring
   */

  /** @type {HTMLButtonElement[]} */
  const cells = Array.from(document.querySelectorAll('.cell'));
  /** @type {HTMLParagraphElement} */
  const statusEl = document.getElementById('status');
  /** @type {HTMLButtonElement} */
  const resetButton = document.getElementById('resetButton');

  /**
   * Board representation: index 0..8, values: 'X' | 'O' | null
   * Current player: 'X' starts
   */
  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameOver = false;

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function updateCellButton(button, value) {
    if (value) {
      button.textContent = value;
      button.setAttribute('data-value', value);
      button.setAttribute('aria-label', `${buttonAriaBase(button)} ${value}`);
      button.setAttribute('aria-disabled', 'true');
    } else {
      button.textContent = '';
      button.removeAttribute('data-value');
      button.setAttribute('aria-label', `${buttonAriaBase(button)} empty`);
      button.setAttribute('aria-disabled', 'false');
    }
  }

  function buttonAriaBase(button) {
    const index = Number(button.getAttribute('data-index'));
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    return `Cell ${index + 1} (row ${row}, column ${col}),`;
  }

  function announceTurn() {
    setStatus(`Player ${currentPlayer}'s turn`);
  }

  function announceWin(player, line) {
    setStatus(`Player ${player} wins!`);
    line.forEach((i) => cells[i].classList.add('win'));
  }

  function announceDraw() {
    setStatus('Draw!');
  }

  function checkWinner() {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    if (board.every((v) => v)) {
      return { winner: null, line: null };
    }
    return null;
  }

  function handleMove(index) {
    if (gameOver || board[index]) return;
    board[index] = currentPlayer;
    updateCellButton(cells[index], currentPlayer);

    const result = checkWinner();
    if (result) {
      if (result.winner) {
        gameOver = true;
        announceWin(result.winner, result.line);
        disableAllCells();
        return;
      } else {
        gameOver = true;
        announceDraw();
        disableAllCells();
        return;
      }
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    announceTurn();
  }

  function disableAllCells() {
    cells.forEach((btn) => btn.setAttribute('aria-disabled', 'true'));
  }

  function enableEmptyCells() {
    cells.forEach((btn, idx) => {
      if (!board[idx]) btn.setAttribute('aria-disabled', 'false');
    });
  }

  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    cells.forEach((btn) => {
      btn.classList.remove('win');
      updateCellButton(btn, null);
    });
    announceTurn();
  }

  // Mouse/touch input
  cells.forEach((button, index) => {
    button.addEventListener('click', () => handleMove(index));
  });

  // Keyboard navigation: Arrow keys to move focus, Enter/Space to play
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const currentIndex = cells.indexOf(active);
    if (currentIndex === -1) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        focusIndex((currentIndex + 6) % 9);
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusIndex((currentIndex + 3) % 9);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusIndex((currentIndex + 8) % 9);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusIndex((currentIndex + 1) % 9);
        break;
      case 'Enter':
      case ' ': // Space
        e.preventDefault();
        handleMove(currentIndex);
        break;
      default:
        break;
    }
  });

  function focusIndex(i) {
    const target = cells[i];
    if (target) target.focus();
  }

  resetButton.addEventListener('click', resetGame);

  // Initial render
  cells.forEach((btn) => updateCellButton(btn, null));
  enableEmptyCells();
  announceTurn();
})();

