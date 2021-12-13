import React, { useEffect, useState } from 'react';
import { Icon, Button } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import { color } from 'react-native-elements/dist/helpers';


function DisplayScreen({ navigation, route }) {
    let item = route.params.item
    const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)
    console.log(currentUser)
    const dataModel = getDataModel();
    return (
        <View style={styles.body}>
            <View>
                <Image
                    style={styles.displayItemImage}
                    source={{ uri: item.image }}
                     />
            </View>
            <View style={styles.displayContainer}>
                <Text style={styles.displayItemTitle}>{item.title}</Text>
                <Text style={styles.displayItemPrice}>${item.price}</Text>
                <Text style={styles.displayItemDescription}>{item.description}</Text>
                <Text style={styles.displayItemSeller}>Sold by {item.sellerName ? item.sellerName : "Unknown"}</Text>
            </View>
            {(currentUser.key === item.user_id) ?
                <View style={styles.displayButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.displayEditButton, styles.buttonShadowProp]}
                        onPress={() => {
                            navigation.navigate("Details", { item: item, currentUser: currentUser });
                        }}>
                        <Icon
                            name='edit'
                            type='material-icons'
                            color='white'
                        />
                        <Text style={[styles.displayButtonText]}>Edit Item</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.displayDeleteButton, styles.buttonShadowProp]}
                        title="Delete Item"
                        onPress={() => {
                            dataModel.deleteItem(item.key);
                        }}
                    >
                        <Icon
                            name='delete'
                            type='material-icons'
                            color='white'
                        />
                        <Text style={[styles.displayButtonText]}>Delete Item</Text>
                    </TouchableOpacity>
                </View> :
                <View>
                    <TouchableOpacity
                        style={styles.userListItem}
                        onPress={() => {
                            navigation.navigate('Chat', {
                                currentUserId: currentUser.key,
                                otherUserId: item.key
                            });
                        }}
                    >
                        <Text style={styles.userListItemText}>{item.displayName}</Text>
                    </TouchableOpacity>
                </View>
            }
            <View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        flex: 1
    },
    displayContainer: {
        marginHorizontal: 40,
        flex: 0.4,
    },
    displayItemImage: {
        alignSelf: 'center',
        flex: 0.7,
        width: '100%',
        height: 250,
        resizeMode: 'cover'
    },
    displayItemTitle: {
        flex: 0.7,
        fontSize: 24,
        paddingTop: 12,
        fontWeight: 'bold'
    },
    displayItemDescription: {
        flex: 0.7,
        fontSize: 14,
        lineHeight: 24,
    },
    displayItemSeller: {
        flex: 0.7,
        fontStyle: 'italic',
        fontSize: 14,
        lineHeight: 24,
        marginTop: 12,
        color: homevuColors.redShade
    },
    displayItemPrice: {
        marginVertical: 12,
        flex: 0.7,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green'
    },

    displayButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    displayEditButton: {
        flex: 0.3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: homevuColors.blue,
        padding: 10,
        borderRadius: 5,
    },
    displayDeleteButton: {
        flex: 0.3,
        flexDirection: 'row',
        backgroundColor: homevuColors.red,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
    },
    displayButtonText: {
        color: 'white',
        fontSize: 14
    }
})

export default DisplayScreen;
