import { firebaseConfig } from './Secrets';
import { initializeApp, getApps } from 'firebase/app';
import {
    initializeFirestore, collection, query, orderBy, limit,
    doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc
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
        this.firebaseCheckRef = collection(db, 'firebaseCheck')
    }

    addItem = async (item) => {
        let newItemDocRef = await addDoc(this.firebaseCheckRef, item);
        item.key = newItemDocRef.id;
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