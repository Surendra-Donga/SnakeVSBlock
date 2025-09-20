// Block.ts
import { _decorator, Component, Node, Label, Color, Sprite } from 'cc';
import { GameFlow } from './GameFlow'; // Import GameFlow
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    
    @property({ type: Node, tooltip: 'The child node with the Label component.' })
    private numberNode: Node = null;

    private numberLabel: Label = null;
    public blockValue: number = 0;
    private initialValue: number = 0; // To grant score upon destruction

    onLoad() {
        if (this.numberNode) {
            this.numberLabel = this.numberNode.getComponent(Label);
        } else {
            console.error("Block: 'NumberLabel' child node is not assigned!");
        }
    }

    public init(value: number) {
        this.initialValue = value;
        this.blockValue = value;
        this.updateDisplay();
    }

    private updateDisplay() {
        if (this.numberLabel) {
            this.numberLabel.string = this.blockValue.toString();
        }
        
        // Change color based on value
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            // This creates a gradient from green (low value) to red (high value)
            // You can customize these colors as you like.
            const maxVal = 50; // An arbitrary max value for color intensity
            const ratio = Math.min(this.blockValue / maxVal, 1);
            const color = new Color().fromHEX("#0004ffff"); // Start with blue
            const targetColor = new Color().fromHEX("#ff0000"); // End with red
            sprite.color = color.lerp(targetColor, ratio);
        }
    }

    public takeHit(damage: number) {
        this.blockValue -= damage;
        this.updateDisplay();

        if (this.blockValue <= 0) {
            this.node.destroy();
        }
    }
}