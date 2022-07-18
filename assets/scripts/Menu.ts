// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    private buttonPath: string = "Canvas/Main Layout/Button Layout/";

    // onLoad () {}

    start () {
        if(cc.audioEngine.isMusicPlaying() == false) {
            this.playMusic();
        }
        cc.find(this.buttonPath + "Sign In Button").on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("signin");
        })
        cc.find(this.buttonPath + "Sign Up Button").on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("signup");
        })
    }

    // update (dt) {}

    loadScene(scene: string) {
        cc.director.loadScene(scene);
    }

    playMusic() {
        cc.audioEngine.playMusic(this.bgm, true);
    }
}
