import React from 'react';

import '../index.css'
import Board from './Board';

export default class Game extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            xIsNext: true,
            stepNumber: 0,
            sortHistoryAscending: true
        }
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[this.state.stepNumber];

        const gameState = this.calculateWinner(current.squares);
        const sortHistoryAscending = this.state.sortHistoryAscending;

        let moves = history.map((step, move) => {
            const latestMoveSquare = step.latestMoveSquare;
            const col = 1 + latestMoveSquare % 3;
            const row = 1 + Math.floor(latestMoveSquare / 3);
            const desc = move ?
                `Go to move #${move} (${col}, ${row})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button 
                        key={move + ' button'} 
                        className={move === stepNumber ? 'move-list-item-selected' : 'move-list-item'}
                        onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        if (!sortHistoryAscending) {
            moves.reverse();
        }

        let status = '';

        if (gameState === 'DRAW') {
            status = 'The game ended in a draw!'
        }
        else if (gameState) {
            status = `Winner: ${this.state.xIsNext ? 'O' : 'X'}`
        }
        else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board key={'Board'}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div key={'status'}>{status}</div>
                    <button 
                        className='centered-button'
                        key={'sort'} 
                        onClick={() => this.sortHistory()}>
                        Sort History
                    </button>
                    <ol key={this.state.stepNumber}>{moves}</ol>
                </div>
            </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        if (this.state.xIsNext) {
            squares[i] = 'X';
        }
        else {
            squares[i] = 'O';
        }

        this.setState({
            history: history.concat([{
                squares: squares,
                // Store the index of the latest moved square
                latestMoveSquare: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    calculateWinner(squares) {

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

        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == null) {
                return null;
            }
        }

        return 'DRAW';
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0)
        });
    }

    sortHistory() {
        this.setState({ sortHistoryAscending: !this.state.sortHistoryAscending });
    }
}