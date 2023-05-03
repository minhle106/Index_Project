import { Scheduled, getAppropriateBusAndTime} from "../functionAPI.js";
import * as MapViewClass from '../helper/MapViewClass.js'
import { getJWT_Token, UpdateTelemetry } from "../helper/thingsboard.js";
const USER_THINGSBOARD = 'minhletravel106@gmail.com';
const PASS_THINGSBOARD = '123456';

const listBus=[
    new MapViewClass.Bus(null,"50",'99cfc6b0-c3f8-11ed-9b15-dd2dac50548f',"50A-1462"),
    new MapViewClass.Bus(null,"53",'af3250b0-e381-11ed-a4fc-57550caf43ca',"50A-1342"),
    new MapViewClass.Bus(null,"8",'953de280-c3f8-11ed-9b15-dd2dac50548f',"50A-6562")
]

function getObj(data){
    return JSON.parse(data)
}


const routes = (app) => {
    app.post("/schedule", (request, response) => {
        const StartPoint=new MapViewClass.Location();
        const EndPoint=new MapViewClass.Location();
        console.log(request.body)
        // const body=getObj(request.data)
        StartPoint.FromObj(request.body.StartPoint);
        EndPoint.FromObj(request.body.EndPoint);
        console.log(request)
        const data=Scheduled( StartPoint, EndPoint);
		response.send(data);
	});
    app.post("/buses", (request, response) => {
        getJWT_Token(USER_THINGSBOARD,PASS_THINGSBOARD)
        .then((jwt_token)=>{
            const JWT_Token=jwt_token;
            var listEntityId=listBus.map(bus=>bus.EntityId);
            const schedule=new MapViewClass.Schedule();
            // const body=getObj(request.data)
            console.log(request.body)
            schedule.FromObj(request.body)
            console.log("@@ Buses API schedule: ",schedule,"-------------------@@")
            Promise.all(UpdateTelemetry(JWT_Token,listEntityId))
            .then((data)=>{

                data.forEach((bus,idx) => {
                    const location= new MapViewClass.Location("",bus.longitude[0].value,bus.latitude[0].value)
                    listBus[idx].location=location;
                });

                const dataOfRes=getAppropriateBusAndTime(listBus,schedule);
                schedule.buses=[dataOfRes[0]]
                schedule.ToStationTimes=[dataOfRes[1]]
                console.log("@@ Buses API to Response: ",schedule.buses,"-------------------@@")
                response.send(schedule);
            })
            .catch((error)=>{
                console.error(error);
            })
            console.log("--call--")
        })
        .catch((error)=>{
            console.error(error);
        })
	});
};
export default routes;