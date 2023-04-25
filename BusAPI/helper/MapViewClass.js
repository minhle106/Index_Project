export class Location{
    constructor(Name=null, Longitude=null, Latitude=null){
        this.Name=Name;//string
        this.Longitude=Longitude;//number
        this.Latitude=Latitude;//number
    }
    FromObj(Obj){
        this.Name=Obj.Name;//string
        this.Longitude=Obj.Longitude;//number
        this.Latitude=Obj.Latitude;//number
    }
}


export class Bus{
    constructor(location, busNumber, EntityId=null ,licence_plate=null){
        this.location = location;
        this.busNumber = busNumber;//string
        this.EntityId=EntityId;
        this.licence_plate=licence_plate;//string
    }
    FromObj(Obj){
        this.EntityId=Obj.EntityId;//string
        this.licence_plate=Obj.licence_plate;//string
    }    
}

export class Schedule{
    constructor(WalkStages=null,BusStages=null,GeneralPredictTime=null, SpecificPredictTimes=null, GeneralDistance=null, SpecificDistances=null, buses=null, ToStationTimes=null){
        this.WalkStages=WalkStages;// Các chặn đi bộ
        this.BusStages=BusStages;// Các chặn xe bus, chặn đi bộ nhiều hơn chặn xe bus 1 chặn
        this.GeneralPredictTime=GeneralPredictTime;// Tiên đoán thời gian hoàn thành lộ trình chung
        this.GeneralDistance=GeneralDistance;// Chiều dài tổng
        this.SpecificDistances=SpecificDistances;// Chiều dài mỗi chặn
        this.SpecificPredictTimes=SpecificPredictTimes;// Tiên đoán thời gian hoàn thành trên từng chặn nhỏ
        this.buses=buses;
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
}

export class WalkStage{
    constructor(StartPoint, EndPoint){
        this.StartPoint=StartPoint;// obj <Location>
        this.EndPoint=EndPoint;// obj <Location>
    }
    FromObj(Obj){
        this.StartPoint=new Location(null,null,null);
        this.EndPoint=new Location(null,null,null);
        this.EndPoint.FromObj(Obj.StartPoint);
        this.StartPoint.FromObj(Obj.EndPoint);
    }
    // ToObj(){
    //     return{
    //         StartPoint: this.StartPoint.ToObj(),
    //         EndPoint: this.EndPoint.ToObj(),
    //     }
    // }
}

export class BusStage{
    constructor(listLocation, RouteId=null) {
        this.RouteId = RouteId;
        this.listLocation = listLocation;
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
    constructor(Callback){
        this.changeState="changed";
        this.typeActivity="no"
        this.StartPoint=null;
        this.EndPoint=null;
        this.currentRoute=null;
        this.Callback=()=>{
            this.changeState="changed";
            Callback();};
    }
    SelectRoute(SelectRoute)
    {
        if(this.changeState=="changing")
            return false;
        this.changeState="changing";
        if(this.currentRoute!=SelectRoute)
        {
            this.currentRoute=SelectRoute;
            if(this.typeActivity=="find" || 
                this.typeActivity=="refind" ||
                this.typeActivity=="reselect")
            {
                this.typeActivity="select";
            }
            else if(this.typeActivity=="select"){
                this.typeActivity="reselect";
            }
        }
    }
    FindRoute(Longitude,Latitude){
        if(this.changeState=="changing")
            return false;
        this.changeState="changing";
        if(this.Longitude!=Longitude ||
            this.Latitude!=Latitude)
        {
            this.Longitude=Longitude;
            this.Latitude=Latitude;
            if(this.typeActivity!="refind")
            {
                this.typeActivity="refind"
            }
            else
            {
                this.typeActivity="find"
            }
        }
    }
    // getChangeState(){return this.changeState}
    // getLong(){return this.Longitude}
    // getLat(){return this.Latitude}
    // getType(){return this.typeActivity}
    // getSelect(){return this.currentRoute}
    // getCallback(){return this.Callback}
    getProps()
    {
        return {
            StartPoint: this.StartPoint,
            EndPoint: this.EndPoint,
            typeActivity: this.typeActivity,
            currentRoute: this.currentRoute,
            Callback: this.Callback,
        };
    }
}