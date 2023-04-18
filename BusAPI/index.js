// Import packages and set the port
import bodyParser from "body-parser";
import express from "express";
import routes from "./routes/routes.js";
import { getJWT_Token, UpdateTelemetry } from "./helper/thingsboard.js";

const port = 3002;
const app = express();
const db_conn=null;
const REFRESH_INTERVAL = 3000;
const USER_THINGSBOARD = 'thanhnhanle1407@gmail.com';
const PASS_THINGSBOARD = '123456';

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

var JWT_Token=null;
getJWT_Token(USER_THINGSBOARD,PASS_THINGSBOARD)
    .then((jwt_token)=>{
        JWT_Token=jwt_token;
    })
    .catch((error)=>{
        console.error(error);
    })
setInterval(() => {

    if(JWT_Token)
    {
        Promise.all(UpdateTelemetry(JWT_Token,['043088a0-c282-11ed-9b15-dd2dac50548f','505b6fc0-af44-11ed-b62c-7d8052ad39cf']))
        .then((data)=>{
            console.log(JSON.stringify(data))
        })
        .catch((error)=>{
            console.error(error);
        })
        console.log("--call--")
    }
},REFRESH_INTERVAL)
