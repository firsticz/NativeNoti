/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  
} from 'react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
//import firebase from 'react-native-firebase'
import messaging from '@react-native-firebase/messaging';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import NotifService from './NotifService';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Login from './src/screens/login'
// const notif = new NotifService();
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const user = null

function MyStack(){
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4db6ac'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      {
        user === null ? (
          <Stack.Screen 
            name="login"
            component={Login}
            options={{ title: 'Sign in', headerBackAccessibilityLabel: null}}
            
          />
        ) : (
          <Stack.Screen 
            name="home"
            component={Home}
            options={{ title: 'Home'}}
            
          />
        )
      }
      
      

    </Stack.Navigator>
  )
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Login} />
      <Tab.Screen name="Settings" component={Login} />
    </Tab.Navigator>
  );
}





const App = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const  checkPermission = async() => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
        getToken();
    } else {
        requestPermission();
    }
  }
  
    //3
  const  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log(fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    //2
  // const requestPermission = async () => {
  //   try {
  //       await messaging().requestPermission();
  //       // User has authorised
  //       getToken();
  //   } catch (error) {
  //       // User has rejected permissions
  //       console.log('permission rejected');
  //   }
  // }

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  async function requestPermission() {
    console.log('req per');
    const granted = await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: true,
      provisional: false,
      sound: true,
    });
    if (granted) {
      console.log('start granted');
      const fcmToken = await messaging().getToken();
      console.log('end granted');
      console.log(fcmToken);
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
  }

  useEffect(() => {
    registerAppWithFCM()
    requestPermission()

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  
  // if (loading) {
  //   return null;
  // }


  
  


  return (
    <NavigationContainer>
      {!user? <MyTabs /> : <MyStack />}
    </NavigationContainer>
  );
}

export default App;
