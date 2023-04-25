import {Location, Bus, Schedule, WalkStage, BusStage} from './helper/MapViewClass.js';   

    const locations = [
        new Location("Đại Học Bách Khoa CS2", 106.80612178104248, 10.881149676090116),
        new Location("Đại Học Quốc Tế", 106.80279449627722, 10.878357506728037),
        new Location("Quảng Trường Sáng Tạo", 106.80252940033479, 10.876543355403138),
        new Location("Đường Võ Trường Toản", 106.79612092858453, 10.870569980198782),
        new Location("Đường Chu Văn An", 106.79464595703116, 10.866833846387186),
        new Location("Quốc Lộ 1", 106.7779967653803, 10.869051392103302),
        new Location("Đường Phạm Văn Đồng", 106.72958092144204, 10.835797439964313),
        new Location("Đường Hoàng Minh Giám", 106.67484639976509, 10.8101772078529),
        new Location("Đường Phổ Quang", 106.6667997455917, 10.805624608877004),
        new Location("Đường Phan Đình Giót", 106.66493442252349, 10.803632808892347),
        new Location("Đường Trần Quốc Hoàn", 106.66260747190734, 10.801707650657649),
        new Location("Đường Hoàng Văn Thụ", 106.65745277813977, 10.797233353056239),
        new Location("Đường Xuân Diệu", 106.65526409584918, 10.795989765335568),
        new Location("Đường Xuân Hồng", 106.65215934386589, 10.794168408712755),
        new Location("Đường Lý Thường Kiệt", 106.65284061895801, 10.788906685649446),
        new Location("Đại Học Bách Khoa", 106.65767663215227, 10.772600945585678),
        new Location("Bến Xe Buýt A DHQG TP.HCM", 106.8020765626774, 10.874254572962),
        new Location("Đường 621", 106.80680067634836, 10.874333659034871),
        new Location("Đường Song Hành Bờ Nam", 106.80535335604358, 10.869829315491927),
        new Location("Ngã Tư Thủ Đức", 106.79745737662496, 10.863937291301925),
        new Location("Đường Võ Văn Ngân", 106.76402195586932, 10.850471092733349),
        new Location("Đường Tô Ngọc Vân", 106.74602984599237, 10.86270894572631),
        new Location("Quốc Lộ 13", 106.71770322875113, 10.841467462053398),
        new Location("Đường Đinh Bộ Lĩnh", 106.70887865082716, 10.811372321469586),
        new Location("Đường Bạch Đằng", 106.70404730525594, 10.80331027673203),
        new Location("Đường Phan Đăng Lưu", 106.68412153248282, 10.80261196626438),
        new Location("Đường Hồng Bàng", 106.6592285861279, 10.754832125113358),
        new Location("Đường Châu Văn Liêm", 106.65895184956997, 10.752371992584168),
        new Location("Đường Tùng Thiện Vương", 106.65715402182919, 10.744902080442712),
        new Location("Quốc Lộ 50", 106.65639442605655, 10.738789962299814),
        new Location("Bến Xe Buýt Quận 8", 106.65629718226374, 10.73313744769951),
        new Location("KTX Khu B", 106.78237867144573, 10.881280221587879),
        new Location("Đại Học KHTN", 106.79987971675553, 10.874452317339315),
        new Location("Đường Kha Vạn Cân", 106.76352632820286, 10.868810113586218),
        new Location("Đường Hoàng Diệu 2", 106.7683965361784, 10.85466686278986),
        new Location("Đường Lê Văn Chí", 106.77399087400123, 10.850763910373358),
        new Location("Ngã Tư Bình Thái", 106.76504032030303, 10.834460765942918),
        new Location("Cầu Sài Gòn", 106.73443144709606, 10.800768866088193),
        new Location("Đường Nguyễn Hữu Cảnh", 106.70751818870677, 10.784148277444324),
        new Location("Đường Tôn Đức Thắng", 106.70707575605215, 10.777275157551113),
        new Location("Đường Hàm Nghi", 106.70073667125868, 10.770938367018697),
        new Location("Đường Lê Lai", 106.69040479698077, 10.768798781032006),
        new Location("Đường Cống Quỳnh", 106.68773448276286, 10.767019720877345),
        new Location("Đường Nguyễn Thị Minh Khai", 106.68238626728139, 10.766385629553797),
        new Location("Đường Hùng Vương", 106.67884337742863, 10.763808267500114),
        new Location("Đường Lê Hồng Phong", 106.67664444121385, 10.761302786174605)
    ];    

    const busStages = [
        new BusStage([ locations[0], locations[1], locations[2], locations[3], locations[4], locations[5], 
                        locations[6], locations[7], locations[8], locations[9], locations[10], 
                        locations[11], locations[12], locations[13], locations[14], locations[15]],"50"),
        new BusStage([ locations[16], locations[2], locations[17], locations[18], locations[5], locations[19], 
                        locations[20], locations[21], locations[6], locations[22], locations[23], locations[24], 
                        locations[25], locations[11], locations[9],  locations[10], locations[11], locations[12],
                        locations[13], locations[14], locations[26], locations[27], locations[28], locations[29], 
                        locations[30]], "08"),
        new BusStage([locations[31], locations[1], locations[32], locations[16], locations[17], 
                        locations[18], locations[5], locations[19], locations[33], locations[34], 
                        locations[35], locations[36], locations[37], locations[38], locations[39], 
                        locations[40], locations[41], locations[42], locations[43], locations[44], locations[45]],"53")
        ];

    const graph = {
        0: [1],             1: [0,2,31,32],         2: [1,3,16,17],         3: [2,4],
        4: [3,5],           5: [4,6,18,19],         6: [5,7,21,22],         7: [6,8],
        8: [7,9],           9: [8,10,11],           10: [9,11],             11: [9,10,12,25],
        12: [11,13],        13: [12,14],            14: [13,15,26],         15: [14],
        16: [2,17,32],      17: [2,16,18],          18: [17,5],             19: [5,20,33],
        20: [19,21],        21: [20,6],             22: [6,23],             23: [22,24],
        24: [23,25],        25: [24,11],            26: [14,27],            27: [26,28],
        28: [27,29],        29: [28,30],            30: [29],               31: [1],
        32: [1,16],         33: [19,34],            34: [33,35],            35: [34,36],
        36: [35,37],        37: [36,38],            38: [37,39],            39: [38,40],
        40: [39,41],        41: [40,42],            42: [41,43],            43: [42,44],
        44: [43,45],        45: [44]
    };

