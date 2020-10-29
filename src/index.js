import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square (props) {
    return (
        <button className="square" onClick = {props.onClick}>
            {props.value}
        </button>
    );
  }
  
  class Board extends React.Component {
    
    renderSquare(i) {
      return (
        <Square
            value = {this.props.squares[i]}
            onClick = {() => this.props.onClick(i)}
        />
       );
    }
    go(){
      return (<div>Привет</div>);
    }
    render() {
      const renderingBoard = [];
      let renderingRow = [];
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          renderingRow.push(this.renderSquare(i*3 + j));
        }
      renderingBoard.push(<div className="board-row">{renderingRow}</div>);
      renderingRow = [];
      }
      return (
      <div>{renderingBoard}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history : [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            current_square: [{
                square: Array(2).fill(null)
            }],
            IsOver: false,
            curent_button: -1,
        };
    }
    
    handleClick(i){
        const history = this.state.history.slice(0,
            this.state.stepNumber + 1);
        const current_square = this.state.current_square.slice(0,
            this.state.stepNumber + 1);
        const current_history = history[history.length - 1];
        const squares = current_history.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
          }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        const isOver = calculateWinner(squares) ? true : false;
        this.setState({
            history: history.concat([{
                squares : squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            current_square: current_square.concat([{
              square: [Math.floor(i/3) + 1, i%3 + 1],
            }]),
            IsOver: isOver,
            curent_button: -1,
        });
      }

    jumpTo (step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
            curent_button: step,
        });
    }

    new_game(){
      this.setState({
        history : [{
          squares: Array(9).fill(null)
        }],
        xIsNext: true,
        stepNumber: 0,
      });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let moves = history.map((step,move) => {
            const desc = 'Перейти к ходу #' + move; 
            const current_square = (this.state.current_square[move]).square[0] + 'x' +
            (this.state.current_square[move]).square[1];
            return (
                <li key = {move}>
                  <div className = "sub_game_info">
                    <div style = {{marginRight: "7px"}}>({current_square})</div>
                    <button className = {move === this.state.curent_button && "current"} onClick = {() => this.jumpTo(move)}>{desc}</button>
                  </div>
                </li>
            );
        }).slice(1);
        let status = winner ? 'Выиграл ' + winner : 'Следующий ход: ' + (this.state.xIsNext ? 'X' : '0');
        if(this.state.IsOver){
          moves = moves.slice(0, moves.length - 1);
        }

      return (
        <div className="game">
          <div className="game-board">
           <button className ="new-game-button" onClick = {() => this.new_game()}>Новая игра</button>
            <Board
                squares = {current.squares}
                onClick={ (i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className = "new-game-button">{status}</div>
            <button onClick = {() => this.jumpTo(0)}>К началу игры</button>
            <ol>{moves}</ol>
            <button onClick = {() => this.jumpTo(this.state.current_square.length - 1)}>Конец игры</button>
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

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  