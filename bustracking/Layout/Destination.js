import * as React from 'react';
import * as t from  "../helper/addressAutocomplete";
import { WebView } from 'react-native-webview';
import * as p from "../helper/MapViewClass";
import WebViewMap from '../components/WebViewMap';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  TouchableOpacity,
  Icon,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
// import MapView from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import BottomDrawer from 'react-native-bottom-drawer-view';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
//import image from '../assets/bus-move.gif';
import image from '../assets/bus.jpg';
import Footer from '../components/Footer';
import CustomListItem from '../components/CustomListItem';
import { MapControlPanel } from '../helper/MapViewClass';

const Stack = createNativeStackNavigator();

const x = new t.default()

const html=`<!DOCTYPE html>
<html>
<head>
    <title>Leaflet Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    <script src="https://cdn.jsdelivr.net/npm/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
</head>
<body>
    <div id="map" style="height: 90vh;">
    </div>

    <script>
        var map = L.map('map').setView([10.8231, 106.6297], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);
        var routingControl;
        var marker;
        document.getElementById('search-button').addEventListener('click', function() {
            var address = document.getElementById('search-input').value;
            if (address != '') {
                fetch('https://nominatim.openstreetmap.org/search.php?q=' + address + '&format=json')
                .then(response => response.json())
                .then(data => {
                    var lat = parseFloat(data[0].lat);
                    var lon = parseFloat(data[0].lon);
                    var coordinates = [lat, lon];
                    if (marker) {
                        marker.setLatLng(coordinates);
                    } else {
                        marker = L.marker(coordinates).addTo(map)}})}});
    document.getElementById('routing-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var destination = document.getElementById('destination-input').value;
      if (destination != '') {
        fetch('https://nominatim.openstreetmap.org/search.php?q=' + destination + '&format=json')
        .then(response => response.json())
        .then(data => {
          var lat = parseFloat(data[0].lat);
          var lon = parseFloat(data[0].lon);
          var coordinates = [lat, lon];
          if (routingControl) {
            routingControl.setWaypoints([marker.getLatLng(), coordinates]);
          } else {
            routingControl = L.Routing.control({
              waypoints: [marker.getLatLng(), coordinates],
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
              })
            }).addTo(map);
          }
        })
        .catch(error => console.error(error));
      }
    });
    </script>
</body>
</html>`;


