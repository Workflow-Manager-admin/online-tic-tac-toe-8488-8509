import React, { useState, useEffect } from "react";
import "./App.css";

/*
  Color Palette:
  - Accent:   #ffca28
  - Primary:  #1976d2
  - Secondary:#424242
*/

const COLOR = {
  accent: "#ffca28",
  primary: "#1976d2",
  secondary: "#424242"
};

// Helper function to calculate the winner
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5],[6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7],[2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],           // diagonals
  ];
  for (let l of lines) {
    const [a, b, c] = l;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

function isFull(board) {
  return board.every(cell => cell != null);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Two player Tic Tac Toe game.
   * Board positions: Array of 9 (row major).
   * X always starts.
   * After win/draw: board locked until reset.
   */

  // 'X' starts first
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Track game status
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setGameOver(true);
    } else if (isFull(board)) {
      setWinner(null);
      setGameOver(true);
    }
  }, [board]);

  // Reset board
  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
  }

  // Handle square click
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || gameOver) return;
    const next = board.slice();
    next[idx] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  // Status display
  let status;
  if (winner) {
    status = (
      <span className="ttt--winner">
        <span className="ttt--winner-label">Winner:</span> {winner}
      </span>
    );
  } else if (gameOver && !winner) {
    status = (
      <span className="ttt--draw">
        Draw!
      </span>
    );
  } else {
    status = (
      <span>
        Next turn: <span style={{color: COLOR.primary, fontWeight: 500}}>{xIsNext ? "X" : "O"}</span>
      </span>
    );
  }

  return (
    <div className="ttt--center-wrap">
      <div className="ttt--container">
        <h1 className="ttt--title">Tic Tac Toe</h1>
        <div className="ttt--status">{status}</div>
        <Board
          board={board}
          onClick={handleClick}
          winner={winner}
        />
        <div className="ttt--controls">
          <button className="ttt--reset-btn" onClick={handleReset} aria-label="Reset game">
            Reset Game
          </button>
        </div>
        <footer className="ttt--footer">
          <span>
            <span style={{color: COLOR.primary, fontWeight: 600}}>X</span> & <span style={{color: COLOR.secondary, fontWeight: 600}}>O</span> take turns. First to three in a row wins.
          </span>
        </footer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onClick, winner }) {
  /**
   * Renders 3x3 tic tac toe board.
   * Props:
   *   - board: array of 9 (null | 'X' | 'O')
   *   - onClick(idx): click handler for squares
   *   - winner: the winner symbol or null
   */
  // Highlight win line is optional; minimal style won't highlight.
  return (
    <div className="ttt--board">
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onClick(idx)}
          highlight={false}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /**
   * Renders single tic tac toe square.
   * Props:
   *   - value: 'X', 'O', or null
   *   - onClick: click handler
   *   - highlight: (not used)
   */
  let display = value || "";
  let color = "";
  if (value === "X") color = COLOR.primary;
  else if (value === "O") color = COLOR.secondary;

  return (
    <button
      className="ttt--square"
      onClick={onClick}
      aria-label={value ? `Cell marked ${value}` : "Place mark"}
      style={{
        color,
        borderColor: highlight ? COLOR.accent : "var(--ttt-border-color)",
        background: "var(--ttt-square-bg)"
      }}
      tabIndex={value ? -1 : 0}
    >
      {display}
    </button>
  );
}

export default App;
