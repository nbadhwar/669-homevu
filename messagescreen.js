import React, {useEffect, useState} from 'react';
import { Button, CheckBox } from 'react-native-elements';
import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import { FlatList, StyleSheet, Text, View } from 'react-native';


function MessageScreen({navigation}) {

  return (
 
    <View style={styles.container}>
        <Button
            title="Home"
            onPress={()=>{
            navigation.navigate("Home");
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

export default MessageScreen;