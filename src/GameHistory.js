import React from 'react';

class GameHistory extends React.Component {
    renderScoreIfThereAreGames() {
        const score = this.props.games.reduce((acc, game) => {
            acc[game.winner]++;
            return acc;
        }, {X: 0, O: 0});

        if(this.props.games.length > 0) {
            return <div>Score X: {score.X} O: {score.O}</div>;
        }
    }
    render() {
        const games = this.props.games;
        const renderedGames = games.map((game) => {
            return (
                <li key={game.id}>
                    <button 
                        onClick={ () => this.props.selectGame(game.id) }
                        className={ game.id === this.props.activeGameId ? "active" : "" }
                    >
                        Go to the game #{game.id}
                    </button>
                </li>
            );
        });

        let startNewGameButton;
        if(this.props.games.length > 0) {
            startNewGameButton = (
                <li>
                    <button 
                        onClick={ this.props.startNewGame }
                    >
                        Go to the new game
                    </button>
                </li>
            );
        }

        return (
            <div className='sessions-info'>
                { 
                    this.renderScoreIfThereAreGames() 
                }
                <ol>
                    {
                        startNewGameButton
                    }
                    {
                        renderedGames
                    }
                </ol>
            </div>
        );
    }
}

export default GameHistory;