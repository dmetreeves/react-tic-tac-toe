import React from 'react';
import Square from './Square';

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                key={i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                color={this.props.winningLine.includes(i) ? "red" : ""}
            />
        );
    }
    render() {
        return (
            <div>{
                this.props.squares
                    .reduce((acc,_,i) => { 
                        if(i % 3 === 0){
                            acc.push([])
                        }
                        acc[acc.length-1].push(i); 
                        return acc; 
                    }, [])
                    .map((row, i) => {
                        return (
                            <div key={i} className="board-row">
                                {
                                    row.map((val) => this.renderSquare(val))
                                }
                            </div>
                        );
                    })
            }</div>
        );
    }
}

export default Board;