function findShortestPaths(graph, start, end, maxNumPaths) {
    let queue = [[start]]; 
    let validPaths = [];
    let shortestPaths = [];
    while (queue.length > 0) {
        let path = queue.shift(); 
        let node = path[path.length - 1];
        if (node === end) {
            validPaths.push(path); 
        } else {
            let neighbors = graph[node];
            for (let neighbor of neighbors) {
                if (!path.includes(neighbor)) {
                    let newPath = path.concat(neighbor);
                    queue.push(newPath);
                }
            }
        }
    }
    validPaths.sort((a, b) => a.length - b.length);
    shortestPaths = validPaths.filter((path, index) => index < maxNumPaths);
    return shortestPaths;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}
function calculateDistance(location1, location2) {
    const R = 6371;
    const lat1 = location1.Latitude;
    const lon1 = location1.Longitude;
    const lat2 = location2.Latitude;
    const lon2 = location2.Longitude;
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function getNearestBusStop(location) {
    let nearestBusStop = [];
    let minDistance = Infinity;
    for (let busStop of locations) {
        let distance = calculateDistance(location, busStop);
        if (distance < minDistance) {
            if(nearestBusStop.length==5){
                nearestBusStop.shift()
            }
            nearestBusStop.push(busStop);
            minDistance = distance;
        }
    }
    return nearestBusStop;
}

function findBusRoutes(StartPoint, EndPoint) {
    let listRoute = [];
    for(let m=4; m>=0;m--)
    {
        for(let j=4; j>=0;j--)
        {
            console.log("--------------------------------------------------------------")
            let firstBusStop = getNearestBusStop(StartPoint)[m];
            let endBusStop = getNearestBusStop(EndPoint)[j];
            if(firstBusStop && endBusStop){
                let indexfirst = locations.indexOf(firstBusStop);
                let indexend = locations.indexOf(endBusStop);
                const shortestPaths = findShortestPaths(graph, indexfirst, indexend, 3);
                for (let i = 0; i < 3; i++)
                {
                    if(shortestPaths[i])
                        listRoute.push(new BusStage(shortestPaths[i].map(index => locations[index]),null))
                }
                // listRoute = [,
                //                 new BusStage(shortestPaths[1].map(index => locations[index]),null),
                //                 new BusStage(shortestPaths[2].map(index => locations[index]),null)];
                if(listRoute.length!=0)
                for (const route of listRoute) {
                    let k=0;
                    for (const loca of route.listLocation) {
                        if(busStages[k] && busStages[k].listLocation && busStages[k].listLocation.includes(loca)){
                            if (!route.RouteId) {
                                route.RouteId = [];
                            }
                            if(route.RouteId==null || !route.RouteId.includes(busStages[k].RouteId)){
                                route.RouteId += busStages[k].RouteId + " ";
                            }
                        }else{
                            k = k+1; 
                        }
                    }
                }
            }
            if(listRoute.length!=0)
            {
                return [listRoute,m,j];
            }
        }
    }
    return [listRoute,k,j];
}




// Trả về 3 INSTANCE của Schedule
export function Scheduled(StartPoint, EndPoint)
{
    let listSchedule = [];
    let result=findBusRoutes(StartPoint, EndPoint);
    let listRoute = result[0]
    let firstBusStop = getNearestBusStop(StartPoint)[result[1]];
    let endBusStop = getNearestBusStop(EndPoint)[result[2]];
    let firstDistance = calculateDistance(StartPoint, firstBusStop);
    let endDistance = calculateDistance(endBusStop, EndPoint);
    console.log(listRoute)
    for (var i = 0; i < listRoute.length; i++){
        let BusDistance = 0;
        for(var j = 1; j < listRoute[i].listLocation.length; j++){
            BusDistance += calculateDistance((listRoute[i].listLocation)[j-1],(listRoute[i].listLocation)[j]);
        }
        let GeneralDistance = firstDistance + BusDistance + endDistance;
        let GeneralPredictTime = (firstDistance/5 +  BusDistance/30 + endDistance/5)*60;
        let SpecificDistances = [firstDistance, BusDistance, endDistance];
        let SpecificPredictTimes = [firstDistance/5*60, BusDistance/30*60, endDistance/5*60];
        let WalkStages = [new WalkStage(StartPoint, firstBusStop), new WalkStage(endBusStop, EndPoint)];
        let schedule = new Schedule(WalkStages,[listRoute[i]],GeneralPredictTime,SpecificPredictTimes,GeneralDistance,SpecificDistances);
        listSchedule.push(schedule);
    }
    return listSchedule;
}
// Trả về xe buýt phù hợp (min distane + tuyến phù hợp) và thời gian xe buýt đó đến trạm
// Nhận vào danh sách các INSTANCE của Bus và 1 INSTANCE của Schedule
export function getAppropriateBusAndTime(listBus, schedule)
{
    let minDistance = Infinity;
    let index = -1;
    for(var i=0; i<listBus.length; i++){
        let distance = calculateDistance(listBus[i].location, (schedule.BusStages[0].listLocation)[0]);
        if(distance < minDistance && listBus[i].busNumber === (schedule.BusStages[0].RouteId).substring(0,2)){
            minDistance = distance;
            index = i;
        }
    }
    return [listBus[index], minDistance/30];
}


   // TESTCASE
const startPoint = new Location("StartPoint", 106.80, 10.88);
const endPoint = new Location("EndPoint",106.676, 10.76);
const listBus = [new Bus(startPoint,"50"), new Bus(endPoint,"53")];
let list = Scheduled(startPoint, endPoint);
console.log(list[0]);
console.log(getAppropriateBusAndTime(listBus, list[0]));