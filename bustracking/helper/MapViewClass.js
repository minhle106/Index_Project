export class Location{
    constructor(Name,Longitude,Latitude){
        this.Name=Name;//string
        this.Longitude=Longitude;//number
        this.Latitude=Latitude;//number
    }
    FromObj(Obj){
        this.Name=Obj.Name;//string
        this.Longitude=Obj.Longitude;//number
        this.Latitude=Obj.Latitude;//number
    }
    // ToObj(){
    //     return {
    //         Name: this.Name,
    //         Longitude: this.Longitude,
    //         Latitude: this.Latitude,   
    //     }     
    // }
}

export class Bus{
    constructor(EntityId,licence_plate){
        this.EntityId=EntityId;//string
        this.licence_plate=licence_plate;//string
    }
    FromObj(Obj){
        this.EntityId=Obj.EntityId;//string
        this.licence_plate=Obj.licence_plate;//string
    }    
    // ToObj(){
    //     return {
    //         EntityId: this.EntityId,
    //         licence_plate: this.licence_plate,
    //     }
    // }
}

export class Schedule{
    constructor(WalkStages=null,BusStages=null,buses=null,GeneralPredictTime=null, SpecificPredictTimes=null,BusLocations=null,ToStationTimes=null, GeneralDistance=null, SpecificDistances=null){
        this.WalkStages=WalkStages;
        this.BusStages=BusStages;
        this.buses=buses;
        this.GeneralPredictTime=GeneralPredictTime;
        this.GeneralDistance=GeneralDistance;
        this.SpecificDistances=SpecificDistances;
        this.SpecificPredictTimes=SpecificPredictTimes;
        this.ToStationTimes=ToStationTimes;
    }
    FromObj(Obj){
        // if(Obj.WalkStages)
            this.WalkStages=Obj.WalkStages
            .map(walkStage=>{
                const temp= new WalkStage(null, null);
                temp.FromObj(walkStage);
                return temp;
            });
        
        // if(Obj.BusStages) 
            this.BusStages=Obj.BusStages
            .map(busStage=>{
                const temp= new BusStage(null, null);
                temp.FromObj(busStage);
                return temp;
            });

        if(Obj.buses)
            this.buses=Obj.buses
            .map(bus=>{
                const temp= new Bus(null, null);
                temp.FromObj(bus);
                return temp;
            });

        if(Obj.GeneralPredictTime)
            this.GeneralPredictTime=Obj.GeneralPredictTime;

        if(Obj.SpecificPredictTimes)
            this.SpecificPredictTimes=Obj.SpecificPredictTimes
            .map(time=>{
                return time;
            });

        if(Obj.GeneralDistance)
            this.GeneralDistance=Obj.GeneralDistance;

        if(Obj.SpecificDistances)
            this.SpecificDistances=Obj.SpecificDistances
            .map(dt=>{
                return dt;
            });

        if(Obj.buses)
            this.buses=Obj.buses
            .map(bus=>{
                const temp= new Bus(null, null);
                temp.FromObj(bus);
                return temp;
            });

        if(Obj.ToStationTimes)
            this.ToStationTimes=Obj.ToStationTimes
            .map(time=>{
                return time;
            });
    }
    // ToObj(){
    //     return {
    //         WalkStages: this.WalkStages.ToObj(),
    //         BusStages: this.BusStages.ToObj(),
    //         buses: this.buses.map(bus=>{
    //             return bus.ToObj();
    //         }),
    //         GeneralPredictTime: this.GeneralPredictTime,
    //         SpecificPredictTime: this.SpecificPredictTime,
    //         BusLocations: this.BusLocations.map(location=>{
    //             return location.ToObj();
    //         }),
    //         ToStationTimes: this.ToStationTimes,
    //     }
    // }
}

export class WalkStage{
    constructor(StartPoint, EndPoint){
        this.StartPoint=StartPoint;// obj <Location>
        this.EndPoint=EndPoint;// obj <Location>
    }
    FromObj(Obj){
        this.StartPoint=new Location(null,null,null);
        this.EndPoint=new Location(null,null,null);
        this.EndPoint.FromObj(Obj.EndPoint);
        this.StartPoint.FromObj(Obj.StartPoint);
    }
    // ToObj(){
    //     return{
    //         StartPoint: this.StartPoint.ToObj(),
    //         EndPoint: this.EndPoint.ToObj(),
    //     }
    // }
}

