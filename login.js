import React, { useEffect, useState } from 'react';
import { Button, CheckBox } from 'react-native-elements';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import {
  getAuth, updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { color } from 'react-native-elements/dist/helpers';

function Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dataModel = getDataModel();

  const [displayName, setDisplayName] = useState('')
  const [mode, setMode] = useState('login');

  const [users, setUsers] = useState([]);


  const auth = getAuth();



  useEffect(() => {
    const dataModel = getDataModel();
    const listenerId = dataModel.addUserListener(() => {
      let newUsers = Array.from(dataModel.getUsers());
      setUsers(newUsers);
    });
    return (() => {
      dataModel.removeUserListener(listenerId);
    });
  }, []);


  return (
    <View style={loginStyles.body}>
      <View style={loginStyles.loginContainer}>
        <View style={loginStyles.loginRow}>
          <View style={loginStyles.loginLabelContainer}>
            <Text style={loginStyles.loginLabelText}>Email: </Text>
          </View>
          <View style={loginStyles.loginInputContainer}>
            <TextInput
              style={loginStyles.loginInputBox}
              placeholder='enter email address'
              autoCapitalize='none'
              spellCheck={false}
              value={email}
              onChangeText={(text) => { setEmail(text) }}
            />
          </View>
        </View>

        <View style={loginStyles.loginRow}>
          <View style={loginStyles.loginLabelContainer}>
            <Text style={loginStyles.loginLabelText}>Password: </Text>
          </View>
          <View style={loginStyles.loginInputContainer}>
            <TextInput
              style={loginStyles.loginInputBox}
              placeholder='enter password'
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => { setPassword(text) }}
            />
          </View>
        </View>
        {mode === 'signup' ?
          <View style={loginStyles.loginRow}>
            <View style={loginStyles.loginLabelContainer}>
              <Text style={loginStyles.loginLabelText}>Display Name: </Text>
            </View>
            <View style={loginStyles.loginInputContainer}>
              <TextInput
                style={loginStyles.loginInputBox}
                placeholder='enter display name'
                autoCapitalize='none'
                spellCheck={false}
                value={displayName}
                onChangeText={(text) => { setDisplayName(text) }}
              />
            </View>
          </View>
          :
          <View></View>
        }
        <View style={loginStyles.modeSwitchContainer}>
          {mode === 'login' ?
            <Text style={{color: homevuColors.red}} >New user?
              
              <Text
                onPress={() => { setMode('signup') }}
                style={{ color: homevuColors.blue }}> Sign up </Text>
              instead!</Text>
            :
            <Text style={{color: homevuColors.red}}>Existing user?
              <Text
                onPress={() => { setMode('login') }}
                style={{ color: homevuColors.blue }}> Log In </Text>
              instead!</Text>
          }
        </View>


        <View style={loginStyles.loginButtonRow}>
          <Button
            title={mode === 'login' ? 'Log in' : 'Sign up'}
            color={homevuColors.redShade}
            onPress={async () => {
              if (mode === 'login') {
                try {
                  const credential =
                    await signInWithEmailAndPassword(auth, email, password);
                  const authUser = credential.user;
                  const user = await dataModel.getUserForAuthUser(authUser);
                  navigation.navigate('Home', { currentUser: user })
                  console.log('passing user from login.js ' + user)

                } catch (error) {
                  Alert.alert(
                    "Login Error",
                    error.message,
                    [{ text: "OK" }]
                  );
                }
                setEmail('');
                setPassword('');
              } else {
                try {
                  const credential =
                    await createUserWithEmailAndPassword(auth, email, password);
                  const authUser = credential.user;
                  await updateProfile(authUser, { displayName: displayName });
                  const user = await dataModel.getUserForAuthUser(authUser);
                  navigation.navigate('Home', { currentUser: user })
                  console.log('passing user from login.js ' + user)
                } catch (error) {
                  Alert.alert(
                    "Sign Up Error",
                    error.message,
                    [{ text: "OK" }]
                  );
                }
                setEmail('');
                setPassword('');
              }
            }}
          />
        </View>
      </View>

    </View>
  );
}

const loginStyles = StyleSheet.create({

  body: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '2%'
  },
  pageTitle: {
    justifySelf: 'center',
    fontWeight: '500',
    fontSize: 24,
    color: 'red',
  },
  loginContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '75%',
  },
  loginRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  loginLabelContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  loginLabelText: {
    color: homevuColors.red,
    fontWeight: 'bold',
    fontSize: 18
  },
  loginInputContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  },
  loginInputBox: {
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: '2%'
  },
  modeSwitchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  loginButtonRow: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default Login;