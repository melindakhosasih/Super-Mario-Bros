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

    @property(cc.AudioClip)
    audio: cc.AudioClip = null;

    @property(UI)
    UI: UI = null;

    private animation: cc.Animation = null;

    private isPopUp: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
    }

    // start () {
        
    // }

    // update (dt) {
        
    // }

    onBeginContact(contact, self, other) {
        if(this.isPopUp) {
            if(!this.UI.getBigMario()) {
                this.UI.updateBigMario(true);
                other.node.getComponent("Player").playerPowering();
            }
            this.node.destroy();
        } else {
            if(contact.getWorldManifold().normal.y == -1) {
                if(other.node.name == "Player") {
                    this.animation.play("mushroom");
                    this.isPopUp = true;
                    cc.audioEngine.playEffect(this.audio, false);
                }
            }
        }
    }
}
