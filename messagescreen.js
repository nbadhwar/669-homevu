import React, { useEffect, useState } from 'react';
import { Icon, Button } from 'react-native-elements';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, StyleSheet } 
  from 'react-native';
import { getDataModel } from './DataModel';


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
            <Icon 
              name='log-out'
              color='black'
              size={24}
              onPress={()=>{
                navigation.navigate('Login');
              }}
            />
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
      paddingTop: '15%',
      paddingHorizontal: '2%'
    },
  
    header: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: '5%'
    },
    headerRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: '5%'
    },
    headerText: {
      fontSize: 18,
      //padding: '3%'
    },
  
    userListContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    paddingHorizontal: '5%'
    },
    userListItem: {
      width: '100%',
      padding: '5%'
    },
    userListItemText: {
      fontSize: 18,
      color: 'green',
    },  
  
  });

export default MessageScreen;