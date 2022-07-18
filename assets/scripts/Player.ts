// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import UI from "./UI"
const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    dieAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerUpAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerDownAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;

    @property(UI)
    UI: UI = null;

    private moveSpeed: number = 300;

    private moveDirection: number = 0;

    private jumpVelocity: number = 1100;

    private jumpVelocityBig: number = 1300;

    private jump: boolean = false;

    private isOnGround: boolean = false;

    private isDie: boolean = false;

    private isMove: boolean = false;

    private isPoweredUp: boolean = false;

    private isPoweringTrans: boolean = false;

    private animation: cc.Animation = null;

    private rigidBody: cc.RigidBody = null;

    private isDieBound: boolean = false;

    private animationState = null;

    private win: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    async onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        await this.UI.loadUserStats();
        this.isPoweredUp = this.UI.getBigMario();
    }

    start () {

    }

    update (dt) {
        if(this.UI.isTimeOut()) {
            this.playerDie();
        } else {
            if(!this.win) {
                if(!this.isDie) {
                    this.playerMove(dt);
                    if(this.jump) {
                        this.playerJump();
                    }
                    this.playerAnimation();
                }
            } else {
                this.playerAnimation();
                this.scheduleOnce(()=>{
                    this.animation.stop();
                }, 1)
            }
        }
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "WinBound") {
            this.UI.stopMusic();
            cc.audioEngine.playMusic(this.winAudio, false);
            this.win = true;
            this.scheduleOnce(()=>{
                this.UI.win();
            }, 2);
        } else if(other.node.name == "DieBound") {
            if(other.node.name == "DieBound") {
                this.isDieBound = true;
                this.playerDie();
            } 
        } else {
            if(contact.getWorldManifold().normal.x == 1 || contact.getWorldManifold().normal.x == -1) { // touch left or right
                
            } else {
                if(contact.getWorldManifold().normal.y < 0) { // step on it
                    this.isOnGround = true;
                } else {   //  hit from below
  
                }
            }    
        }
    }

    playerMove(dt) {
        this.node.x += this.moveSpeed * this.moveDirection * dt;    // player walking
        this.isMove = (this.moveDirection != 0) ? true : false;
        if(this.moveDirection == 1) {   // change direction using scaling
            this.node.scaleX = 1;
        } else if(this.moveDirection == -1) {
            this.node.scaleX = -1;
        }
    }

    playerJump() {
        if(this.isOnGround) {  // player is on ground
            if(this.isPoweredUp) {
                this.rigidBody.linearVelocity = cc.v2(0, this.jumpVelocityBig);    // add jumping velocity
            } else {
                this.rigidBody.linearVelocity = cc.v2(0, this.jumpVelocity);    // add jumping velocity
            }
            this.isOnGround = false;
            cc.audioEngine.playEffect(this.jumpAudio, false);
        }
    }

    playerDie() {
        this.UI.stopMusic();
        this.isDie = true;
        this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
        if(!this.isDieBound) {
            this.node.runAction(cc.moveBy(2, 0, 4000));
        } 
            cc.audioEngine.playEffect(this.dieAudio, false);
        this.scheduleOnce(()=>{
            this.UI.decreaseLife();
        }, 1.5);
    }

    playerPowering() {
        this.isPoweringTrans = true;
    }

    playerAnimation() {
        if(!this.isPoweredUp) {
            if(this.isDie) {
                this.animation.play("mario_small_die");
            } else if (this.win) {
                this.animation.play("mario_small_idle");
            } else if(this.isPoweringTrans) {
                if(!this.animationState || this.animationState.name != "mario_power_up") {
                    this.animationState = this.animation.play("mario_power_up");
                    this.scheduleOnce(()=>{
                        this.animation.play("mario_big_idle");
                        this.isPoweringTrans = false;
                        this.isPoweredUp = true;
                        this.UI.updateBigMario(true);
                    }, 1.3)
                    cc.audioEngine.playEffect(this.powerUpAudio, false);
                }
            } else if(this.isOnGround && !this.isMove) {   // keep the idle animation
                this.animation.play("mario_small_idle");
            } else if(this.isOnGround && this.isMove && !this.animation.getAnimationState("mario_small_walk").isPlaying) {    // replay after the animation finished
                this.animation.play("mario_small_walk");
            } else if(!this.isOnGround && !this.animation.getAnimationState("mario_small_jump").isPlaying) {  // keep jumping until it touch the ground
                this.animation.play("mario_small_jump");
            }
        } else {
            if(this.isDie) {
                this.animation.play("mario_small_die");
            } else if (this.win) {
                this.animation.play("mario_big_idle");
            } else if(this.isPoweringTrans) {
                if (!this.animationState || this.animationState.name != "mario_power_down") {
                    this.animationState = this.animation.play("mario_power_down");
                    this.scheduleOnce(()=>{
                        this.animation.play("mario_small_idle");
                        this.isPoweringTrans = false;
                        this.isPoweredUp = false;
                        this.UI.updateBigMario(false);
                    }, 1.3)
                    cc.audioEngine.playEffect(this.powerDownAudio, false);
                }
            } else if(this.isOnGround && !this.isMove) {   // keep the idle animation
                this.animation.play("mario_big_idle");
            } else if(this.isOnGround && this.isMove && !this.animation.getAnimationState("mario_big_walk").isPlaying) {    // replay after the animation finished
                this.animation.play("mario_big_walk");
            } else if(!this.isOnGround && !this.animation.getAnimationState("mario_big_jump").isPlaying) {  // keep jumping until it touch the ground
                this.animation.play("mario_big_jump");
            }
        }
    }

    setPlayerMoveDirection(dir: number) {
        this.moveDirection = dir;
    }

    setPlayerJump(val: boolean) {
        this.jump = val;
    }

    getPoweredUp() {
        return this.isPoweredUp;
    }

    isPlayerDie() {
        return this.isDie;
    }

    isGameCleared() {
        return this.win;
    }
}
