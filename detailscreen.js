import React, {useState} from 'react';
import { Input, Button, CheckBox } from 'react-native-elements';
import { FlatList, StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';
import { getDataModel } from './DataModel';


function DetailsScreen({navigation, route}) {

  let item = route.params ? route.params.item : null;
  let editMode = (item != null);
  const [name, setName] = useState(item? item.name : '');
  const [description, setDescription] = useState(item? item.description : '');
  const [isChecked, setIsChecked] = useState(item ? item.available: false);
  const [price, setPrice] = useState(item? item.price : '');
  const [image, setImage] = useState(item? item.image : "https://m.media-amazon.com/images/I/51JyYu2pa6L._AC_SL1000_.jpg");
  
  const dataModel = getDataModel();

  return (
    <View style={styles.container}>
      <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Title:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item title..."
          onChangeText={(text)=>setName(text)}
          value={name}
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
      <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Image URL:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="Item image URL..."
          onChangeText={(text)=>setImage(text)}
          value={image}
        />
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
              item.name = name;
              item.isChecked = isChecked;
              item.description = description;
              item.price = price;
              item.image = image;
              dataModel.updateItem(item.key, item);
              console.log('new data model: ', dataModel.getProductList());
            } else {
              // update data model
              dataModel.addItem({name: name, description: description, price: price, image: image, isChecked: isChecked}); // let the data model add the key
              //console.log('new data model: ', dataModel.getProdcutList());
            }
            navigation.navigate("Home");
          }}
        />
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
    padding: 30
  },
  inputArea: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  inputLabel: {
    flex: 0.2,
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 10,
    paddingBottom: 10
  },
  inputBox: {
    flex: 0.8,
  },
  buttonArea: {
    flex: 0.1,
    flexDirection: 'row',
    paddingTop: 30,
    justifyContent: 'space-between',
    //alignItems: 'center',
    width: '70%',
    //backgroundColor: 'tan'
  },
  button: {
    width: '40%'
  }
});


export default DetailsScreen;