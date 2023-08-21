import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { TextInput, View } from 'react-native';
import LoginModal from './LoginModal';
import appStyles from './Styles';
import { AppBar, Button, HStack, Switch, Text } from '@react-native-material/core'
import { Picker } from '@react-native-picker/picker';

// const serverUrl = "http://10.0.2.2:5000" // For Android emulator
const serverUrl = "http://192.168.1.166:5000" // Actual IP

// Row Component
const TableRow = ({ children }) => {
  return (
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'grey' }}>
      {children}
    </View>
  );
}

// Cell Component
const TableCell = ({ children }) => {
  return (
    <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderColor: 'grey' }}>
      <Text>{children}</Text>
    </View>
  );
}

// Query flask endpoints and return data as JSON
const queryServer = async (endpoint, authentication, parameters) => {
  console.log(`
  queryServer
  endpoint: ${endpoint}
  authentication: ${authentication}
  parameters: ${JSON.stringify(parameters)}`)
  headers = {
    'Content-Type': 'application/json',
  }
  if (authentication) {
    Object.assign(headers, { 'Authorization': authentication })
  }
  try {
    const response = await fetch(`${serverUrl}/${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: parameters ? JSON.stringify(parameters) : null
    })
    const json = await response.json()
    return json.data
  } catch (error) {
    console.error(error)
    return "Error"
  }
}

// Authenticate with HARMAN Spark server via flask
const auth = async (username, password) => {
  try {
    return fetch(`${serverUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password })
    })
  } catch (error) {
    console.error(error)
  }
}

// Get available endpoints from flask
const getEndpoints = async () => {
  try {
    const response = await fetch(
      `${serverUrl}/query/available_endpoints`,
    )
    const json = await response.json()
    return json.data
  } catch (error) {
    console.error(error)
    return "Error"
  }
}


// Main App
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const [modalStatus, setModalStatus] = useState("");
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("query/user_self");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [changeVehicleId, setChangeVehicleId] = useState(false);
  const [selectedDataView, setSelectedDataView] = useState("current");
  const [selectedEntryCount, setSelectedEntryCount] = useState("3");
  const [dataTable, setDataTable] = useState([]);

  async function endpoint_query() {
    console.log("Querying server...")
    try {
      const params = endpoints.find(e => e.endpoint == selectedEndpoint).parameters.includes("vehicleId") ? { "vehicleId": selectedVehicleId } : null
      console.log(params)
      // console.log(endpoints)
      // console.log(selectedEndpoint)
      const data = await queryServer(selectedEndpoint, authToken, params)
      setDataTable(data)
      console.log(data)
    } catch (err) {
      console.error(err)
      setError(err.message);
    }
  }

  async function fetchData() {
  try {
      const fetchedEndpoints = await getEndpoints();
      setEndpoints(fetchedEndpoints);
      setIsLoading(false);
  } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
  }
 }

   const fetchVehicleId = async (user) => {
    try {
      const data = await queryServer("db/default_vehicle_id", null, { username: user });
      setSelectedVehicleId(data.default_vehicle_id)
      console.log(`Default vehicle ID: ${JSON.stringify(data)}`)
    } catch (err) {
      console.error(err)
      setError(err.message);
    }
  }
  useEffect(() => {
    fetchData();
 }, []);

  async function attempt_login(user, pass) {
    auth(user, pass)
      .then(response => {
        if (response.status == 200) {
          return response.json()
        } else {
          setModalStatus("Invalid username or password")
          console.error("Invalid username or password")
        }
      }).then(json => {
          console.log(json);
          setUsername(user)
          setPassword(pass)
          fetchVehicleId(user)
          setAuthToken(json.data.access_token)
          setModalVisible(false)
      }).catch(error => {
        console.error(error)
      })
  }

  return (
    <View style={appStyles.home}>
    {isLoading && <Text>Loading...</Text>}
    {error && <Text>Error: {error.message}</Text>}
    {!isLoading && !error && (
      <>
        <LoginModal 
          header="Enter your HARMAN Spark credentials" 
          visible={modalVisible} 
          // Accept "a" as the valid password for testing purposes
          // onLogin={(username, password) => password === "a" ? setModalVisible(false) : setModalStatus("Invalid username or password")} 
          onLogin={(username, password) => attempt_login(username, password)}
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
        {endpoints.find(e => e.endpoint == selectedEndpoint).parameters.includes("vehicleId") &&
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
              prompt="Select Vehicle ID"
            >
              {/* TODO: Get vehicle IDs from server */}
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
          prompt="Select Data View"
        >
          <Picker.Item label="Current Data" value="current" />
          {/* TODO: Implement historical data */}
          {/* <Picker.Item label="Historical Data" value="historical" enabled="false"/> */}
          {/* <Picker.Item label="Current and Historical Data" value="current_historical" enabled="false"/> */}
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
        {/* TODO: Add API call */}
        <Button 
          title="Submit Query" 
          onPress={() => {endpoint_query()}} 
          onLongPress={() => {getEndpoints().then(data => console.log(data))}}
        />
        {dataTable && Object.keys(dataTable).length > 0 && (
          <>
            <TableRow>
              {Object.keys(dataTable).map((key, index) => (
                <TableCell key={index}>{key}</TableCell>
              ))}
            </TableRow>
            {Array.isArray(dataTable) ? (
              dataTable.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{JSON.stringify(cell)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {Object.values(dataTable).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{JSON.stringify(cell)}</TableCell>
                ))}
              </TableRow>
            )}
          </>
        )}
        <StatusBar style="auto" />
      </>)}
    </View>
  );
}