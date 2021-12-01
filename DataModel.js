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
}

let theDataModel;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}