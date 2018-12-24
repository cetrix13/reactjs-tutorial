import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return (
    <button
    className="tile is-12"
    onClick={() => props.onClick()}
    >
    { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
    return <Square
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
    />;
  }

  createBoard(){

    let rows = [];
    let counter = 0;
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(counter));
        counter++;
      }
      rows.push(<div className="tile is-ancestor">{squares}</div>);
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
      squares: Array(9).fill(null)
      }],
      isXnext: true,
      stepNumber:0,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isXnext: (step % 0 ) === 0,
    });
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // if won or board filled don't process click
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isXnext ? 'X': 'O';
    this.setState({history: history.concat([{squares: squares}]), stepNumber: history.length, isXnext:!this.state.isXnext});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let desc;
      if (move && move === current) {
        desc = '<strong>Go to move #' + move + '</strong>';
      } else if (move) {
        desc = 'Go to move #' + move;
      } else {
        desc = 'Go to game start';
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={ move === this.state.stepNumber ? 'bold-text':''}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.isXnext ? 'X' : 'O');
    }

    return (
      <div className="game columns">
        <div className="game-board column is-3">
          <Board squares = {current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info column is-9">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
