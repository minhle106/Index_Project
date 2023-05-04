import paho.mqtt.client as mqttclient
import time
import json
import  sys
from math import *

class BusClient:
    def __init__(self,client,vtemp,vhumi,vlinght,vangle,lo_cent,la_cent,r):
        self.vtemp = vtemp
        self.vhumi = vhumi
        self.vlight = vlinght
        self.lo_cent = lo_cent
        self.la_cent = la_cent
        self.vangle= vangle
        self.client=client
        self.temp=30
        self.humi=50
        self.light=100
        self.angle=0
        self.r=r
        self.latitude=r*sin(self.angle) +self.la_cent
        self.longitude=r*cos(self.angle) +self.lo_cent
    def change(self):
        self.temp+=self.vtemp
        self.humi+=self.vhumi
        self.light+=self.vlight
        self.angle+=self.vangle
        self.latitude=self.r*sin(self.angle) +self.la_cent
        self.longitude=self.r*cos(self.angle) +self.lo_cent
        # return self.temp,self.humi,self.vlingt,self.latitude,self.longtitude

def subscribed(client, userdata, mid, granted_qos):
    print("Subscribed...")

def recv_message(client, userdata, message):
    print("Received: ", message.payload.decode("utf-8"))
    temp_data = {'value': True}
    try:
        jsonobj = json.loads(message.payload)
        if jsonobj['method'] == "setValue":
            temp_data['value'] = jsonobj['params']
            client.publish('v1/devices/me/attributes', json.dumps(temp_data), 1)
    except:
        pass

def connected(client, usedata, flags, rc):
    if rc == 0:
        print("Thingsboard connected successfully!!")
        client.subscribe("v1/devices/me/rpc/request/+")
    else:
        print("Connection is failed")

BROKER_ADDRESS = "demo.thingsboard.io"
PORT = 1883

import serial.tools.list_ports

def getPort () :
    ports = serial.tools.list_ports.comports ()
    print(ports[0])
    N = len (ports)
    commPort = " None "
    for i in range(0 , N) :
        port = ports[i]
        strPort = str(port)
        if " USB-SERIAL CH340 " in strPort :
            splitPort = strPort . split (" ")
            commPort = ( splitPort [0])
    return commPort

# ser = serial.Serial( port = getPort () , baudrate =115200)

mess = ""
def processData( data, bclient: BusClient) :
    # data = data . replace ("!", "")
    # data = data . replace ("#", "")
    # splitData = data . split (":")
    # print ( splitData )
    # if splitData [1] == " TEMP ":
    #     client . publish ('v1/devices/me/telemetry', splitData [2])
    collect_data = {'temperature': bclient.temp, 'humidity': bclient.humi, 'light': bclient.light
        ,'longitude': bclient.longitude, 'latitude': bclient.latitude}
    collect_data=json.dumps(collect_data)
    return collect_data

mess = ""
def readSerial(bclient: BusClient) :
    jsonobj=processData("",bclient)
    # bytesToRead = ser.inWaiting ()
    # print('Waiting: ',bytesToRead)
    # if ( bytesToRead > 0) :
    #     global mess
    #     mess = mess + ser.read( bytesToRead ).decode ("UTF -8")
    #     print('test1:', ser.read( bytesToRead ).decode ("UTF -8"))
        # while ("#" in mess ) and ("!" in mess ):
        #     start = mess . find ("!")
        #     end = mess . find ("#")
        #     processData ( mess [ start : end + 1])
        #     if ( end == len( mess )) :
        #         mess = ""
        #     else :
        #         mess = mess [ end +1:]

    return jsonobj

def Create_Device(access_token):
    THINGS_BOARD_ACCESS_TOKEN = access_token

    client = mqttclient.Client("Gateway_Thingsboard")
    client.username_pw_set(THINGS_BOARD_ACCESS_TOKEN)

    client.on_connect = connected
    client.connect(BROKER_ADDRESS, 1883)
    client.loop_start()

    client.on_subscribe = subscribed
    client.on_message = recv_message
    return client

client1=Create_Device("b70LUFZ2FxcDeUJ6112r")
client2=Create_Device("lRQS5OBgvYEW56XoJTpX")
client3=Create_Device("GyLxevyEiq34vxLP5ZHD")


#Test
# temp = 30
# humi = 50
# light_intesity = 100
# lo_cent = 106.7
# la_cent = 10.6
# longitude = lo_cent
# latitude = la_cent
# angle=0

Bclient1=BusClient(client1,1,1,1,pi/10,106.7,10.6,0.15)
Bclient2=BusClient(client2,1,1,1,pi/15,107.7,10.2,0.1)
Bclient3=BusClient(client3,1,1,1,pi/20,106.7,10.6,0.34)
while True:
    Bclient1.change()
    Bclient2.change()
    Bclient3.change()
    jsonobj=readSerial(Bclient1)
    client1.publish('v1/devices/me/telemetry', jsonobj, 1)
    jsonobj=readSerial(Bclient2)
    client2.publish('v1/devices/me/telemetry', jsonobj, 1)
    jsonobj=readSerial(Bclient3)
    client3.publish('v1/devices/me/telemetry', jsonobj, 1)
    time.sleep(2)



# while True:
#     collect_data = {'temperature': temp, 'humidity': humi, 'light':light_intesity 
#     ,'longitude': longitude, 'latitude': latitude}
#     temp += 1
#     humi += 1
#     angle+=pi/10
#     longitude = 0.1*sin(angle) +lo_cent
#     latitude = 0.1*cos(angle) +la_cent
#     light_intesity += 1
#     client.publish('v1/devices/me/telemetry', json.dumps(collect_data), 1)
#     client2.publish('v1/devices/me/telemetry', json.dumps(collect_data), 1)
#     time.sleep(5)
# while True:
#     readSerial()
#     time.sleep(1)