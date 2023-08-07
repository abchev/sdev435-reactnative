import { StyleSheet } from 'react-native';

const appStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    home: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
      },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      marginBottom: 5,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "blue"
    },
    textInput: {
        margin: 10,
        backgroundColor: "#fff"
    },
  });

export default appStyles;