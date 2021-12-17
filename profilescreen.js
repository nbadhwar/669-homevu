import React, {useState, useEffect} from 'react';
import { Input, Button, CheckBox, Icon } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
    getAuth, updateProfile,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } from "firebase/auth";

function ProfileScreen({navigation, route}) {

    const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)
    const [description, setDescription] = useState(currentUser? currentUser.displayName : '');
    console.log(currentUser);

  return (
    <View style={styles.container}>
        <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Edit Display Name:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item description..."
          onChangeText={(text)=>setDescription(text)}
          value={description}
        />
      </View>
      <Button
          containerStyle={styles.button}
          title={"Save"}
          onPress={()=>{
            updateProfile(currentUser.authId, { displayName: description });
          }}
        />
        <Button
          containerStyle={styles.logoutbutton}
          title={"Logout"}
          onPress={()=>{
            navigation.navigate('Login');
          }}
        />
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
            navigation.navigate("Profile", { currentUser: currentUser });
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
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logoutbutton: {
        position: 'fixed',
        bottom: 150,

    },
    inputArea: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10 
      },
      inputLabel: {
        width: 120,
        textAlign: 'right',
        fontSize: 18,
        paddingRight: 10,
        paddingBottom: 10,
        color: homevuColors.redShade,
        fontWeight: 'bold'
      },
      inputBox: {
        flex: 0.8,
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
      },
      buttonShadowProp: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      },
      shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
    
  });

export default ProfileScreen;