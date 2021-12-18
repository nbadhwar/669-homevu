import React, {useState, useEffect} from 'react';
import { Avatar, Input, Button, CheckBox, Icon } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import { AntDesign } from '@expo/vector-icons';
// import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';

function ProfileScreen({navigation, route}) {

    const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)
    const [description, setDescription] = useState(currentUser? currentUser.displayName : '');
    const [profileImage, setProfileImage] = useState(currentUser ? currentUser.profileImage : null);
    console.log(currentUser);

    const changeUser = currentUser;

    useEffect(() => {
      checkForCameraRollPermission()
    }, []);

    const addImage = async () => {
      let _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
  
      console.log("THIS IS THE OBJECT: " + JSON.stringify(_image));
  
      if (!_image.cancelled) {
        setProfileImage(_image.uri);
      }
    };
  
    const  checkForCameraRollPermission=async()=>{
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert("Please grant camera roll permissions inside your system's settings");
      }else{
        console.log('Media Permissions are granted')
      }
    
  }

  return (
    <View style={styles.container}>
        <View style={imageUploaderStyles.container}>
          {
              profileImage  && <Image source={{ uri: profileImage }} style={{ width: 200, height: 200 }} />
          }
              
              <View style={imageUploaderStyles.uploadBtnContainer}>
                  <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                      <Text>{profileImage ? 'Edit' : 'Upload'} Image</Text>
                      <Icon 
                        name="camera-alt" 
                        size={20} 
                        type="material-icons"
                        color="black" 
                      />
                  </TouchableOpacity>
              </View>
      </View>
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
            
            changeUser.displayName = description;
            changeUser.profileImage = profileImage;
            getDataModel().updateUserDisplayName(currentUser.key, changeUser);
            navigation.navigate("Home", { currentUser: currentUser });

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
          {currentUser.profileImage ?
            <Avatar
              rounded
              size={32}
              source={currentUser.profileImage}
            /> :
            <Icon
              size={32}
              name='person'
              type='material-icons'
              color={homevuColors.red}
            />
          }
        </TouchableOpacity>
      </View>
    </View>
    
  );
  
}

const imageUploaderStyles=StyleSheet.create({
  container:{
      elevation:2,
      height:200,
      width:200, 
      backgroundColor:'#efefef',
      borderRadius:999,
      position:'relative',
      overflow: 'hidden',
      margin: 20,
  },
  uploadBtnContainer:{
      opacity:0.7,
      position:'absolute',
      right:0,
      bottom:0,
      backgroundColor:'lightgrey',
      width:'100%',
      height:'25%',
  },
  uploadBtn:{
      display:'flex',
      alignItems:"center",
      justifyContent:'center'
  }
})

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