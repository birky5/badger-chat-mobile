import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import BadgerLandingScreen from "./BadgerLandingScreen";
import * as SecureStore from 'expo-secure-store';

function BadgerLoginScreen(props) {
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    async function deleteKey() {
        await SecureStore.deleteItemAsync("jwt");
    }

    useEffect(() => {
        deleteKey();
    }, [])

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text style={{marginTop: 10}}>Username</Text>
        <TextInput style={styles.input} onChangeText={setUserName} value={userName}></TextInput>
        <Text>Password</Text>
        <TextInput style={styles.input} onChangeText={setUserPassword} value={userPassword} secureTextEntry={true}></TextInput>

        <Button color="crimson" title="Login" onPress={() => {
            if (userName === "") {
                Alert.alert("Incomplete Information", "Please enter a username to login.");
            } else if (userPassword === "") {
                Alert.alert("Incomplete Information", "Please enter a password to login.");
            } else {
                props.handleLogin(userName, userPassword)
            }
        }} />

        <Text style={{marginTop: 20}}>New here?</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="Continue As Guest" onPress={() => props.setIsGuest(true)}/>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
});

export default BadgerLoginScreen;