import React, {useState, useEffect} from 'react';
import { Input, Button, CheckBox } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

function DetailsScreen({navigation, route}) {

  let item = route.params ? route.params.item : null;
  let editMode = (item != null);
  const [title, setTitle] = useState(item? item.title : '');
  const [description, setDescription] = useState(item? item.description : '');
  const [isChecked, setIsChecked] = useState(true);
  const [price, setPrice] = useState(item? item.price : '');
  const [image, setImage] = useState(item? item.image: null);
  
  const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)

  const dataModel = getDataModel();

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
      setImage(_image.uri);
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
      <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Title:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item title..."
          onChangeText={(text)=>setTitle(text)}
          value={title}
        />
      </View>  
      <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Description:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item description..."
          onChangeText={(text)=>setDescription(text)}
          value={description}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Price:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item price..."
          onChangeText={(text)=>setPrice(text)}
          value={price}
        />
      </View>
      {/* <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Image URL:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item image URL..."
          onChangeText={(text)=>setImage(text)}
          value={image}
        />
      </View> */}
      {/* <View>
        <UploadImage/>
        <Text style={{marginVertical:20,fontSize:16}}>Upload product image</Text>
      </View>     */}
  
        <View style={imageUploaderStyles.container}>
          {
              image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          }
              
              <View style={imageUploaderStyles.uploadBtnContainer}>
                  <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                      <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                      <AntDesign title="camera" size={20} color="black" />
                  </TouchableOpacity>
              </View>
      </View>

      <View>      
        <CheckBox
          title= "Available"
          checked = {isChecked}
          onPress={ () => {
            setIsChecked(!isChecked);
          }}      
        />
      </View>  

      <View style={styles.buttonArea}>
        <Button
          containerStyle={styles.button}
          title="Cancel"
          onPress={()=>{
            navigation.navigate("Home");
          }}
        />
        <Button
          containerStyle={styles.button}
          title={editMode ? "Save" : "Add Item"}
          onPress={()=>{
            if (editMode) {
              item.user_id = currentUser.key
              item.sellerName = currentUser.displayName
              console.log(item.user_id + " : " + item.sellerName)
              item.title = title;
              item.availability = isChecked;
              item.description = description;
              item.price = price;
              item.image = image;
              dataModel.updateItem(item.key, item);
              console.log('new data model: ', dataModel.getProductList());
            } else {
              // update data model
              dataModel.addItem({ user_id: currentUser.key, sellerName: currentUser.displayName, title: title, description: description, price: price, image: image, isChecked: isChecked}); // let the data model add the key
              //console.log('new data model: ', dataModel.getProdcutList());
            }
            navigation.navigate("Home");
          }}
        />
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
      position:'relative',
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
    padding: 30
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
  buttonArea: {
    flex: 0.3,
    flexDirection: 'row',
    paddingTop: 30,
    justifyContent: 'space-between',
    //alignItems: 'center',
    width: '70%',
    //backgroundColor: 'tan'
  },
  button: {
    width: '45%'
  }
});


export default DetailsScreen;