export class BusStage{
    constructor(listLocation, RouteId){
        this.listLocation=listLocation;
        this.RouteId=RouteId;
    }
    FromObj(Obj){
        this.listLocation=Obj.listLocation
        .map(location=>{
            const temp= new Location(null,null,null);
            temp.FromObj(location);
            return temp;
        });
        this.RouteId=Obj.RouteId;
    }
    // ToObj(){
    //     return{
    //         listLocation: this.listLocation.map(location=>{
    //             return location.ToObj();
    //         }),
    //         RouteId: this.RouteId,
    //     }
    // }
}

export class MapControlPanel{
    constructor(Callback, listSchedule, currentRoute, mode){
        this.changeState="changed";
        this.typeActivity="no"
        this.StartPoint=null;
        this.EndPoint=null;
        this.currentRoute=-1;
        this.listSchedule=[];
        console.log("construct---t");
        if(mode=="general")
        {
            this.mode="general"
            this.Callback=(listSchedule, mode=true)=>{
                console.log("@@ControlPanel set changeState to #Changed---------@@");
                this.changeState="changed";
                this.listSchedule=listSchedule;
                if(mode)
                {
                    console.log("@@--------------CALLBACK--------------------@@")
                    Callback(listSchedule);};
                }
        }
        else // mode="special"
        {
            this.mode="special"
            this.listSchedule=listSchedule;
            this.currentRoute=currentRoute;
        }
    }
    SelectRoute(SelectRoute)
    {
        console.log("@@SelectRoute***StateChange is:", this.changeState," --------------------------------------");
        if(this.changeState=="changing")
            return false;
        
        if(this.currentRoute!=SelectRoute)
        {
            this.changeState="changing";
            this.currentRoute=SelectRoute;
            if(this.typeActivity=="find" || 
                this.typeActivity=="refind" ||
                this.typeActivity=="reselect")
            {
                this.typeActivity="select";
                console.log("@@SelectRoute--------------select----------------@@")
            }
            else if(this.typeActivity=="select"){
                this.typeActivity="reselect";
                console.log("@@SelectRoute--------------reselect----------------@@")
            }
        }
        return true;
    }
    EndSelect(){
        return new Promise(function(myResolve, myReject) {
            let x = 0;
          
            this.typeActivity=="no"
            this.changeState="changing";
            const id=setInterval(()=>{
                if(this.changeState="changed")
                {
                    clearInterval(id);
                    myResolve("OK");
                }
                    
            },300);
          });
    }
    FindRoute(StartPoint,EndPoint){
        console.log("@@StateChange is:", this.changeState," --------------------------------------");
        if(this.changeState=="changing")
            return false;
        
        
        if(StartPoint && EndPoint)
        {
            console.log("FindRoute")
            if(this.StartPoint!=StartPoint ||
                this.EndPoint!=EndPoint)
            {
                this.currentRoute=-1
                this.changeState="changing";
                this.StartPoint=StartPoint;
                this.EndPoint=EndPoint;
                if(this.typeActivity!="refind")
                {
                    console.log("inifFindRoute")
                    this.typeActivity="refind"
                }
                else
                {
                    this.typeActivity="find"

                }
            }
        }
        else return false;
        return true;
    }

    getProps()
    {
        console.log('Control Panel return Props is: ',{
            mode: this.mode,
            StartPoint: this.StartPoint,
            EndPoint: this.EndPoint,
            typeActivity: this.typeActivity,
            currentRoute: this.currentRoute,
            Callback: this.Callback,
            listSchedule: this.listSchedule,
        })
        return {
            mode: this.mode,
            StartPoint: this.StartPoint,
            EndPoint: this.EndPoint,
            typeActivity: this.typeActivity,
            currentRoute: this.currentRoute,
            Callback: this.Callback,
            listSchedule: this.listSchedule,
        };
    }
}