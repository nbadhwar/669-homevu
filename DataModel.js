import { firebaseConfig } from './Secrets';
import { initializeApp, getApps } from 'firebase/app';
import {
    initializeFirestore, collection, query, orderBy, limit,
    doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc, onSnapshot, setDoc
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

        //Users
        this.users = [];
        this.userListeners = [];
        this.chatListeners = [];

        //Furniture
        this.productList = [];
        this.productListRef = collection(db, 'productList')
        this.subscribers = [];

        this.initUsersOnSnapshot();

        //hardcoded list for testing
        // this.productList.push({
        //     key: 1,
        //     user_id: 'tbd',
        //     title: 'Blue Couch',
        //     description: "Lightly used. I really like it but doesn't suit my living room.",
        //     price: 450.00,
        //     image: "https://m.media-amazon.com/images/I/61A1RC8KeRL._AC_SL1500_.jpg",
        //     ar_model: "tbd"
        // });

        // this.productList.push({
        //     key: 2,
        //     user_id: 'tbd',
        //     title: 'Yellow Table',
        //     description: "Lightly used. I really like it but doesn't suit my living room.",
        //     price: 450.00,
        //     image: "https://m.media-amazon.com/images/I/61RwFmhK+uL._AC_SL1500_.jpg",
        //     ar_model: "tbd"
        // });

        // this.productList.push({
        //     key: 3,
        //     user_id: 'tbd',
        //     title: 'Red Chair',
        //     description: "Lightly used. I really like it but doesn't suit my living room.",
        //     price: 450.00,
        //     image: "https://m.media-amazon.com/images/I/51JyYu2pa6L._AC_SL1000_.jpg",
        //     ar_model: "tbd"
        // });

        this.asyncInit();

    }

    /**********************************************
     * Furniture Products
    ************************************************/

    asyncInit = async () => {
        await this.loadList();
    }

    loadList = async () => {
        const q = query(this.productListRef);
        const querySnap = await getDocs(q);
        if (querySnap.empty) return;

        querySnap.docs.forEach(qDocSnap => {
            let key = qDocSnap.id;
            let data = qDocSnap.data();
            data.key = key;
            this.productList.push(data);
        });

        this.updateSubscribers();
    }

    subscribeToUpdates(callback) {
        console.log("new subscriber: ", callback);
        this.subscribers.push(callback);
    }

    updateSubscribers() {
        for (let sub of this.subscribers) {
            sub(); // just tell them there's an update
        }
    }

    /**
     * Product List Item 
     * properties: id, user_id, display_name [username], title, type, date added, availability,
     *             description, condition, price, image, ar_model
     * other possible properties: location, dimensions, tags [array of hashtags for easier search]
     * @param {*} item 
     */

    addItem = async (item) => {

        //TODO: set item.user_id
        //TODO: set item.displayName = user.displayName
        //For this, we need to get login / signup info from Login.js

        if (item.title == null) {
            item.title = 'untitled item'
        }

        //set it to a default current user - test@example.com / 123456
        if (item.user_id == null) {
            item.user_id = "fpgcb5WYYmQw1o67ZqQ3pA5nmtF2"
        }

        //set it to a default current user display name - test@example.com /123456
        if (item.sellerName == null) {
            item.sellerName = "alice"
        }
        //Maybe a dropdown for furniture types in DetailScreen
        if (item.type == null) {
            item.type = 'furniture'
        }

        item.date = Date.now()

        //true - available, false - sold
        //true by default
        //Could be a checkbox
        item.availability = true

        if (item.description == null) {
            item.description = item.title + ' is for sale now.'
        }

        if (item.price == null) {
            item.price = 0
        }

        if (item.image == null) {
            console.log('image unavailable for ' + item.title)
        }

        if (item.ar_model == null) {
            console.log('model unavailable for ' + item.title)
        }

        const newItemDocRef = await addDoc(this.productListRef, item);
        item.key = newItemDocRef.id;
        console.log('item added')

        //local update
        this.productList.push(item);
        this.updateSubscribers();
    }

    deleteItem = async (key) => {
        //db changes
        const delItemDocRef = doc(db, 'productList', key)
        await deleteDoc(delItemDocRef)

        //local changes
        let idx = this.productList.findIndex((elem) => elem.key === key);
        this.productList.splice(idx, 1);
        this.updateSubscribers();
    }

    updateItem = async (key, newItem) => {
        //db changes
        const updateItemDocRef = doc(db, 'productList', key)
        await updateDoc(updateItemDocRef, newItem)

        //local changes
        let idx = this.productList.findIndex((elem) => elem.key === key);
        this.productList[idx] = newItem;

        this.updateSubscribers();
    }

    getItem(key) {
        let idx = this.productList.findIndex((elem) => elem.key === item.key);
        return (this.productList[key]);
    }

    getProductList() {
        return this.productList;
    }

    getProductListCopy() {
        return Array.from(this.productList);
    }

    sortItems = async () => {

        this.updateSubscribers()
    }


    /**********************************************
     * Users and Authentication Data
    ************************************************/

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

    getUser(key) {
        let idx = this.users.findIndex((elem) => elem.key === item.key);
        return (this.users[key]);
    }

    getUserForID(id) {
        for (let u of this.users) {
            if (u.key === id) {
                return u;
            }
        }
        return null;
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


    /**********************************************
    * Chat Messages
   ************************************************/

    addChatListener(chatId, callbackFunction) {
        const listenerId = Date.now();
        const listener = {
            id: listenerId,
            chatId: chatId,
            callback: callbackFunction
        }
        this.chatListeners.push(listener);
        let chatDocRef = doc(db, 'chats', chatId);
        let messagesRef = collection(chatDocRef, 'messages');
        let messageQuery = query(messagesRef, orderBy('timestamp', 'desc'));

        onSnapshot(messageQuery, (qSnap) => {
            if (qSnap.empty) return;
            let allMessages = [];
            qSnap.forEach((docSnap) => {
                let message = docSnap.data();
                message.key = docSnap.id;
                message.author = this.getUserForID(message.authorId); // convert Id to user object
                message.timestamp = message.timestamp.toDate(); // convert Firebase timestamp to JS Date
                allMessages.push(message);
            });
            this.notifyChatListeners(chatId, allMessages);
        });

        return listenerId;
    }

    removeChatListener(listenerId) {
        let idx = this.chatListeners.findIndex((elem) => elem.listenerId === listenerId);
        this.chatListeners.splice(idx, 1);
    }

    notifyChatListeners(chatId, allMessages) {
        for (let cl of this.chatListeners) {
            if (cl.chatId === chatId) {
                cl.callback(allMessages);
            }
        }
    }

    getChatIdForUserIds(user1Id, user2Id) {
        let userPair = [user1Id, user2Id];
        userPair.sort();
        return (userPair[0] + '-' + userPair[1]);
    }

    addChatMessage(chatId, messageContents) {

        // construct a reference to the chat's Firestore doc
        let chatDocRef = doc(db, 'chats', chatId);

        // create chat doc if it doesn't exist, otherwise update participants
        let participants = messageContents.recipients;
        participants.push(messageContents.authorId);
        setDoc(chatDocRef, { participants: participants });

        // add the message to the chat doc's 'messages' collection
        let messagesRef = collection(chatDocRef, 'messages');
        addDoc(messagesRef, messageContents); // let onSnapshot() do it's work!
    }

}



let theDataModel;

export function getDataModel() {
    if (!theDataModel) {
        theDataModel = new DataModel();
    }
    return theDataModel;
}

/**
 * Color Scheme variables for the App
 */
export const homevuColors = {
    red: '#B4041E',
    blue: '#00A6ED',
    green: '#7FB800',
    yellow: '#FFB400',

    redShade: '#640211',
    blueShade: '#0072A3',
    greenShade: '#466600',
    yellowShade: '#A37200',

    redTint: '#FC5F77',
    blueTint: '#47C8FF',
    greenTint: '#BEF16E',
    yellowTint: '#FFC847',
}