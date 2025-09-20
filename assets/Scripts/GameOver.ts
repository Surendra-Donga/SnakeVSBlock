// GameOver.ts
import { _decorator, Component, Node, director, Label, sys } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {

    @property({ type: Label, tooltip: "The label to display the final score" })
    scoreLabel: Label = null;

    @property({ type: Label, tooltip: "The label to display the high score" })
    highScoreLabel: Label = null;

    onLoad() {
        // Preload scenes for faster transitions
        director.preloadScene("Game");
        director.preloadScene("Menu");

        // Retrieve scores from local storage
        const lastScoreStr = sys.localStorage.getItem('lastScore') || '0';
        const highScoreStr = sys.localStorage.getItem('highScore') || '0';

        const lastScore = parseInt(lastScoreStr);
        let highScore = parseInt(highScoreStr);

        // Check if we have a new high score
        if (lastScore > highScore) {
            highScore = lastScore;
            sys.localStorage.setItem('highScore', highScore.toString());
        }

        // Update UI labels
        if (this.scoreLabel) {
            this.scoreLabel.string = `SCORE: ${lastScore}`;
        }
        if (this.highScoreLabel) {
            this.highScoreLabel.string = `BEST: ${highScore}`;
        }
    }

    onRestartButtonClick() {
        console.log("Restart Game button clicked!");
        director.resume(); // Ensure the engine is not paused
        director.loadScene("Game");
    }

    onMenuButtonClick() {
        console.log("Main Menu button clicked!");
        director.resume(); // Ensure the engine is not paused
        director.loadScene("Menu");
    }
}
