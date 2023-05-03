// Component React Native
import { WebView } from 'react-native-webview';
import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import * as MapViewClass from '../helper/MapViewClass'
import { Text, View, StyleSheet} from 'react-native';
import MapHTML from '../helper/Map.js'

console.log("@@--MapHTML-----------------",MapHTML)

const LocationAPI = (EntityID) => {
  return 'http://demo.thingsboard.io/api/plugins/telemetry/DEVICE/' + EntityID + '/values/timeseries'
};
const AuthAPI = () => {
  return 'http://demo.thingsboard.io/api/auth/login'
};
const AppAPI = (service)=> {
  // return 'https://707215b6-b6df-4ae0-9749-7d261a9e3897.mock.pstmn.io'+service;
  return 'https://bus-api-nhanlebkhcm.vercel.app'+service;
}
const REFRESH_INTERVAL = 5000;
const USER_THINGSBOARD = 'minhletravel106@gmail.com';
const PASS_THINGSBOARD = '123456';

// props:
//   typeActivity: "select" or "find"
//   Longitude: number
//   Latitude: number
//   SelectRoute: number
//   Callback: Hàm trả về giá trị cho Component cha: gồm:
//      mapview.state{type,listRoute}
//      mapview.BusForRoute
//      mapview.timerId
//      mapview.Promise_JWT_Token
//      mapView.stateChange="changing" or "changed" -> Dùng để nhận biết một yêu cầu đã hoàn thành

// 5 TH của props:
// 1) "select" -> SelectRoute = index của route muốn chọn [Khi muốn chọn Route]
// 2) "find" -> tùy ý [Khi trước đó là "no"]
// 3) "no" -> tùy ý [Khi khởi tạo component]
// 4) "refind" -> tùy ý [Khi muốn tìm lại route, trước đó phải là find]
// 5) "reselect" -> tùy ý [Khi muốn chọn lại route, trước đó phải là select]


//Để sau khi chuyển trang vẫn ở trạng thái cũ thì làm như sau:
//

