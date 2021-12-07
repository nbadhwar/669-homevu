import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './homescreen';
import DetailsScreen from './detailscreen';
import Login from './login';
import MessageScreen from './messagescreen';
import ArScreen from './arscreen';
import { ChatScreen } from './chatscreen';


const Stack = createNativeStackNavigator();

function App() {
  // const dataModel = getDataModel();
  // dataModel.addItem({object: 'test1'})
  // dataModel.addItem({object: 'test2'})
  // dataModel.addItem({object: 'test3'})

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Home"  component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Messages" component={MessageScreen} />
        <Stack.Screen name="ARView" component={ArScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
