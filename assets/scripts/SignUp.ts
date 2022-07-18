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
export default class SignUp extends cc.Component {

    private signUpComponentPath: string = "Canvas/Box/Layout/";

    private exitButtonPath: string = "Canvas/Box/Exit Button";

    onLoad () {
        auth.authState();
    }

    start () {
        cc.find(this.signUpComponentPath + "Submit").on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.signup();
        })
        cc.find(this.exitButtonPath).on(cc.Node.EventType.MOUSE_DOWN, ()=>{
            this.loadScene("auth menu");
        })
    }

    // update (dt) {}

    loadScene(scene: string) {
        cc.director.loadScene(scene);
    }

    async signup() {
        var emailRef = cc.find(this.signUpComponentPath + "Email/Label").getComponent(cc.Label).string;
        var usernameRef = cc.find(this.signUpComponentPath + "Username/Label").getComponent(cc.Label).string;
        var passwordRef = cc.find(this.signUpComponentPath + "Password/Label").getComponent(cc.Label).string;
        try {
            await auth.signUp(emailRef, passwordRef);
            await auth.updateDisplayName(usernameRef);
            await auth.createAccount();
            console.log("Account created");
            this.loadScene("auth menu");
        } catch (e) {
            console.log(e.message);
        }
    }


}
