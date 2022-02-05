import React from 'react';

import '../index.css'
import Square from './Square'

export default class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const size = 3;
        let squares = []

        for (let i = 0; i < size; i++) {
            let row = []
            for (let j = 0; j < size; j++) {
                row.push(this.renderSquare(i * size + j));
            }
            squares.push(<div key={i} className="board-row">{row}</div>);
        }

        return (
            <div>{squares}</div>
        );
    }
}