import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TextInput, Text, View, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { homevuColors, getDataModel } from './DataModel';

export function ChatScreen({ navigation, route }) {

    const dataModel = getDataModel();
    const { currentUserId, otherUserId } = route.params;
    const currentUser = dataModel.getUserForID(currentUserId);
    const otherUser = dataModel.getUserForID(otherUserId);
    const chatId = dataModel.getChatIdForUserIds(currentUserId, otherUserId);

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        function handleChatUpdate(newMessages) {
            setMessages(newMessages);
        }
        const listenerId = dataModel.addChatListener(chatId, handleChatUpdate);
        return (() => {
            dataModel.removeChatListener(listenerId);
        })
    }, []);

    return (
        <View style={styles.body}>

            <View style={styles.header}>
                <Icon
                    name='arrow-left'
                    size={32}
                    type='material-icons'
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerText}>
                    {currentUser.displayName}, meet {otherUser.displayName}!
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.inputBoxContainer}>
                    <TextInput
                        style={styles.inputBox}
                        placeholder='Type your message'
                        value={messageInput}
                        onChangeText={(text) => setMessageInput(text)}
                    />
                </View>
                <View style={styles.inputButtonContainer}>
                    <Icon
                        name='send'
                        color='black'
                        type='material-icons'
                        size={18}
                        onPress={() => {
                            let messageContents = {
                                text: messageInput,
                                authorId: currentUserId,
                                recipients: [otherUserId],
                                timestamp: new Date()
                            };
                            dataModel.addChatMessage(chatId, messageContents);
                            setMessageInput('');
                        }}
                    />
                </View>
            </View>

            <View style={styles.messageListContainer}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => {
                        return (
                            <View style={[
                                styles.messageContainer,
                                item.authorId === currentUserId ? {} : { alignItems: 'flex-end' }
                            ]}>
                                <Text style={styles.messageText}>
                                    {item.authorId === currentUserId ? 'Me' : item.author.displayName}: {item.text}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
            <View style={[styles.menuContainer, styles.shadowProp]}>
                <TouchableOpacity
                    style={[styles.listItemAddButton]}
                    onPress={() => {
                        navigation.navigate("Home", { currentUser: currentUser });
                    }}>
                    <Icon
                        size={32}
                        name='home'
                        type='material-icons'
                        color={homevuColors.red}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.listItemAddButton]}
                    onPress={() => {
                        navigation.navigate("Details", { currentUser: currentUser });
                    }}>
                    <Icon
                        size={32}
                        name='add-circle'
                        type='material-icons'
                        color={homevuColors.red}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.listItemMessageButton]}
                    onPress={() => {
                        navigation.navigate("Messages", { currentUser: currentUser });
                    }}>
                    <Icon
                        size={32}
                        name='message'
                        type='material-icons'
                        color={homevuColors.red}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.listItemFilterButton]}
                    onPress={() => {
                        //TODO: Navigate to Profile Page
                    }}>
                    <Icon
                        size={32}
                        name='person'
                        type='material-icons'
                        color={homevuColors.red}

                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: '15%',
        paddingHorizontal: '2%'
    },
    headerText: {
        fontSize: 32
    },
    header: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },

    inputContainer: {
        flex: 0.1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    inputBoxContainer: {
        flex: 0.8,
        paddingHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    inputButtonContainer: {
        flex: 0.2,
        paddingHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    inputBox: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 18,
        padding: '3%'
    },

    messageListContainer: {
        flex: 0.6,
        width: '100%',
        paddingHorizontal: '5%',
    },
    messageContainer: {
        flex: 1,
        width: '100%',
        padding: '5%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    messageText: {
        fontSize: 18
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row',
        position: 'fixed',
        paddingHorizontal: 20,
        right: 0,
        left: 0,
        bottom: 0,
        height: '10%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});
