import React from 'react';
import Board from './Board';

class ActiveGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.buildState(this.props.state.id);
    }
    buildState(id, moves = null, moveNumber = 0, xIsNext = true) {
        return {
            id,
            moves: moves ? moves : [{
                squares: Array(9).fill(null),
            }],
            moveNumber,
            xIsNext,
        };
    }
    componentDidUpdate(prevProps) {
        const prevState = prevProps.state;
        const newState = this.props.state;
        if(newState.moves && prevState.id != newState.id) {
            // if one of the finished games was selected as active
            this.setState(newState);
        } else if(!newState.moves && prevState.id < this.props.state.id) {
            // if new game started
            this.setState(
                this.buildState(this.props.state.id)
            );
        }
    }
    handleBoardClick(i) {
        const moves = this.state.moves.slice(0, this.state.moveNumber + 1);
        const current = moves[moves.length-1];
        const squares = current.squares.slice(); // clone array
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.nextPlayer();

        const newState = this.buildState(
            this.state.id,
            moves.concat([{
                squares: squares,
            }]),
            moves.length,
            !this.state.xIsNext
        );

        this.setState(newState);

        const winningLine = calculateWinningLine(squares);
        const winner = getWinner(squares, winningLine);
        if(winner || this.noEmpty(squares)) {
            this.props.onFinish({
                winner: winner,
                ...newState
            });
        }
    }
    selectMove(moveIndex) {
        this.setState({
            moveNumber: moveIndex,
            xIsNext: (moveIndex % 2) === 0,
        });
    }
    status(squares, winningLine) {
        const winner = getWinner(squares, winningLine);
        if(winner) {
            return 'Winner: ' + winner;
        } else if(this.noEmpty(squares)) {
            return 'The game ended in a draw';
        } else {
            return 'Next move: ' + this.nextPlayer();
        }
    }
    noEmpty(squares) {
        return squares.every(square => square != null);
    }
    render() {
        const moves = this.state.moves;
        const currentSquares = moves[this.state.moveNumber].squares;
        const winningLine = calculateWinningLine(currentSquares);
        
        const renderedMoves = moves.map((_, moveIndex) => {
            const text = moveIndex
                ? 'Go to move #' + moveIndex
                : 'Go to the beginning';
            return (
                <li key={moveIndex}>
                    <button 
                        onClick={ () => this.selectMove(moveIndex) }
                        className={ moves.length > 1 && moveIndex === this.state.moveNumber ? "active" : "" }
                    >
                        {text}
                    </button>
                </li>
            );
        });

        const gameInfo = renderedMoves.length > 1
            ? (
                <div className='game-info'>
                    <div>{ this.status(currentSquares, winningLine) }</div>
                    <ol>{ renderedMoves }</ol>
                </div>
              )
            : null;

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares={currentSquares}
                        winningLine={winningLine}
                        onClick={(i) => this.handleBoardClick(i)} />
                </div>
                {gameInfo}
            </div>
        );
    }
    nextPlayer() {
        return this.state.xIsNext ? 'X' : 'O';
    }
}

function calculateWinner(squares) {
    const winningLine = calculateWinningLine(squares);
    return getWinner( squares, winningLine );
}

function getWinner(squares, winningLine) {
    const [a,b,c] = winningLine;
    if(squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
    }
    return null;
}

function calculateWinningLine(squares) {
    const winningLines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    return winningLines.reduce((acc, currentLine) => {
        const [a,b,c] = currentLine;
        return squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
            ? [a,b,c]
            : acc
    }, []);
}

export default ActiveGame;