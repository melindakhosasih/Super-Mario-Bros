// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import UI from '../UI'
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(UI)
    UI: UI = null;

    private animation: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
    }

    // start () {

    // }

    // update (dt) {}

    playAnimation() {
        this.UI.updateScore(800);
        this.animation.play("score_800");
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 1.5);
    }
}
