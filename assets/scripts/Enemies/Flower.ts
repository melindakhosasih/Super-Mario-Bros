// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Player from "../Player"
import Score800 from "../Effects/Score800"
const {ccclass, property} = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {

    @property(Player)
    player : Player = null;

    private animation: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
    }

    start () {
        
    }

    update (dt) {
        if(this.isGameCleared()) {
            this.animation.stop();
        }
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "Player") {
            if(this.player.getPoweredUp()) {
                this.player.playerPowering()
            } else {
                this.player.playerDie();
            }
        }
    }

    isGameCleared() {
        return this.player.isGameCleared();
    }
}
