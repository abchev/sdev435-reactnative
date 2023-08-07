import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import LoginModal from './LoginModal';
import appStyles from './Styles';
import { AppBar, Button, HStack, Switch, Text } from '@react-native-material/core'
import { Picker } from '@react-native-picker/picker';

const getMoviesFromApi = () => {
  return fetch('https://reactnative.dev/movies.json')
    .then(response => response.json())
    .then(json => {
      return json.movies;
    })
    .catch(error => {
      console.error(error);
    });
};

const getMoviesFromApiAsync = async () => {
  try {
    const response = await fetch(
      'https://reactnative.dev/movies.json',
    );
    const json = await response.json();
    return json.movies;
  } catch (error) {
    console.error(error);
  }
};


export default function App() {
  const defaultVehicleId = "1234567890"
  // Change the below line to enable/disable modal on launch
  const [modalVisible, setModalVisible] = useState(true)
  const [modalStatus, setModalStatus] = useState("")
  const [selectedEndpoint, setSelectedEndpoint] = useState("/user_self")
  const [selectedVehicleId, setSelectedVehicleId] = useState(defaultVehicleId)
  const [changeVehicleId, setChangeVehicleId] = useState(false)
  const [selectedDataView, setSelectedDataView] = useState("current")
  const [selectedEntryCount, setSelectedEntryCount] = useState("3")
  const endpoints = [
    {
      name: "Vehicle Health",
      description: "Get the health of your vehicle",
      endpoint: "/vehicle_health",
      parameters: [
        "vehicle_id"
      ]
    },
    {
      name: "Vehicle Location",
      description: "Get the location of your vehicle",
      endpoint: "/vehicle_location",
      parameters: [
        "vehicle_id"
      ]
    },
    {
      name: "User Self",
      description: "Get the user's information",
      endpoint: "/user_self",
      parameters: []
    }
  ]
  const vehiclesIds = [
    "1234567890",
    "0987654321"
  ]
  return (
    // <AppBar title="HARMAN Spark" />
    <View style={appStyles.home}>
    {/* <View> */}
      <LoginModal 
        header="Enter your HARMAN Spark credentials" 
        visible={modalVisible} 
        // Accept "a" as the valid password for testing purposes
        onLogin={(username, password) => password === "a" ? setModalVisible(false) : setModalStatus("Invalid username or password")} 
        status={modalStatus}
      />
      <Text>Select Endpoint:</Text>
      <Picker
        selectedValue={selectedEndpoint}
        onValueChange={(itemValue, itemIndex) => setSelectedEndpoint(itemValue)}
      >
        {endpoints.map((endpoint, index) => {
          return (
            <Picker.Item label={endpoint.name} value={endpoint.endpoint} key={index} />
          )
        })}
      </Picker>
      <Text style={{ color: "#009fdb"}}>Endpoint Description: {endpoints.find(e => e.endpoint == selectedEndpoint).description}</Text>
      {endpoints.find(e => e.endpoint == selectedEndpoint).parameters.includes("vehicle_id") &&
      <View>
        <Text>Default Vehicle ID: {selectedVehicleId}</Text>
        <HStack>
          <Text>Change default Vehicle ID?</Text>
          <Switch value={changeVehicleId} onValueChange={() => setChangeVehicleId(!changeVehicleId)} />
        </HStack>
      </View>
      }
      {changeVehicleId &&
        <View>
          <Text>Select Vehicle ID:</Text>
          <Picker 
            selectedValue={selectedVehicleId}
            onValueChange={(itemValue, itemIndex) => setSelectedVehicleId(itemValue)}
          >
            {vehiclesIds.map((vehicleId, index) => {
              return (
                <Picker.Item label={vehicleId} value={vehicleId} key={index} />
              )
            })}
          </Picker>
        </View>
      }
      {/* <Button title="Show Modal" onPress={() => setModalVisible(true)}/> */}
      <Text>Data Options:</Text>
      <Picker 
        selectedValue={selectedDataView} 
        onValueChange={(itemValue, itemIndex) => setSelectedDataView(itemValue)}
      >
        <Picker.Item label="Current Data" value="current" />
        <Picker.Item label="Historical Data" value="historical" />
        <Picker.Item label="Current and Historical Data" value="current_historical"/>
      </Picker>
      {selectedDataView.includes("historical") &&
        <View>
          <Text>Number of entries to return:</Text>
          <TextInput 
            onChangeText={e => setSelectedEntryCount(e)}
            defaultValue='3'
            autoCorrect={false}
            enterKeyHint="send"
            inputMode="numeric"
            backgroundColor={"#fff"}
            // style={{ margin: 10 }}
          />
        </View>
      }
      {/* Use long press to call API, for testing purpooses */}
      <Button title="Submit Query" onPress={() => {}} onLongPress={() => {getMoviesFromApiAsync().then(movies => console.log(movies))}}/>
      <StatusBar style="auto" />
    </View>
  );
}