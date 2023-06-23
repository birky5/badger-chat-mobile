import { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import BadgerCard from "./BadgerCard";
import BadgerChatMessage from "./BadgerChatMessage";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Button } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Modal } from "react-native-paper";

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [isUser, setIsUser] = useState(false);

    const loadMessages = () => {
        fetch(`https://cs571.org/s23/hw10/api/chatroom/${props.name}/messages`, {
            headers: {
                "X-CS571-ID": "bid_1c5bcd34828a97342b93"
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    useEffect(() => {
        loadMessages()
    }, [props]);

    useEffect(() => {
        getValueFor().then(result => { setIsUser(result); });
    }, []);

    const createPost = () => {
        SecureStore.getItemAsync("jwt").then(result => {
            if (result) {
                fetch(`https://cs571.org/s23/hw10/api/chatroom/${props.name}/messages`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Authorization": "Bearer " + result, 
                        "Content-Type": "application/json",
                        "X-CS571-ID": "bid_1c5bcd34828a97342b93"
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                }).then(res => res.json())
                .then(json => {
                    // console.log(json);
                    if (json.msg === "Successfully posted message!") {
                        setModalVisible(false);
                        Alert.alert("Successfully Posted!", "Successfully posted your new message.");
                        setTitle("");
                        setContent("");
                        loadMessages();
                    }
                })
            }
        })
    }

    async function getValueFor() {
        let result = await SecureStore.getItemAsync("jwt");
        if (result) {
          return true;
        } else {
          return false;
        }
      }

    return <View style={{ flex: 1, marginBottom: 30 }}>
        <ScrollView>
            {
                messages.map(message => {
                    return <BadgerChatMessage key={message.id} title={message.title} poster={message.poster} created={message.created} content={message.content}></BadgerChatMessage>
                })
            }
        </ScrollView>

        {
            isUser ? (<><View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Button title="Add Post" onPress={() => setModalVisible(true)}></Button>
                <Button title="Refresh Messages" onPress={loadMessages}></Button>
            </View></>) :
                (<><View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Button title="Refresh Messages" onPress={loadMessages}></Button>
                </View></>)
        }

        <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide" transparent={true}>
            <ScrollView keyboardShouldPersistTaps='never' style={styles.modalView}>
                <Text style={{fontSize: 30, margin:5}}>Create a Post</Text>
                    <Text style={{margin:5, fontSize: 16}}>Title of Post</Text>
                    <TextInput style={styles.inputForTitle} onChangeText={setTitle} value={title}></TextInput>
                        <Text style={{margin:5, fontSize:16}}>Body of Post</Text>
                        <TextInput style={styles.inputForContent} multiline numberOfLines={5} onChangeText={setContent} value={content}></TextInput>
                <View style={{flexDirection:'row', justifyContent: 'center'}}>
                <Button title="Create Post" onPress={createPost}></Button>
                <Button title="Cancel" onPress={() => {
                    setModalVisible(false)
                    setTitle("")
                    setContent("")
                    }}></Button>
                </View>
            </ScrollView>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      inputForTitle: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
      inputForContent: {
        height: 200,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
});

export default BadgerChatroomScreen;