import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailScreen';
import Login from './Login';
import MessageScreen from './MessageScreen';
import ArScreen from './ARScreen';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Home"  component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Messages" component={MessageScreen} />
        <Stack.Screen name="ARView" component={ArScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
