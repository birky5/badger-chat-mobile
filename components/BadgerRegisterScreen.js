import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

function BadgerRegisterScreen(props) {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRepeatPassword, setNewRepeatPassword] = useState("");
    const [warningMessage, setWarningMessage] = useState("");

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        
        <Text style={{marginTop: 10}}>Username</Text>
        <TextInput style={styles.input} onChangeText={setNewUsername} value={newUsername}></TextInput>
        <Text>Password</Text>
        <TextInput style={styles.input} onChangeText={setNewPassword} value={newPassword} secureTextEntry={true}></TextInput>
        <Text>Confirm Password</Text>
        <TextInput style={styles.input} onChangeText={setNewRepeatPassword} value={newRepeatPassword} secureTextEntry={true}></TextInput>

        <Text style={{marginBottom: 10, marginTop: 10, color: 'crimson'}}>{warningMessage}</Text>

        <Button color="crimson" title="Signup" onPress={() => {
            if (newUsername === "") {
                setWarningMessage("Please enter a username.")
            } else if (newPassword === "") {
                setWarningMessage("Please enter a password.");
            } else if (newPassword !== newRepeatPassword) {
                setWarningMessage("Passwords do not match.");
            } else {
                setWarningMessage("");
                props.handleSignup(newUsername, newPassword);
            }
        }} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;