// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Player from "../Player"
import Score400 from "../Effects/Score400"
const {ccclass, property} = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {

    @property(Score400)
    score : Score400 = null;

    @property(Player)
    player : Player = null;

    @property(cc.AudioClip)
    stompAudio: cc.AudioClip = null;

    private moveSpeed: number = 40;

    private moveDirection: number = -1;

    private animation: cc.Animation = null;

    private rigidBody: cc.RigidBody = null;

    private onGround: boolean = false;

    private inCamera: boolean = false;

    private animationState = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
    }

    start () {

    }

    update (dt) {
        if(this.inCamera) {
            if(this.isPlayerDie() || this.isGameCleared()) {
                this.animation.stop();
            } else if(this.onGround) {
                this.goombaMove(dt);
            }
        } else {
            this.updatePosition();
        }
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "LeftBound") {
            this.moveDirection = 1;
        } else if(other.node.name == "RightBound") {
            this.moveDirection = -1;
        } else {
            if(contact.getWorldManifold().normal.x != 1 && contact.getWorldManifold().normal.x != -1) { // not bumped from left or right
                if(contact.getWorldManifold().normal.y > 0) {   // got stepped on
                    if(other.node.name == "Player") {
                        if(!this.animationState || this.animationState.name != "goomba_normal_die") {
                            this.goombaDie(other.node);
                        }
                    }
                } else {
                    if(other.node.name == "Ground" || other.node.name == "Platform_long") {
                        this.onGround = true;
                    } else if(other.node.name == "DieBound") {
                        this.goombaFall();
                    }
                }
            } else {
                if(other.node.name == "Player" && (!this.animationState || this.animationState.name != "goomba_normal_die")) {
                    if(this.player.getPoweredUp()) {
                        this.player.playerPowering()
                    } else {
                        this.player.playerDie();
                    }
                }
            }
        }
    }

    onEndContact(contact, self, other) {
        if(other.node.name == "Ground") {
            this.onGround = false;
            this.rigidBody.linearVelocity = cc.v2(0, 0);
        }
    }

    goombaMove(dt) {
        this.node.x += this.moveSpeed * this.moveDirection * dt;
    }

    goombaDie(player) {
        this.moveDirection = 0;
        this.animationState = this.animation.play("goomba_normal_die");
        cc.audioEngine.playEffect(this.stompAudio, false);
        player.runAction(cc.moveBy(0.15, 0, 250).easing(cc.easeIn(2)));
        this.score.playAnimation();
        this.scheduleOnce(()=> {
            this.node.destroy();
        }, 0.25);
    }

    goombaFall() {
        this.node.destroy();
    }

    updatePosition() {
        var playerPos = this.player.node.getPosition();
        var enemyPos = this.node.parent.getPosition();
        if(enemyPos.x - playerPos.x < 1000) {
            this.inCamera = true;
        }
    }

    isPlayerDie() {
        return this.player.isPlayerDie();
    }

    isGameCleared() {
        return this.player.isGameCleared();
    }
}
