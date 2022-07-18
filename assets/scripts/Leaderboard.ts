// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import {Auth} from './Auth';
const {ccclass, property} = cc._decorator;
const auth = new Auth();
var rank = null;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    exit: cc.Button = null;

    private path: string = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.path = "Canvas/Main Layout/Sub Title Layout/Rank Layout/";
        this.exit.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene();
        });
    }

    async start () {
        await auth.getRank();
    }

    update (dt) {
        if(rank == null) {
            rank = auth.getRankResult();
        } else {
            this.updateBoard();
        }
    }

    loadScene() {
        // cc.audioEngine.stopMusic();
        cc.director.loadScene("loading", ()=>{
            this.scheduleOnce(()=>{
                cc.director.loadScene("main menu");
            }, 2);
        });
    }

    updateBoard() {
        for(var i = 1; i <= 5; i++) {
            cc.find(this.path + i + "/Username").getComponent(cc.Label).string = rank[i-1].username;
            cc.find(this.path + i + "/Score").getComponent(cc.Label).string = rank[i-1].score;
        }
    }
}
