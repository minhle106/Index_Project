export class Location{
    constructor(name, longitude, latitude){
        this.name=name;//string
        this.longitude=longitude;//number
        this.latitude=latitude;//number
    }
    FromObj(Obj){
        this.name=Obj.name;//string
        this.longitude=Obj.longitude;//number
        this.latitude=Obj.latitude;//number
    }
}


export class Bus{
    constructor(location, busNumber,licence_plate=null){
        this.location = location;
        this.busNumber = busNumber;//string
        this.licence_plate=licence_plate;//string
    }
}

export class Schedule{
    constructor(WalkStages=null,BusStages=null,GeneralPredictTime=null, SpecificPredictTimes=null, GeneralDistance=null, SpecificDistances=null){
        this.WalkStages=WalkStages;// Các chặn đi bộ
        this.BusStages=BusStages;// Các chặn xe bus, chặn đi bộ nhiều hơn chặn xe bus 1 chặn
        this.GeneralPredictTime=GeneralPredictTime;// Tiên đoán thời gian hoàn thành lộ trình chung
        this.GeneralDistance=GeneralDistance;// Chiều dài tổng
        this.SpecificDistances=SpecificDistances;// Chiều dài mỗi chặn
        this.SpecificPredictTimes=SpecificPredictTimes;// Tiên đoán thời gian hoàn thành trên từng chặn nhỏ
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
        EndPoint.FromObj(Obj.StartPoint);
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
    constructor(locations, routeId=null) {
        this.routeId = routeId;
        this.locations = locations;
    }
    FromObj(Obj){
        this.listLocation=Obj.listLocation
        .map(location=>{
            const temp= new Location(null,null,null);
            return temp.FromObj(location);
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