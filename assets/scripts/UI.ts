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
export default class UI extends cc.Component {

    @property(cc.Label)
    life: cc.Label = null;

    @property(cc.Label)
    coin: cc.Label = null;

    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Label)
    timer: cc.Label = null;

    @property(cc.Node)
    winScene: cc.Node = null;

    @property(cc.Label)
    level: cc.Label = null;

    @property(cc.Label)
    levelCleared: cc.Label = null;

    @property(cc.Label)
    bonus: cc.Label = null;

    @property(cc.Label)
    bonusTime: cc.Label = null;

    @property(cc.Label)
    bonusScore: cc.Label = null;

    @property(cc.AudioClip)
    gameOverAudio: cc.AudioClip = null;

    @property(cc.Node)
    pauseMenu: cc.Node = null;

    @property(cc.Button)
    resumeBtn: cc.Button = null;

    @property(cc.Button)
    restartBtn: cc.Button = null;

    @property(cc.Button)
    exitBtn: cc.Button = null;

    private bigMario: boolean = false;

    private coinVal: number = 0;

    private lifeVal: number = 5;

    private scoreVal: number = 0;

    private timerVal: number;

    private currentLevel: number = 1;

    private isWin: boolean = false;

    private restart: boolean = false;

    private timeout: boolean = false;

    private username: string = null;

    async onLoad () {
        await auth.authState();
    }

    start () {
        this.startTimer(300);
        this.loadBtn();
        
    }

    update (dt) {
        this.timer.string = this.timerVal.toString();
    }

    startTimer(time: number) {
        this.timerVal = time;
        setInterval(()=>{
            if(!cc.director.isPaused() && !this.isWin) {
                this.timerVal--;
                if(this.timerVal < 0) {
                    this.timeout = true;
                }
            }
        }, 1000);
    }

    async loadUserStats() {
        var user = auth.getUser();
        if(user) {
            this.username = user.displayName;
            var stats = auth.getStats(user.uid);
            await stats.once("value").then((snapshot)=>{
                this.lifeVal = snapshot.val().life;
                this.coinVal = snapshot.val().coin;
                this.scoreVal = snapshot.val().score;
                this.bigMario = snapshot.val().bigMario;
                this.currentLevel = snapshot.val().level;
            })
        }
        this.life.string = this.lifeVal.toString();
        this.coin.string = this.coinVal.toString();
        this.score.string = this.scoreVal.toString().padStart(7, "0");
    }

    async updateUserStats(bigMario: boolean, coin: number, currentLevel: number, life: number, score: number, username: string) {
        return await auth.updateUserStats(bigMario, coin, currentLevel, life, score, this.username);
    }

    updateCoin(coin: number) {
        this.coinVal += coin;
        this.coin.string = this.coinVal.toString();
    }

    updateBigMario(flag: boolean) {
        this.bigMario = flag;
    }

    updateScore(score: number) {
        this.scoreVal += score;
        this.score.string = this.scoreVal.toString().padStart(7, "0");
    }

    getBigMario() {
        return this.bigMario;
    }

    async win() {
        this.isWin = true;
        this.stopMusic();
        this.winScene.active = true;
        this.scheduleOnce(()=>{
            this.levelCleared.node.active = true;
        }, 1.5);
        var time = this.timer.string;
        this.bonusTime.string = this.timer.string;
        this.scheduleOnce(()=>{
            this.updateScore(parseInt(time) * 5);
            this.bonusScore.string = this.score.string;
        }, 2)
        this.scheduleOnce(()=>{
            this.bonus.node.active = true;
        }, 3)
        var user = auth.getUser();
        if(user) {
            await this.updateUserStats(this.bigMario, this.coinVal, 2, this.lifeVal, this.scoreVal + parseInt(time) * 5 , this.username);
        }
        this.scheduleOnce(()=>{
            this.loadScene("main menu");
        }, 7)
    }

    decreaseLife() {
        if(this.lifeVal > 1) {
            this.lifeVal -= 1;
            this.updateUserStats(false, this.coinVal, this.currentLevel, this.lifeVal, this.scoreVal, this.username);
            this.loadScene(cc.director.getScene().name);
        } else {
            this.lifeVal = 5;
            this.updateUserStats(false, this.coinVal, this.currentLevel, this.lifeVal, this.scoreVal, this.username);
            this.loadScene("main menu");
        }
    }

    loadScene(scene: string) {
        cc.audioEngine.stopMusic();
        var transition;
        if(this.isWin || this.restart) {
            transition = "loading";
        } else {
            transition = (scene == "level-" + this.level.string) ? "game start" : "game over";
            if(transition == "game over") {
                cc.audioEngine.playEffect(this.gameOverAudio, false);
            }
        }
        cc.director.loadScene(transition, ()=>{
            this.scheduleOnce(()=>{
                cc.director.loadScene(scene);
            }, 3);
        });
    }

    stopMusic() {
        cc.audioEngine.stopAll();
    }

    pause() {
        if(cc.director.isPaused()) {
            cc.director.resume();
            this.pauseMenu.active = false;
        } else {
            cc.director.pause();
            this.pauseMenu.active = true;
        }
    }

    isTimeOut() {
        return this.timeout;
    }

    loadBtn() {
        this.resumeBtn.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.pause();
        });
        this.restartBtn.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.restart = true;
            cc.director.resume();
            this.loadScene(cc.director.getScene().name);
        });
        this.exitBtn.node.on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.restart = true;
            cc.director.resume();
            this.loadScene("main menu");
        });
    }
}
