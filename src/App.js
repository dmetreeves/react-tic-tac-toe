import React from 'react';
import ActiveGame from './ActiveGame';
import GameHistory from './GameHistory';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGame: {id: 1},
            finishedGames: {},
        }
    }
    handleActiveGameFinished(finishedGameState) {
        const id = finishedGameState.id;
        const newFinishedGames = Object.assign(this.state.finishedGames, {[id]: finishedGameState});
        this.setState({
            finishedGames: newFinishedGames,
        });
    }
    selectFinishedGameAsActive(gameId) {
        const game = this.state.finishedGames[gameId];
        this.setState({
            activeGame: game
        });
    }
    startNewGame() {
        const lastId = Math.max.apply(null, Object.keys(this.state.finishedGames)) | 0;
        const newActiveGame = { id: lastId+1 };
        this.setState({
            activeGame: newActiveGame
        });
    }
    render() {
        return (
            <div className="app">
                <ActiveGame 
                    state={this.state.activeGame} 
                    onFinish={(id) => this.handleActiveGameFinished(id)} 
                />
                <GameHistory 
                    games={Object.values(this.state.finishedGames)}
                    activeGameId={this.state.activeGame.id}
                    selectGame={(id) => this.selectFinishedGameAsActive(id)}
                    startNewGame={() => this.startNewGame()}
                />
            </div>
        );
    }
}

export default App;