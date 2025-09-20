# Snake VS Block Game

### Cocos Creator Version
* Cocos Creator v3.8.5

### Setup & Build Steps
1.  Unzip the project file.
2.  Open the project folder in Cocos Creator.
3.  The game can be run directly in the editor by opening the `GameplayScene` and pressing the Play button.
4.  A pre-built web version is included in the `/build/web-desktop` folder. Open the `index.html` file in a web browser to play.

### Brief Architecture
The project is structured into several modular components:
* **GameFlow.ts**: Manages the overall game state, score, and scene transitions.
* **Snake.ts**: Controls all snake behavior, including movement, segment following, length management, and collision detection.
* **Block.ts**: Manages the state of an individual block, including its value and what happens when it's hit.
* **Spawner.ts**: Handles the procedural generation of block and pickup rows.
* **Pickup.ts**: A simple component for pickups that the snake collects to grow.

### Asset Credits
* All visual and audio assets used are part of the default assets provided by Cocos Creator.

