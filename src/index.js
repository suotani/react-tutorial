/*
TODOs
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const highlightClass = props.isHighlight ? 'square highlight' : 'square';
  return (
    <button className={highlightClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const result_line = this.props.result_line;
    var isHighlight = false;
    if(result_line) {
      isHighlight = result_line.indexOf(i) > -1;
    }
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlight={isHighlight}
      />
    );
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(0).map((row, i) => {
            return (
              <div className="board-row" key={i}>
                {
                  Array(3).fill(0).map((col, j) => {
                    return(
                      this.renderSquare(i * 3 + j)
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: {
          col: null,
          row: null,
        },
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); //sliceでコピーしている。sliceがなかったら同じポインタを参照してしまう（連動して変わってしまう）
    
    //勝者が決定したらクリックイベントは何もしない
    if(caclulateWinner(squares) || squares[i]) {return;}

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: {
          row: parseInt(i / 3, 10),
          col: i % 3,
        },
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(index){
    this.setState({
      stepNumber: index,
      xIsNext: (index % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const results = caclulateWinner(current.squares);
    const winner = results ? results[0] : null;
    const result_line = results ? results[1] : null;
    const moves = history.map((step, index) => {
      const desc = index ? 'Go to move #' + index : 'Go to game start';
      const turn = index ? "(" + step.position.row + "," + step.position.col + ")" : '';
      const idSelectedClass = this.state.stepNumber === index ? "selected" : "";
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)} className={idSelectedClass}>{desc}</button>{turn}
        </li>
      )
    })

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            result_line={result_line}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// helper methods

function caclulateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}