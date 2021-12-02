import { firebaseConfig } from './Secrets';
import { initializeApp, getApps } from 'firebase/app';
import {
    initializeFirestore, collection, query, orderBy, limit,
    doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc, onSnapshot
} from "firebase/firestore";


let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
}
const db = initializeFirestore(app, {
    useFetchStreams: false
});

class DataModel {
    constructor() {
        this.users = [];
        this.userListeners = [];
        this.chatListeners = [];
        this.initUsersOnSnapshot();
        this.firebaseCheckRef = collection(db, 'firebaseCheck')
    }

    addItem = async (item) => {
        let newItemDocRef = await addDoc(this.firebaseCheckRef, item);
        item.key = newItemDocRef.id;
    }



    addUserListener(callbackFunction) {
        const listenerId = Date.now(); // need an ID for deletion later
        const listener = {
            id: listenerId,
            callback: callbackFunction
        };
        this.userListeners.push(listener);
        callbackFunction(); // have the caller check right away
        return listenerId;
    }

    removeUserListener(listenerId) {
        let idx = this.userListeners.findIndex((elem) => elem.id === listenerId);
        this.userListeners.splice(idx, 1);
    }

    notifyUserListeners() {
        for (let ul of this.userListeners) {
            ul.callback();
        }
    }


    initUsersOnSnapshot() {
        onSnapshot(collection(db, 'users'), (qSnap) => {
            if (qSnap.empty) return;
            let userList = [];
            qSnap.forEach((docSnap) => {
                let user = docSnap.data();
                user.key = docSnap.id;
                userList.push(user);
            });
            this.users = userList;
            this.notifyUserListeners();
        });
    }


    async getUserForAuthUser(authUser) {
        const userAuthId = authUser.uid;
        for (let u of this.users) {
            if (u.authId === userAuthId) {
                return u;
            }
        }
        // if we got here, it's a new user
        console.log('user not found, need to create them!');
    }

    getUsers() {
        return this.users
    }
    async createUser(authUser) {
        let newUser = {
            displayName: authUser.providerData[0].displayName,
            authId: authUser.uid
        };
        console.log('about to create new user', newUser);
        console.log('from authUser user', authUser);
        const userDoc = await addDoc(collection(db, 'users'), newUser);
        newUser.key = userDoc.id;
        this.notifyUserListeners();
        return newUser;
    }


    async getUserForAuthUser(authUser) {
        const userAuthId = authUser.uid;
        for (let u of this.users) {
            if (u.authId === userAuthId) {
                return u;
            }
        }
        // if we got here, it's a new user
        let newUser = await this.createUser(authUser);
        return newUser;
    }
}

let theDataModel;

export function getDataModel() {
    if (!theDataModel) {
        theDataModel = new DataModel();
    }
    return theDataModel;
}