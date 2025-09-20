// Menu.ts
import { _decorator, Component, Node, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {

    onLoad() {
        // Preload the game scene if you want a faster transition
        director.preloadScene("Game");
    }

    onStartButtonClick() {
        console.log("Start Game button clicked!");
        director.loadScene("GameplayScene");
    }
}
