// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    audio: cc.AudioClip = null;

    private animation: cc.Animation = null;

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
    }

    // start () {

    // }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        if(contact.getWorldManifold().normal.y == -1) {
            if(other.node.name == "Player") {
                this.animation.play("qblock_empty");
                cc.audioEngine.playEffect(this.audio, false);
                
            }
        }
        
    }
}
