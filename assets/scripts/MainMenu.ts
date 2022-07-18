// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import {Auth} from './Auth';
const {ccclass, property} = cc._decorator;
const auth = new Auth();

@ccclass
export default class MainMenu extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.Label)
    username: cc.Label = null;

    @property(cc.Label)
    life: cc.Label = null;

    @property(cc.Label)
    coin: cc.Label = null;

    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Button)
    rule: cc.Button = null;

    @property(cc.Button)
    exit: cc.Button = null;

    @property(cc.Button)
    level1: cc.Button = null;

    @property(cc.Button)
    level2: cc.Button = null;

    @property(cc.Node)
    howToPlay: cc.Node = null;

    @property(cc.Button)
    leaderBoard: cc.Button = null;

    onLoad () {
        if(!cc.audioEngine.isMusicPlaying()) {
            this.playBGM();
        }
        this.menuMouseOn();
        this.exit.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.unshowRule();
        })
        auth.authState();
        this.loadUserStats();
    }

    // start () {
    // }

    menuMouseOn() {
        this.level1.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("level-1");
        })
        this.level2.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("level-2");
        })
        this.leaderBoard.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("leaderboard");
        })
        this.rule.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.showRule();
        })
    }

    menuMouseOff() {
        this.level1.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.level2.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.rule.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.leaderBoard.node.off(cc.Node.EventType.MOUSE_DOWN);
    }

    lockLevel() {
        this.level2.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.level2.interactable = false;
        this.level2.enableAutoGrayEffect = true;
    }

    // update (dt) {}
    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    loadScene(scene: string) {
        if(scene != "leaderboard") {
            cc.audioEngine.stopMusic();
            cc.director.loadScene("game start", ()=>{
                this.scheduleOnce(()=>{
                    cc.director.loadScene(scene);
                }, 2);
            });
        } else {
            cc.director.loadScene("loading", ()=>{
                this.scheduleOnce(()=>{
                    cc.director.loadScene(scene);
                }, 2);
            });
        }
    }

    showRule() {
        this.menuMouseOff();
        this.howToPlay.active = true;
    }

    unshowRule() {
        this.menuMouseOn();
        this.howToPlay.active = false;
    }

    async loadUserStats() {
        var user = auth.getUser();
        if(user) {
            var stats = auth.getStats(user.uid);
            this.username.string = user.displayName;
            await stats.once("value").then((snapshot)=>{
                this.life.string = snapshot.val().life;
                this.coin.string = snapshot.val().coin;
                this.score.string = snapshot.val().score.toString().padStart(7, "0");
                if(snapshot.val().level < 2) {
                    this.lockLevel();
                }
            })
        } else {
            this.lockLevel();
        }
    }
}
