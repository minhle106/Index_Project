// Import packages and set the port
import bodyParser from "body-parser";
import express from "express";
import routes from "./routes/routes.js";
import { getJWT_Token, UpdateTelemetry } from "./helper/thingsboard.js";
import * as MapViewClass from './helper/MapViewClass.js'
const port = 3002;
const app = express();
const db_conn=null;
const REFRESH_INTERVAL = 3000;
const USER_THINGSBOARD = 'minhletravel106@gmail.com';
const PASS_THINGSBOARD = '123456';

const listBus=[
    new MapViewClass.Bus(null,"50",'99cfc6b0-c3f8-11ed-9b15-dd2dac50548f',"50A-1462"),
    new MapViewClass.Bus(null,"53",'af3250b0-e381-11ed-a4fc-57550caf43ca',"50A-1342"),
    new MapViewClass.Bus(null,"8",'953de280-c3f8-11ed-9b15-dd2dac50548f',"50A-6562")
]

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

routes(app,db_conn);
// Start the server
const server = app.listen(port, (error) => {
	if (error) return console.log(`Error: ${error}`);
	console.log(`Server listening on port ${server.address().port}`);
});

// var JWT_Token=null;
// getJWT_Token(USER_THINGSBOARD,PASS_THINGSBOARD)
//     .then((jwt_token)=>{
//         JWT_Token=jwt_token;
//     })
//     .catch((error)=>{
//         console.error(error);
//     })
// setInterval(() => {

//     if(JWT_Token)
//     {
//         var listEntityId=listBus.map(bus=>bus.EntityId);
//         // console.log(listBus)
//         // console.log(listEntityId);
//         Promise.all(UpdateTelemetry(JWT_Token,listEntityId))
//         .then((data)=>{
//             console.log(JSON.stringify(data))
//         })
//         .catch((error)=>{
//             console.error(error);
//         })
//         console.log("--call--")
//     }
// },REFRESH_INTERVAL)
