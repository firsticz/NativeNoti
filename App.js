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
import auth from '@react-native-firebase/auth';
import { AuthProvider } from './src/context/firebaseContext'

import PushNotification from 'react-native-push-notification';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntIcons from 'react-native-vector-icons/AntDesign'
import Login from './src/screens/login'
import Home from './src/screens/home'
import NotificationList from './src/screens/notificationList'
import Setting from './src/screens/setting'
let notif
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()


const App = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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
          !user ? (
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
        <Tab.Screen 
          name="home" 
          component={Home} 
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" />
            ),
          }}
        />
        <Tab.Screen
          name="notification" 
          component={NotificationList}
          options={{
            tabBarLabel: 'Notification',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="notifications-active" />
            ),
          }}
         />
        <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarLabel: 'setting',
          tabBarIcon: ({ color, size }) => (
            <AntIcons name="setting" />
          ),
        }}
        />
      </Tab.Navigator>
    );
  }

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  

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
      notif = new NotifService(fcmToken);
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
  }

  useEffect(() => {
    registerAppWithFCM()
    requestPermission()

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      Alert.alert(
        'Notification caused app to open from background state:',
        JSON.stringify(remoteMessage),
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          Alert.alert(
            'Notification caused app to open from quit state:',
            JSON.stringify(remoteMessage),
          );
        }
      });
    

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      const Message =  JSON.parse(JSON.stringify(remoteMessage));
      notif.localNotif(Message.notification.title, Message.notification.body )

      // PushNotification.localNotification({
      //   title: Message.notification.title,
      //   message:  Message.notification.body,
      // });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  

  if (initializing) return null
  
  // if (loading) {
  //   return null;
  // }


  
  


  return (
    <AuthProvider>
      <NavigationContainer>
        {user? <MyTabs /> : <MyStack />}
      </NavigationContainer>
    </AuthProvider>
    
  );
}

export default App;
