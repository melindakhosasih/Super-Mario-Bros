// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import UI from '../UI'
import Score100 from "../Effects/Score100"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    audio: cc.AudioClip = null;

    @property(UI)
    UI: UI = null;

    @property(Score100)
    score : Score100 = null;

    private animation: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
    }

    // start () {
        
    // }

    // update (dt) {
        
    // }

    onBeginContact(contact, self, other) {
        if(contact.getWorldManifold().normal.y == -1) {
            if(other.node.name == "Player") {
                this.UI.updateCoin(1);
                this.animation.play("coin");
                this.score.playAnimation();
                this.scheduleOnce(()=>{
                    this.node.destroy();
                }, 0.45);
                cc.audioEngine.playEffect(this.audio, false);
            }
        }
    }
}
