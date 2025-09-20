// Snake.ts
import { _decorator, Component, Node, Prefab, instantiate, Vec3, input, Input, EventTouch, Collider2D, Contact2DType, Label, PhysicsSystem2D, CCInteger, CCFloat, IPhysics2DContact, Sprite, UITransform } from 'cc';
import { Block } from './Block';
import { Pickup } from './Pickup';
import { GameFlow } from './GameFlow';
import { PHY_GROUP } from './Groups';

const { ccclass, property } = _decorator;

@ccclass('Snake')
export class Snake extends Component {
    @property(Prefab)
    ballPrefab: Prefab = null;

    @property({type : CCInteger})
    initialLength: number = 5;

    @property({type : CCFloat})
    segmentSpacing: number = 40;

    @property(Label)
    lengthLabel: Label = null;

    @property({type: GameFlow})
    gameFlow: GameFlow = null; 

    @property({type: CCFloat, tooltip: "How many times per second the snake deals damage and loses length against a block."})
    damageRate: number = 5;

    private segments: Node[] = [];
    private _currentLength: number = 0;
    private snakeHead: Node = null;
    private touchStartPos: Vec3 = new Vec3();
    private timeSinceLastHit: number = 0;
    private pickupsToDestroy: Node[] = [];
    private segmentsToAdd: number = 0;

    get currentLength(): number {
        return this._currentLength;
    }

    set currentLength(value: number) {
        this._currentLength = Math.max(0, value);
        if (this.lengthLabel) {
            this.lengthLabel.string = `${this._currentLength}`;
        }
    }

    onLoad() {
        this.currentLength = this.initialLength; 
        this.spawnInitialSnake();
        this.setupInput();
        console.log("Snake initialized with length:", this.currentLength);

        const headCollider = this.snakeHead.getComponent(Collider2D);
        if (headCollider) {
            headCollider.group = PHY_GROUP.SNAKE;
            headCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            headCollider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        } else {
            console.warn("Snake head has no Collider2D! Collision will not be detected.");
        }
    }

    spawnInitialSnake() {
        for (let i = 0; i < this.initialLength; i++) {
            this.addSegment();
        }
        this.snakeHead = this.segments[0];
        this.updateSegmentPositions(); 
    }
    
    setupInput() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart(event: EventTouch) {
        this.touchStartPos.set(event.getLocationX(), event.getLocationY());
    }

    onTouchMove(event: EventTouch) {
        if (!this.snakeHead || this.currentLength <= 0) return;

        const currentPos = event.getLocation();
        const deltaX = currentPos.x - this.touchStartPos.x;
        
        const sensitivity = 0.5;
        let newX = this.snakeHead.position.x + deltaX * sensitivity;

        const halfLaneWidth = 250; 
        newX = Math.max(-halfLaneWidth, Math.min(halfLaneWidth, newX));

        this.snakeHead.setPosition(newX, this.snakeHead.position.y);

        this.touchStartPos.set(currentPos.x, currentPos.y);
    }

    update(dt: number) {
        if (this.currentLength <= 0 || this.segments.length === 0) return;

        this.timeSinceLastHit += dt;

        if (this.segments.length > 1) {
            for (let i = this.segments.length - 1; i > 0; i--) {
                const currentSegment = this.segments[i];
                const targetSegment = this.segments[i - 1]; 
                const targetPos = new Vec3(targetSegment.position.x, targetSegment.position.y - this.segmentSpacing);
                currentSegment.position = currentSegment.position.lerp(targetPos, dt * 12);
            }
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group === PHY_GROUP.PICKUP) {
            const pickup = otherCollider.getComponent(Pickup);
            if (pickup) {
                const pickupValue = pickup.value;
                this.increaseLength(pickupValue);
                if (this.gameFlow) {
                    this.gameFlow.addScore(pickupValue);
                }
                pickup.collect();
                this.pickupsToDestroy.push(otherCollider.node);
            }
        } else if (otherCollider.group === PHY_GROUP.BLOCK) {
            const block = otherCollider.getComponent(Block);
            if (block) {
                const blockValue = block.blockValue;
                this.decreaseLength(blockValue);
                block.takeHit(blockValue);
            }
        }
    }

    onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // Block collision logic moved to onBeginContact
    }

    lateUpdate(dt: number) {
        // Destroy all collected pickups at the end of the frame
        while (this.pickupsToDestroy.length > 0) {
            const node = this.pickupsToDestroy.pop();
            node.destroy();
        }

        // Safely add new segments
        if (this.segmentsToAdd > 0) {
            for (let i = 0; i < this.segmentsToAdd; i++) {
                this.addSegment();
            }
            this.segmentsToAdd = 0;
        }
    }

    addSegment() {
        const newSegment = instantiate(this.ballPrefab) as Node;
        newSegment.setParent(this.node);
        if (this.segments.length > 0) {
            const lastSegment = this.segments[this.segments.length - 1];
            newSegment.setPosition(lastSegment.position.x, lastSegment.position.y - this.segmentSpacing);
        } else {
            newSegment.setPosition(0, 0);
        }
        this.segments.push(newSegment);
    }

    removeSegment() {
        if (this.segments.length > 0) {
            const removedSegment = this.segments.pop();
            removedSegment.destroy();
        }
    }

    updateSegmentPositions() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].setPosition(0, -i * this.segmentSpacing);
        }
    }

    increaseLength(amount: number) {
        this.segmentsToAdd += amount;
        this.currentLength += amount;
        console.log(`Length increased to: ${this.currentLength}`);
    }
    
    decreaseLength(amount: number) {
        for (let i = 0; i < amount; i++) {
            if (this.currentLength > 0) {
                this.removeSegment();
                this.currentLength--;
            } else {
                break;
            }
        }

        if (this.currentLength <= 0) {
            console.log("Game Over!");
            if (this.gameFlow) {
                this.gameFlow.endGame();
            }
        }
    }
}
