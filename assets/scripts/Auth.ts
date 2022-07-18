// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
var list = [];
var sorted = null;

@ccclass
export class Auth extends cc.Component {
    // async signUp(email, password) {
    //     try {
    //         await firebase.auth().createUserWithEmailAndPassword(email, password);
    //         console.log("account created");
    //     } catch (e) {
    //         console.log(e.message);
    //     }
    // }

    //  firebase auth

    private currentUser;

    private db;

    private rankResult: boolean = false;

    signIn(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    signUp(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    updateDisplayName(name) {
        return firebase.auth().currentUser.updateProfile({
            displayName: name
        })
    }
    
    authState() {
        return firebase.auth().onAuthStateChanged((user)=>{
            this.db = firebase.database();
            this.currentUser = user;
            // if(user !== null) {
            //     console.log("GET DATABASE");
            //     this.db = firebase.database().ref;
            //     console.log(this.db);
            // }
        })
    }

    getUser() {
        return firebase.auth().currentUser;
    }

    //  firebase database
    getStats(id) {
        return firebase.database().ref("userData/" + id);
    }
    
    createAccount() {
        return this.updateUserStats(false, 0, 1, 5, 0, firebase.auth().currentUser.displayName)
    }

    updateUserStats(bigMario: boolean, coin: number, level: number, life: number, score: number, username: string) {
        var userStats = {
            bigMario: bigMario,
            coin: coin,
            level: level,
            life: life,
            score: score,
            username: username,
        }
        return firebase.database().ref("userData/" + this.currentUser.uid).update(userStats);
    }

    getAllUserData() {
        return firebase.database().ref("userData");
    }

    async loadUserStats() {
        var data = this.getAllUserData();
        data.once("value").then((snapshot)=>{
            snapshot.forEach((snapshotVal) => {
                list.push({
                    score: snapshotVal.val().score,
                    username: snapshotVal.val().username,
                });
            });
        }).then(()=>{
            sorted = list.sort((a, b)=>{
                return (b.score - a.score)
            })
        })
    }

    async getRank() {
        this.rankResult = false;
        list = [];
        sorted = null;
        await this.loadUserStats();
        this.rankResult = true;
        return sorted;
    }

    getRankResult() {
        if(sorted != null) {
            return sorted;
        } else {
            return null;
        }
    }
}