function WebViewMap ({props}){
    const [state,setState]=useState({
      state: "noRoute",
      listSchedule: [],
      timerId: null,
      JWT_Token: null,
      webViewRef: useRef(),
    });
    const [rerender,setRerender]=useState(false);

    

    //Component mount
    useEffect(()=>{
      //Lấy JWT_Token của thingsboard
      console.log("@@-----------------\n@@USE-EFFECT at DidMount-------------------------@@")
      getJWT_Token()
      .then((result)=>{
        state.JWT_Token=result;
        console.log("@@-----------------\n@@USE-EFFECT get JWT_Token-------------------------@@",state.JWT_Token)
        if(props.mode!="general")
        {
          state.state="noSelect";
          state.listSchedule=props.listSchedule;
          noSelect_select();
        }
      })

      return ()=>{
        //Component unmount
        if(state.timerId)
          clearInterval(state.timerId);
      }},[])
    console.log("aboveuseEff")
    console.log(props.typeActivity)
    //Khi props thay đổi
    useEffect(()=>{
      console.log("useEffWVM with State: ",state.state)
      if(props.typeActivity=="find"||props.typeActivity=="refind")
      {
        if(state.state=="noRoute"){ console.log('inWebViewfindroute1'); noRoute_find();}
        else if(state.state=="noSelect"){console.log('inWebViewfindroute2'); noSelect_find();}
        else if(state.state=="Selected"){console.log('inWebViewfindroute3'); Selected_find();}
      }
      else if(props.typeActivity=="select"||props.typeActivity=="reselect")
      {
        if(state.state=="noSelect"){console.log('inWebViewfindroute4'); noSelect_select();}
        else if(state.state=="Selected"){console.log('inWebViewfindroute5'); Selected_select();}
      }
      else
      {
        if(state.state=="Selected"){
          Selected_no();
        }
      }
    },[props.typeActivity])

  async function getJWT_Token(){
    const url = AuthAPI();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const data = {
      "username":USER_THINGSBOARD,
      "password":PASS_THINGSBOARD
    };
    try {
      const response = await axios.post(url, data, {
        headers: headers,
      });
      return response.data["token"];
    } catch (error) {
      console.error(error);
    }
  }

  async function FetchSchedules(StartP,EndP)
  {
    const url = AppAPI('/schedule');
    const headers = {
      'Content-Type': 'application/json',
    };
    const data={
      StartPoint: StartP,
      EndPoint: EndP
    }
    console.log(JSON.stringify(data));
    try {
      const response = await axios.post(url, data,
        {headers: headers});
      // console.log("response: ",JSON.stringify(response.data));
      //Thay đổi listSchedule
      console.log("@@FetchSchedules response.data: ",response.data,"------------------------------@@")
      state.listSchedule = response.data.map((schedule) => {
        const temp = new MapViewClass.Schedule();
        
        temp.FromObj(schedule);
        // console.log("temp: ", temp);
        return temp;
      });
      console.log("@@FetchSchedules End---------------------------@@")
    } catch (error) {
      console.error(error);
    }
  }

  async function FetchBuses(currentRoute){
    const url = AppAPI('/buses');
    const headers = {
      'Content-Type': 'application/json',
    };
    const data=JSON.parse(JSON.stringify(state.listSchedule[currentRoute]))
    console.log("@@----FetchBuses--Schedule",data,"-----@@")
    try {
      console.log("@@-----------------------FetchBuses-----------------------@@")
      const response = await axios.post(url, data,
        {headers: headers});
      console.log("@@------Response.data of FetchBuses: ",response.data);
      const temp = new MapViewClass.Schedule();
      temp.FromObj(response.data);
      state.listSchedule[currentRoute] = temp;
      console.log("@@------state.listSchedule[currentRoute] of FetchBuses: ",state.listSchedule[currentRoute]);
    } catch (error) {
      console.error(error);
    }
  }
  function FetchLocations(buses)
  {
    return getJWT_Token().then(()=>{
    console.log("@@----FetchLocations------@@", buses[0].EntityId)
    const EntityIds= buses.map((bus) => {
      return bus.EntityId;
    });
    const urls =EntityIds.map((EntityID)=>{ return LocationAPI(EntityID)});
    console.log("@@----FetchLocations--URLS----@@", urls[0])
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer '+ state.JWT_Token
    };

    if(state.JWT_Token)
    {
      return Promise.all(urls.map((url)=>{return axios.get(url, {
        headers: headers,
      })}))
        .then(response => {
          const listLocation=[];
          response=response[0];
          console.log("@@------------RESPONSE from THINGSBOARD:",response.data)

            const tempLo=new MapViewClass.Location("",response.data.longitude[0].value, 
            response.data.latitude[0].value);
              console.log("@@------------RESULT Location THINGSBOARD:",tempLo)
            listLocation.push(tempLo);
          return listLocation;
        })
        .catch(error => {
          console.error("@@---Huhu fail request: ",error);
        });
    }
    else console.error("Fetch Location nhưng không có JWT_Token!")
  })
  }

  function UpdateHTMLSchedule(Schedule){
    console.log("@@----------UpdateHTMLSchedule---------@",Schedule)
    const mess={
      type: "Schedule",
      data: JSON.parse(JSON.stringify(Schedule))};
      console.log("@@-----------------PostMessage------------------------@@",state.webViewRef.current)
    state.webViewRef.current.postMessage(JSON.stringify(mess));
  }

  function UpdateHTMLLocations(Locations,buses){
    const mess={
      type: "Locations",
      data: {
        Locations: Locations.map((location)=>{
          return JSON.parse(JSON.stringify(location))
        }),
        buses: buses.map((bus)=>{
          return JSON.parse(JSON.stringify(bus))
        }),
      }};
    console.log("@@--UpdateHTMLLocation: ",mess);
    state.webViewRef.current.postMessage(JSON.stringify(mess));
  }

  function UpdateHTMLClear(){
    const mess={
      type: "Clear",
      data: {}};
    state.webViewRef.current.postMessage(JSON.stringify(mess));
  }

  function Selected_no(){
    clearInterval(state.timerId);
    state.state="noSelect";
    props.Callback(state.listSchedule);
  }

  function noRoute_find(){
    FetchSchedules(props.StartPoint, props.EndPoint).then(()=>{
      if(state.listSchedule.length!=0){
        state.state="noSelect";
        props.Callback(state.listSchedule);
        console.log("@@success noRoute_find!")
      }
      else{
        props.Callback(state.listSchedule);
      }
    })
  }

  function noSelect_find(){
    FetchSchedules(props.StartPoint, props.EndPoint)
    .then(()=>{
      if(state.listSchedule.length!=0){
        state.state="noSelect";
        props.Callback(state.listSchedule);
      }
      else{
        state.state="noRoute";
        props.Callback(state.listSchedule);
      }
    })
  }

  function Selected_find(){
    clearInterval(state.timerId);
    FetchSchedules(props.StartPoint, props.EndPoint)
    .then(()=>{
      if(state.listSchedule.length!=0){
        state.state="noSelect";
        console.log("@@---Selected_find-----------------------@@")
        UpdateHTMLClear();
        props.Callback(state.listSchedule);
      }
      else{
        state.state="noRoute";
        UpdateHTMLClear();
        props.Callback(state.listSchedule);
      }
    })
  }

  function Selected_select(){
    clearInterval(state.timerId);
    UpdateHTMLSchedule(state.listSchedule[props.currentRoute]);
    FetchBuses(props.currentRoute)
    .then(()=>{
      var count=0;
      state.timerId=setInterval(()=>{
        if(count==12)
        {
          count=0;
          FetchBuses(props.currentRoute)
        }
        else
        {
          console.log("@@Selected_select--FetchLocations-----------------------@@")
          FetchLocations(state.listSchedule[props.currentRoute].buses)
          .then((Locations)=>{
            UpdateHTMLLocations(Locations,state.listSchedule[props.currentRoute].buses)
          })
        }
      },REFRESH_INTERVAL)
      props.Callback(state.listSchedule);
    });
  }

  function noSelect_select(){

    UpdateHTMLSchedule(state.listSchedule[props.currentRoute]);
    console.log("@@noSelect_select--UpdateHTMLShedule-----------------------@@")
    FetchBuses(props.currentRoute)
    .then(()=>{
      console.log("@@noSelect_select--FetchBuses-----------------------@@")
      state.state="Selected";
      var count=0;
      state.timerId=setInterval(()=>{
        if(count==12)
        {
          count=0;
          FetchBuses(props.currentRoute)
        }
        else
        {
          console.log("@@noSelect_select--FetchLocations-----------------------@@")
          FetchLocations(state.listSchedule[props.currentRoute].buses)
          .then((Locations)=>{
            UpdateHTMLLocations(Locations,state.listSchedule[props.currentRoute].buses)
          })
        }
      },REFRESH_INTERVAL)
      props.Callback(state.listSchedule);
    });
  }

    return (
      <WebView
        style={styles.container}
        ref={state.webViewRef}
        source={{ html: MapHTML }}
      />
      
      );
    }

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    borderRadius:10,
  },
})

export default WebViewMap;