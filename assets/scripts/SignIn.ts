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
export default class SignIn extends cc.Component {

    private signInComponentPath: string = "Canvas/Box/Layout/";

    private exitButtonPath: string = "Canvas/Box/Exit Button";

    onLoad () {
        auth.authState();
    }

    start () {
        cc.find(this.signInComponentPath + "Submit").on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.signIn();
        })
        cc.find(this.exitButtonPath).on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("auth menu");
        })
    }

    // update (dt) {}

    loadScene(scene: string) {
        cc.director.loadScene(scene)
    }

    async signIn() {
        var emailRef = cc.find(this.signInComponentPath + "Email/Label").getComponent(cc.Label).string;
        var passwordRef = cc.find(this.signInComponentPath + "Password/Label").getComponent(cc.Label).string;
        try {
            await auth.signIn(emailRef, passwordRef);
            console.log("sign in successfully");
            cc.director.loadScene("loading", ()=>{
                this.scheduleOnce(()=>{
                    cc.director.loadScene("main menu");
                }, 2);
            });
        } catch(e) {
            console.log(e.message);
        }
    }
}
