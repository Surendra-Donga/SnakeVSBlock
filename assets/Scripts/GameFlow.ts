// GameFlow.ts
import { _decorator, Component, Node, PhysicsSystem2D, Vec3, director, CCFloat, Label, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameFlow')
export class GameFlow extends Component {

    @property({type: CCFloat, tooltip: "The initial speed of the upward scroll."})
    scrollSpeed: number = 50;

    @property({type: CCFloat, tooltip: "How much the scroll speed increases per second."})
    speedIncreaseRate: number = 1.5;

    @property({type: Label, tooltip: "The UI Label to display the score."})
    scoreLabel: Label = null;

    public static instance: GameFlow = null;

    private _score: number = 0;
    private initialScrollSpeed: number = 0;

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
        if (this.scoreLabel) {
            this.scoreLabel.string = `SCORE: ${this._score}`;
        }
    }

    onLoad() {
        if (GameFlow.instance === null) {
            GameFlow.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.score = 0;
        this.initialScrollSpeed = this.scrollSpeed;

        if (!PhysicsSystem2D.instance.enable) {
            PhysicsSystem2D.instance.enable = true;
            console.log("PhysicsSystem2D enabled via script.");
        }
    }

    start () {
        this.scrollSpeed = this.initialScrollSpeed; // Reset speed on game start
    }
    
    update(dt: number) {
        // Increase scroll speed over time for difficulty
        this.scrollSpeed += this.speedIncreaseRate * dt;

        // Move this node and all its children up
        // this.node.translate(new Vec3(0, -this.scrollSpeed * dt, 0));
    }

    public addScore(points: number) {
        this.score += points;
    }

    public endGame() {
        console.log("GameFlow: Game Over! Final Score:", this.score);
        
        // Save the score to local storage for the GameOver scene
        sys.localStorage.setItem('lastScore', this.score.toString());

        director.resume(); // Ensure game is not paused before loading new scene
        director.loadScene("GameOver"); 
    }
}
