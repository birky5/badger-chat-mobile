// Keep this here!
import 'react-native-gesture-handler';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import BadgerLoginScreen from './components/BadgerLoginScreen';
import BadgerLogoutScreen from './components/BadgerLogoutScreen';

import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import BadgerLandingScreen from './components/BadgerLandingScreen';
import BadgerChatroomScreen from './components/BadgerChatroomScreen';
import BadgerRegisterScreen from './components/BadgerRegisterScreen';
import { Alert } from 'react-native';
import BadgerConversionScreen from './components/BadgerConversionScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    fetch('https://cs571.org/s23/hw10/api/chatroom', {
      headers: {
        "X-CS571-ID": "bid_1c5bcd34828a97342b93",
      }
    }).then(res => res.json()).then(json => {
      setChatrooms(json)
      //console.log(json)
    })
    // hmm... maybe I should load the chatroom names here
  }, []);

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      alert('No values stored under that key.');
    }
  }

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
  }

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!

    fetch('https://cs571.org/s23/hw10/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID": "bid_1c5bcd34828a97342b93"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(res => {
      return res.json();
    }).then(data => {
      //save("jwt", data.token);
      //setIsLoggedIn(true);
      //console.log(data);
      if (data.msg === "That user does not exist!" || data.msg === "Incorrect password.") {
        Alert.alert("Incorrect Login", "Please try logging in again!");
      } else if (data.msg === "Successfully authenticated.") {
        save("jwt", data.token);
        setIsLoggedIn(true);
      }
    });
  }

  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    // console.log(username + " " + password);

    fetch('https://cs571.org/s23/hw10/api/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID": "bid_1c5bcd34828a97342b93"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(res => {
      return res.json();
    }).then(data => {
      //console.log(data);
      if (data.msg === "The user already exists!") {
        Alert.alert("Username already taken!")
      } else {
        save("jwt", data.token);
        setIsRegistering(false);
        setIsLoggedIn(true);
      }
      // getValueFor("jwt");
    });
  }

  function logout() {
    deleteKey("jwt");
    setIsLoggedIn(false);
    //getValueFor("jwt");
  }

  function convertUser() {
    setIsGuest(false);
    setIsRegistering(true);
  }

  if (isLoggedIn || isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom}/>}
              </ChatDrawer.Screen>
            })
          }
          {
            isGuest ?
              <ChatDrawer.Screen name="Signup" options={{drawerItemStyle: {
                backgroundColor: 'crimson'
              }}}>
                {(props) => <BadgerConversionScreen conversion={convertUser}></BadgerConversionScreen>}
              </ChatDrawer.Screen> :
              <ChatDrawer.Screen name="Logout" options={{drawerItemStyle: {
                backgroundColor: 'crimson'
              }}}>
                {(props) => <BadgerLogoutScreen logout={logout}></BadgerLogoutScreen>}
              </ChatDrawer.Screen>
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>
  }
}


