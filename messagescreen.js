import React, { useEffect, useState } from 'react';
import { Avatar, Icon, Button } from 'react-native-elements';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, StyleSheet } 
  from 'react-native';
import { getDataModel, homevuColors } from './DataModel';


function MessageScreen({navigation, route}) {

    const dataModel = getDataModel();
    const initUsers = dataModel.getUsers();
    const [users, setUsers] = useState(initUsers);
    const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)
  
    useEffect(() => {
      const dataModel = getDataModel();
      const listenerId = dataModel.addUserListener(() => {
        let newUsers = Array.from(dataModel.getUsers());
        setUsers(newUsers);
      });
      return(() => {
        dataModel.removeUserListener(listenerId);
      });
    }, []);
  
    return (
      <View style={styles.body}>
        
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, {fontSize: 32}]}> 
              Hi, {currentUser.displayName}
            </Text>
          </View>
          <View style={[styles.headerRow, {justifyContent: 'flex-start'}]}>
            <Text style={styles.headerText}>
              Who would you like to chat with?
            </Text>
          </View>
        </View>
  
        <View style={styles.userListContainer}>
          <FlatList
            data={users}
            renderItem={({item}) => {
              if (item.key === currentUser.key) {
                return <View/>
              } else {
                return (
                  <TouchableOpacity
                    style={styles.userListItem}
                    onPress={()=>{
                      navigation.navigate('Chat', {
                        currentUserId: currentUser.key,
                        otherUserId: item.key
                      });
                    }}
                  >
                    <Text style={styles.userListItemText}>{item.displayName}</Text>
                    <View style={styles.listDivider}>

                    </View>
                  </TouchableOpacity>
                );
              }
            }}
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'white',
    },
  
    header: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: '5%',
      backgroundColor: homevuColors.redTint,
      padding: '5%',

    },
    headerRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    headerText: {
      fontSize: 18,
      //padding: '3%'
      color: 'white',
    },
    userListContainer: {
      flex: 0.9,
      width: '100%',
      margin: 10,

    },
    userListItem: {
      paddingVertical: 10,

    },
    userListItemText: {
      margin: 10,
      fontSize: 18,
      paddingHorizontal: 10,


    },  

    listDivider:{
      marginTop: 10,
      height: 1,
      width: '100%',
      backgroundColor: 'grey',

    },
  
  });

export default MessageScreen;