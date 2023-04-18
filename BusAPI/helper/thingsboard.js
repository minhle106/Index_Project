import axios from "axios"
const BusAPI = (EntityID) => {
    return 'http://demo.thingsboard.io/api/plugins/telemetry/DEVICE/' + EntityID + '/values/timeseries'
  };
const AuthAPI = () => {
return 'http://demo.thingsboard.io/api/auth/login'
};

function getJWT_Token(username,password){
    const url = AuthAPI();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const data = {
      "username":username,
      "password":password
    };
    return axios.post(url, data, {
      headers: headers,
    })
      .then(response => {
        return response.data["token"];
      })
      .catch(error => {
        console.error(error);
      });
}

function UpdateTelemetry(jwt_token, listID){
    const urls = listID.map((EntityID)=>{ return BusAPI(EntityID)});
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer '+ jwt_token
    };
    return urls.map((url)=>{return axios.get(url, {
      headers: headers,
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error(error);
      });
    });
  }


export {getJWT_Token, UpdateTelemetry}