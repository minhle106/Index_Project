import * as React from 'react';
import { WebView } from 'react-native-webview';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  TouchableOpacity,
  Icon,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Footer from '../components/Footer';
import WebViewMap from '../components/WebViewMap';
import * as p from "../helper/MapViewClass";

// const trips = [
//   {
//     departure: 'Accra',
//     destination: 'Kumasi',
//     departureTime: '9:00am',
//     estimatedArrivalTime: '1:00pm',
//     ticketPrice: 65,
//     busCompany: 'VIP',
//   },
//   {
//     departure: 'Accra',
//     destination: 'Tamale',
//     departureTime: '7:00am',
//     estimatedArrivalTime: '8:00pm',
//     ticketPrice: 100,
//     busCompany: 'VIP',
//     date: '',
//   },
//   {
//     departure: 'Kumasi',
//     destination: 'Accra',
//     departureTime: '1:00pm',
//     estimatedArrivalTime: '6:00pm',
//     ticketPrice: 65,
//     busCompany: 'VIP',
//     date: '',
//   },
// ];
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

export default function Tickets({ navigation, route }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // const { travelFrom, travelTo } = route.params;
  // const [location, setLocation] = React.useState(travelFrom);
  // const [destination, setDestination] = React.useState(travelTo);
  // const [dateQuery, setDateQuery] = React.useState('Thur 30 Dec 2021');
  // const [noPassengers, setNoPassengers] = React.useState(2);
  console.log("@@------------TICKETS------------",route.params.mapControl)
  const [mapping,setMapping]=React.useState(new p.MapControlPanel((listSchedule)=>{console.log('listSchedule: ',listSchedule);
  setMapping(mapping);},route.params.mapControl.listSchedule,route.params.currentRoute,"special"))

  React.useEffect(()=>{
    mapping.SelectRoute(mapping.currentRoute);
  },[])

  const props=mapping.getProps();

  function WalkTour({StartPoint,EndPoint,predictime,predictDistance}){
    return(
    <View style={styles.tourcomponent}>
    <View style={styles.left}>
      <View style={[styles.inrow, {marginLeft: 5}]}>
        <Text style={{fontSize:15,fontWeight: 'bold'}}>
          Đi bộ:
        </Text>
      </View>
      <View style={[styles.inrow, {marginLeft: 5}]}>
        <Text style={{fontSize:10,fontWeight: 'bold'}}>
          Bắt đầu{": "}
          <Text style={{fontSize:10}}>{StartPoint.Name}</Text>
        </Text>
      </View>
      <View style={[styles.inrow, {marginLeft: 5}]}>
        <Text style={{fontSize:10,fontWeight: 'bold'}}>
          Kết thúc{": "}
          <Text style={{fontSize:10}}>{EndPoint.Name}</Text>
        </Text>
      </View>
    </View>
    <View style={styles.right}>
      <View style={[styles.inrow, {marginTop: 10}]}>
        <Text style={{fontSize: 15, textAlign:'center', color: '#7A7EEF', fontWeight: 'bold'}}>{predictime.toFixed(2)} phút {"\t"} </Text>
      </View>
      <View style={[styles.inrow, {marginTop: 10}]}>
          <Text style={{fontSize: 15, textAlign:'center', fontWeight: 'bold'}}>{predictDistance.toFixed(2)} km {"\t"} </Text>
        </View>
    </View>
  </View>)
  }

  function BusTour({BusStage,predictime,predictDistance}){
    return (
      <View style={styles.tourcomponent}>
      <View style={styles.left}>
        <View style={[styles.inrow, {marginLeft: 5}]}>
          <Text style={{fontSize:15,fontWeight: 'bold'}}>
            Đi bus:
          </Text>
        </View>
        <View style={[styles.inrow, {marginLeft: 5}]}>
          <Text style={{fontSize:10,fontWeight: 'bold'}}>
            Bắt đầu{": "}
            <Text style={{fontSize:10}}>{BusStage.listLocation[0].Name}</Text>
          </Text>
        </View>
        {
          BusStage.listLocation.map((location)=>{
            return(
            <View style={[styles.inrow, {marginLeft: 5}]}>
              <Text style={{fontSize:10}}>
                Trạm{" "}
                <Text style={{fontSize:10}}>{location.Name}</Text>
                
              </Text>
            </View>)
          })
        }
        <View style={[styles.inrow, {marginLeft: 5}]}>
          <Text style={{fontSize:10,fontWeight: 'bold'}}>
            Kết thúc{": "}
            <Text style={{fontSize:10}}>{BusStage.listLocation[BusStage.listLocation.length-1].Name}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={[styles.inrow, {marginTop: 10}]}>
          <Text style={{fontSize: 15, textAlign:'center', color: '#7A7EEF', fontWeight: 'bold'}}>{predictime.toFixed(2)} phút {"\t"} </Text>
        </View>
        <View style={[styles.inrow, {marginTop: 10}]}>
          <Text style={{fontSize: 15, textAlign:'center', fontWeight: 'bold'}}>{predictDistance.toFixed(2)} km {"\t"} </Text>
        </View>
      </View>
    </View>)
  }
  console.log("@@------------TICKETS------------",route.params.mapControl);
  return (
    <View style={(styles.container, screenHeight)}>
      <View style={styles.top}>
        <View style={styles.inputIcon}>
          <Ionicons
            name="chevron-back"
            size={20}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={styles.topData}>
            <Text style={{ fontSize: 24, color: 'white'}}>Lộ trình</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.mapSection}>
          <WebViewMap props={props}></WebViewMap>
        </View>
        <View style={styles.way}>
          <View style={styles.inrow}>
            <View style={[styles.busstat, {backgroundColor: '#DF2E38'}]}>
              <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>{mapping.listSchedule[mapping.currentRoute].BusStages[0].RouteId}</Text>
            </View>
          </View>
        </View>
        <Text style={{ textAlign: 'center', paddingBottom: 5, fontSize: 15, backgroundColor: '#0093E9', color:'#fff', fontWeight: 'bold', height: 30}}> chi tiết cách đi</Text>
        <ScrollView style={styles.tourSection}>
          
          <WalkTour StartPoint={mapping.listSchedule[mapping.currentRoute].WalkStages[0].StartPoint}
            EndPoint={mapping.listSchedule[mapping.currentRoute].WalkStages[0].EndPoint}
            predictime={mapping.listSchedule[mapping.currentRoute].SpecificPredictTimes[0]}
            predictDistance={mapping.listSchedule[mapping.currentRoute].SpecificPredictTimes[0]}
            ></WalkTour>
          <BusTour BusStage={mapping.listSchedule[mapping.currentRoute].BusStages[0]}
            predictime={mapping.listSchedule[mapping.currentRoute].SpecificPredictTimes[1]}
            predictDistance={mapping.listSchedule[mapping.currentRoute].SpecificPredictTimes[1]}></BusTour>
          <WalkTour StartPoint={mapping.listSchedule[mapping.currentRoute].WalkStages[1].StartPoint}
            EndPoint={mapping.listSchedule[mapping.currentRoute].WalkStages[1].EndPoint}
            predictime={mapping.listSchedule[mapping.currentRoute].SpecificPredictTimes[2]}
            predictDistance={mapping.listSchedule[mapping.currentRoute].SpecificPredictTimes[2]}></WalkTour>       
        </ScrollView>
      </View>

      {/* <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    paddingTop:40,
    position: 'relative',
    height: '10%',
    backgroundColor: '#0093E9',
  },
  topData: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#0093E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourcomponent: {

    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginBottom: 1,
  },
  inrow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom:5,
  },

  left: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '75%',
  },
  
  right: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '25%',
  },
  body: {
    height: '90%',
    backgroundColor: '#0093E9',
    display: 'flex',
    flexDirection: 'column',
    // paddingTop: 20,
  },
  mapSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
    borderRadius: 10,
  },
  way: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 40,
  },
  tourSection: {
    flexDirection: 'row',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10,
    // height: 400,
  },
  footer: {
    height: '7%',
  },
  busstat: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft:5
  },
  inputIcon: {
    marginLeft:30,
    marginTop:40,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    paddingTop:10,
    height: 30,
  },
});
