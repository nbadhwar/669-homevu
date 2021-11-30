import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getDataModel } from './DataModel';

export default function App() {
// const dataModel = getDataModel();
// dataModel.addItem({object: 'test1'})
// dataModel.addItem({object: 'test2'})
// dataModel.addItem({object: 'test3'})

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
