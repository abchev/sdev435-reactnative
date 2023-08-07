import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Button } from '@react-native-material/core'
import styles from './Styles'
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function LoginForm(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    return (
    <View>
        <TextInput 
            onChangeText={e => setUsername(e)}
            placeholder="Username"
            value={username}
            autoCorrect={false}
            enterKeyHint="next"
            placeholderTextColor={"#0000ff"}
            backgroundColor={"#fff"}
            style={{ margin: 10 }}
        />
        <TextInput 
            onChangeText={e => setPassword(e)}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            enterKeyHint="done"
            backgroundColor={"#fff"}
            style={{ margin: 10 }}
        />
        <Button title="Login" onPress={() => props.onLogin(username, password)} />
    </View>
    );
}
