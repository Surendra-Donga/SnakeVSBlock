// Pickup.ts
import { _decorator, Component, Node, Label, CCInteger } from 'cc'; // Added Label for optional display
const { ccclass, property } = _decorator;

@ccclass('Pickup')
export class Pickup extends Component {
    @property({ type: CCInteger, tooltip: 'The amount of length to add to the snake.' })
    public value: number = 1; // Default value, can be set in editor or by spawner

    // Optional: If you want to display the pickup value, similar to blocks
    @property({ type: Node, tooltip: 'Optional: The child node with the Label component to display pickup value.' })
    private numberNode: Node = null;
    private numberLabel: Label = null;

    onLoad() {
        if (this.numberNode) {
            this.numberLabel = this.numberNode.getComponent(Label);
            if (this.numberLabel) {
                this.numberLabel.string = `+${this.value}`; // Display initial value
            }
        }
    }

    private isCollected: boolean = false;

    // Optional: An init method if Spawner sets values dynamically
    public init(val: number) {
        this.value = val;
        if (this.numberLabel) {
            this.numberLabel.string = `+${this.value}`;
        }
    }

    // This method is called by the Snake script when a collision occurs.
    public collect() {
        if (this.isCollected) {
            return;
        }
        this.isCollected = true;

        console.log(`Pickup collected! Value: +${this.value}`);
        
        // Deactivate the node so it disappears immediately, but don't destroy it here.
        this.node.active = false;
    }
}