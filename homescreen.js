import React, {useEffect, useState} from 'react';
import { Button, CheckBox } from 'react-native-elements';
import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import { FlatList, StyleSheet, Text, View } from 'react-native';


function HomeScreen({navigation}) {



  return (
 
    <View style={styles.container}>
        <Button
            title="Details"
            onPress={()=>{
            navigation.navigate("Details");
            }}
        />
        <Button
            title="Login"
            onPress={()=>{
            navigation.navigate("Login");
            }}
        />
        <Button
            title="Messages"
            onPress={()=>{
            navigation.navigate("Messages");
            }}
        />
        <Button
            title="ARView"
            onPress={()=>{
            navigation.navigate("ARView");
            }}
        />
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
  
});

export default HomeScreen;