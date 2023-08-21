import { Modal, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@react-native-material/core'
import appStyles from './Styles'

export default function LoginModal(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const passwordInputRef = useRef()
    useEffect(() => {
      // This will run after the component is mounted, setting the ref
      passwordInputRef.current = true;
    }, []);
    return (
      <Modal visible={props.visible} animationType="fade" transparent={true}>
        <View style={ appStyles.container }>
          {/* <Text style={{ fontSize: 20, fontWeight: "bold", color: "blue"}}>{props.header || "Please login"}</Text> */}
          <Text style={ appStyles.header }>{props.header || "Please login"}</Text>
          <TextInput 
              onChangeText={e => setUsername(e)}
              // TODO: Figure out how to set focus to passwordInputRef, getting "Cannot read property focus of null/undefined"
              // onSubmitEditing={passwordInputRef.current.focus()}
              placeholder="Username"
              value={username}
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="username"
              enterKeyHint="next"
              // placeholderTextColor={"#ff00ff"}
              backgroundColor={"#fff"}
              style={{ margin: 10 }}
          />
          <TextInput 
              ref={passwordInputRef}
              onChangeText={e => setPassword(e)}
              placeholder="Password"
              value={password}
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="current-password"
              secureTextEntry={true}
              enterKeyHint="done"
              backgroundColor={"#fff"}
              style={{ margin: 10 }}
          />
          {/* TODO: Replace with Snackbar */}
          <Text style={{ color: "red" }}>{props.status || ""}</Text>
          <Button title="Login" onPress={() => props.onLogin(username, password)} />
        </View>
      </Modal>
    );
}
