// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Player from "./Player"
import UI from "./UI"
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(Player)
    player: Player = null;

    @property(UI)
    UI: UI = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    private aKeyDown: boolean = false;

    private dKeyDown: boolean = false;

    private leftKeyDown: boolean = false;

    private rightKeyDown: boolean = false;

    // private spaceKeyDown: boolean = false;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -200);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    
    start() {
        this.playBGM();
    }

    update (dt) {
        var playerPos = this.player.node.getPosition();
        var cameraPos = this.camera.getPosition();
        cameraPos.lerp(playerPos, 0.1, cameraPos);
        cameraPos.y = cc.misc.clampf(playerPos.y, 0, 200);
        if(cameraPos.x < 0) {
            cameraPos.x = 0;
        } else if(cameraPos.x > 8500) {
            cameraPos.x = 8500;
        }
        this.camera.setPosition(cameraPos);
    }

    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case cc.macro.KEY.a:        // move left
                this.aKeyDown = true;
                this.player.setPlayerMoveDirection(-1);
                break;
            case cc.macro.KEY.left:     // move left
                this.leftKeyDown = true;
                this.player.setPlayerMoveDirection(-1);
                break;
            case cc.macro.KEY.d:        // move right
                this.dKeyDown = true;
                this.player.setPlayerMoveDirection(1);
                break;
            case cc.macro.KEY.right:    // move right
                this.rightKeyDown = true;
                this.player.setPlayerMoveDirection(1);
                break;
            case cc.macro.KEY.space:    // jump
                this.player.setPlayerJump(true);
                break;
            case cc.macro.KEY.escape:
                this.UI.pause();
                break;
            default:
                break;
        }
    }

    onKeyUp(e) {
        switch (e.keyCode) {
            case cc.macro.KEY.a:
                this.aKeyDown = false;
                if(this.rightKeyDown || this.dKeyDown) {
                    this.player.setPlayerMoveDirection(1);  // move right
                } else if(this.leftKeyDown) {
                    this.player.setPlayerMoveDirection(-1); // move left
                } else {
                    this.player.setPlayerMoveDirection(0);  // stop moving
                }
                break;
                case cc.macro.KEY.left:
                this.leftKeyDown = false;
                if(this.rightKeyDown || this.dKeyDown) {
                    this.player.setPlayerMoveDirection(1);  // move right
                } else if(this.aKeyDown) {
                    this.player.setPlayerMoveDirection(-1); // move left
                } else {
                    this.player.setPlayerMoveDirection(0);  // stop moving
                }
                break;
            case cc.macro.KEY.d:
                this.dKeyDown = false;
                if(this.leftKeyDown || this.aKeyDown) {
                    this.player.setPlayerMoveDirection(-1); // move left
                } else if(this.rightKeyDown) {
                    this.player.setPlayerMoveDirection(1);  // move right
                } else {
                    this.player.setPlayerMoveDirection(0);  // stop moving
                }
                break;
            case cc.macro.KEY.right:
                this.rightKeyDown = false;
                if(this.leftKeyDown || this.aKeyDown) {
                    this.player.setPlayerMoveDirection(-1); // move left
                } else if(this.dKeyDown) {
                    this.player.setPlayerMoveDirection(1);  // move right
                } else {
                    this.player.setPlayerMoveDirection(0);  // stop moving
                }
                break;
            case cc.macro.KEY.space:
                this.player.setPlayerJump(false);
                break;
            default:
                break;
        }
    }
}