export default function Destination({ navigation }) {
  const [queryData, setqueryData] = React.useState({
    departure: '',
    destination: '',
    start_point: null,
    end_point: null,
  });
  const [locResults, setLocResults] = React.useState([]);
  const [isBottomNavShowing, setIsBottomNavShowing] = React.useState(false);
  const [bottomNavProps, setBottomNavProps] = React.useState({
    color: 'orange',
    placeholder: 'placeholder',
    type: 'departure',
  });
  const A= new t.default();
  React.useEffect(() => {
    console.log(queryData);
    console.log('Location List:', locResults);
    console.log('Bottom Props', bottomNavProps);
  }, [queryData, locResults, bottomNavProps]);

  const liveSearch = (value, type) => {
    if (type === 'departure') {
      setqueryData({ ...queryData, departure: value.nativeEvent.text });
    } else {
      setqueryData({
        ...queryData,
        destination: value.nativeEvent.text,
      });
    }
    // let res = places.filter((place) =>
    //   place.key.toLowerCase().includes((value.nativeEvent.text).toLowerCase())
    // );

    // setLocResults(res);
    A.Run((listLocation)=>{
      setLocResults(listLocation);
    },value.nativeEvent.text)
  };

  const renderContent = ({ bottomNavProps }) => {
    console.log('departure')
    return (
      <View style={{ padding: 0 }}>
        <View
          style={{
            height: 60,
            backgroundColor: bottomNavProps.color,
            padding: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          {/* <TextInput
            style={{
              borderRadius: 10,
              height: 40,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
            placeholder={bottomNavProps.placeholder}
            keyboardType="text"
            clearButtonMode={true}
            contextMenuHidden
            onChange={(value) => {console.log('onchange') ;liveSearch(value, bottomNavProps.type)}}
            value={
              bottomNavProps.type === 'destination'
                ? queryData.destination
                : queryData.departure
            }
          /> */}
        </View>

        <FlatList
          data={locResults}
          renderItem={({ item }) => (
            <CustomListItem
              item={item}
              setIsBottomNavShowing={setIsBottomNavShowing}
              queryData = {queryData}
              setqueryData = {setqueryData}
              type = {bottomNavProps.type}
            />
          )}
        />
      </View>
    );
  };
  const [rerender, setRerender] = React.useState(false);
  var [mapping, setMapping]=React.useState(new p.MapControlPanel((listSchedule)=>{console.log('listSchedule: ',listSchedule);
setMapping(mapping);},null,null,"general"));
  var props=mapping.getProps();

  const setUpDesination = () => {
    setIsBottomNavShowing(true);
    setBottomNavProps({
      color: '#1c458a',
      placeholder: 'Đến',
      type: 'destination',
    });
  };

  

  const setUpDeparture = () => {
    setIsBottomNavShowing(true);
    setBottomNavProps({
      color: '#8cd9e3',
      placeholder: 'Đi từ',
      type: 'departure',
    });
  };

  function Tour({Tour, idx, currentRoute}){
    console.log("In Tour, Schedule is", Tour);
    return (

    <View style={styles.tourcomponent}>
    <View style={styles.left}>
    <TouchableOpacity onPress={()=>{console.log('@@----------Tour----------@@'); mapping.SelectRoute(idx);setRerender(!rerender)}}>
      <View style={styles.inrow}>
        <View style={[styles.busstat, {backgroundColor: '#DF2E38'}]}>{
            <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>{Tour.BusStages[0].RouteId}</Text>}
        </View>
      </View>
      <View style={[styles.inrow, {marginLeft: 5}]}>
        <Ionicons
            
            name="walk"
            size={14}
            color= 'gray'
        />
        <Text style={{fontSize: 12}}>{
          Tour.SpecificDistances.reduce((total,dis,idx) => {
            if(idx%2==0)
              total+=dis;
            return total;
          },0).toFixed(2)} {"\t"} </Text>
        
        <Ionicons
            
            name="bus"
            size={14}
            color= 'gray'
        />
        <Text style={{fontSize: 12}}>{
          Tour.SpecificDistances.reduce((total,dis,idx) => {
            if(idx%2==1)
              total+=dis;
            return total;
          },0).toFixed(2)
        }</Text>
      </View>
      
      <View style={[styles.inrow, {marginLeft: 5}]}>
        <FontAwesome
          name="sign-in"
          size={14}
          color="#F28739"
        />
        <Text style={{ marginLeft: 5, fontSize: 10}}>Trạm
          <Text style={{ color: 'gray', fontWeight: 'bold' }}> {Tour.BusStages[0].listLocation[0].Name}</Text>.{currentRoute==idx && Tour.ToStationTimes ?"Xe tới trong ":''}
          {currentRoute==idx && Tour.ToStationTimes ? ((Tour.ToStationTimes*1).toFixed(2)): ''} {currentRoute==idx && Tour.ToStationTimes ?"phút":''}</Text>
      </View>
      </TouchableOpacity>
    </View>
    <View style={styles.right}>
      <View style={[styles.inrow, {marginTop: 7}]}>
        <Text style={{fontSize: 12, textAlign:'center', color: '#7A7EEF', fontWeight: 'bold',}}>{Tour.GeneralPredictTime.toFixed(2)} phút {"\t"} </Text>
      </View>
      <View style={[styles.inrow, {marginTop: 0, marginBottom:0}]}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() =>{mapping.EndSelect().then(()=>{
            navigation.navigate('Tickets', {
              mapControl: mapping,
              currentRoute: idx
            });
          })}
          }>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold'}}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  )
  }
  
  function ListTour({schedules, currentRoute}){
    return (
      <View style={styles.tourSection}>
        <Text style={{ textAlign: 'center', paddingBottom: 5, fontSize: 15, color: '#0C4B8E', borderBottomWidth: 1}}>Cách di chuyển phù hợp</Text>
        <ScrollView style={styles.tourSection}>
        {schedules.map((schedule,idx,)=>(
            <Tour Tour={schedule} key={idx} idx={idx} currentRoute={currentRoute}></Tour>
          ))}
        </ScrollView>
      </View>
    )
  }



  return (
    <View style={(styles.container)}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={{ fontSize: 24, color: 'white',marginTop:10}}>Tìm đường</Text>
        </View>
        <View style={styles.inputSection}>
          <FontAwesome
            style={styles.inputIcon}
            name="map-marker"
            size={20}
            color="red"
          />
          <TextInput
            style={styles.input}
            placeholder="Đi từ"
            keyboardType="default"
            clearButtonMode='while-editing'
            onFocus={setUpDeparture}
            onBlur={()=>{setIsBottomNavShowing(false)}}
            onChange={(value) =>
              {setUpDeparture();setqueryData({...queryData,destination: value.nativeEvent.text}); liveSearch(value ,bottomNavProps.type)}
            }
            value={queryData.departure}
          />
        </View>

        <View style={styles.inputSection}>
          <FontAwesome
            style={styles.inputIcon}
            name="map-marker"
            size={20}
            color="red"
          />
          <TextInput
            style={styles.input}
            clearButtonMode='always'
            placeholder="Đến"
            keyboardType="default"
            onFocus={setUpDesination}
            onChange={(value) =>
              {setUpDesination();setqueryData({...queryData,destination: value.nativeEvent.text}); liveSearch(value ,bottomNavProps.type)}
            }
            onBlur={()=>{setIsBottomNavShowing(false)}}
            value={queryData.destination}
          />
        </View >
        <View style={{position: 'relative', borderRadius:10,}}>
          <View style={{width:'100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,}}>
            <View style={{padding:5, paddingTop:0,height: 35, width: 70, borderBottomRightRadius: 10, borderBottomLeftRadius:10, backgroundColor: '#0093E9',}}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() =>
                  {console.log("searchmap");mapping.FindRoute(queryData.start_point, queryData.end_point);setRerender(!rerender)}
                }>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold'}}>Tìm</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.mapSection,{padding: 10}]}>
            <WebViewMap style={{borderRadius:10,}}
              props = {props}>
            </WebViewMap>
          </View>
        </View>
        <ListTour schedules={mapping.listSchedule} currentRoute={mapping.currentRoute}></ListTour>
      </View>

      <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View>

      {isBottomNavShowing ? (
        <BottomDrawer
          backgroundColor={'#f4f6f8'}
          containerHeight={550}
          offset={0}
          roundedEdges={true}
          shadow={true}
          onCollapsed={() => console.log('collapsed')}
          onExpanded={() => console.log('expanded')}>
          {renderContent({ bottomNavProps })}
        </BottomDrawer>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0093E9',
  },
  body: {
    height: '100%',
    backgroundColor: '#0093E9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  footer: {
    height: '7%',
  },
  input: {
    flex: 1,
    height: 30,
    backgroundColor: 'white',
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 0,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    height: 45,
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 30,
    borderRadius: 10,
  },
  mapSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 370,
    borderRadius: 10,
  },
  tourSection: {
    flexDirection: 'row',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 300,
    borderRadius: 10,
  },
  tourcomponent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 100,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  inrow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop:2,
    marginBottom:2,
  },

  left: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 40,
    width: '75%',
  },
  
  right: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 40,
    width: '25%',
  },
  busstat: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  inputIcon: {
    padding: 10,
    height: 40,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4B8E',
    height: 30,
    width: 60,
    borderRadius: 10,
  },
});
