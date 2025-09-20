// Spawner.ts
import { _decorator, Component, Prefab, instantiate, Vec3, randomRange, Collider2D } from 'cc';
import { Block } from './Block';
import { FallingBlock } from './FallingBlock';
import { PHY_GROUP } from './Groups';

const { ccclass, property } = _decorator;

 @ccclass('Spawner')
export class Spawner extends Component {
    @property(Prefab)
    blockPrefab: Prefab = null;

    @property(Prefab)
    pickupPrefab: Prefab = null;

    @property
    spawnInterval: number = 1; // in seconds

    @property({ type: [Vec3] })
    spawnPositions: Vec3[] = [];

    start() {
        if (this.spawnPositions.length === 0) {
            console.error("Spawner Error: 'Spawn Positions' is empty in the Inspector!");
            return;
        }
        this.schedule(this.spawnRow, this.spawnInterval);
    }

    spawnRow() {
        const rowLength = Math.floor(randomRange(2, this.spawnPositions.length)); // number of slots in row
        const startX = randomRange(325, 600);

        // Create row slots
        const slots: ("block" | "pickup" | "empty")[] = [];

        for (let i = 0; i < rowLength; i++) {
            // Random choice for each slot
            const rand = Math.random();

            if (rand < 0.6) {
                slots.push("block"); // 60% chance block
            } else if (rand < 0.8) {
                slots.push("pickup"); // 20% chance pickup
            } else {
                slots.push("empty"); // 20% chance empty
            }
        }

        // Spawn according to slot type
        slots.forEach((type, i) => {
            const pos = this.spawnPositions[0]; // use z from first spawn slot
            const x = startX + (i * 65);
            const y = 800;

            if (type === "block") {
                const newBlock = instantiate(this.blockPrefab);
                this.node.parent.addChild(newBlock);
                newBlock.setWorldPosition(x, y, pos.z);

                const collider = newBlock.getComponent(Collider2D);
                if (collider) {
                    collider.group = PHY_GROUP.BLOCK;
                }

                const blockComp = newBlock.getComponent(Block);
                if (blockComp) {
                    blockComp.init(Math.floor(randomRange(1, 21)));
                }

                newBlock.addComponent(FallingBlock);
            }

            if (type === "pickup") {
                const newPickup = instantiate(this.pickupPrefab);
                this.node.parent.addChild(newPickup);
                newPickup.setWorldPosition(x, y, pos.z);

                const collider = newPickup.getComponent(Collider2D);
                if (collider) {
                    collider.group = PHY_GROUP.PICKUP;
                }

                newPickup.addComponent(FallingBlock);
            }
        });
    }

}