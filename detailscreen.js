import React, {useState} from 'react';
import { Button, CheckBox } from 'react-native-elements';
import { FlatList, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';



function DetailsScreen({navigation, route}) {

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
    paddingTop: '15%'
  },

});


export default DetailsScreen;