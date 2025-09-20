// FallingBlock.ts
import { _decorator, Component, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FallingBlock')
export class FallingBlock extends Component {
    @property
    fallSpeed: number = 100;

    update(dt: number) {
        this.node.translate(new Vec3(0, -this.fallSpeed * dt, 0));
    }
}
