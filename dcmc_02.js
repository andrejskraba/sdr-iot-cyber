/*********************************************************************        
University of Maribor ************************************************
Faculty of Organizational Sciences ***********************************
Cybernetics & Decision Support Systems Laboratory ********************
@author Andrej Škraba ************************************************
@author Andrej Koložvari**********************************************
@author Davorin Kofjač ***********************************************
@author Radovan Stojanović *******************************************
*********************************************************************/

var firmata = require("firmata");

var LeftEncPin1 = 22;
var LeftEncPin2 = 23;
var LeftEncPin3 = 24;

var RightEncPin1 = 25;
var RightEncPin2 = 26;
var RightEncPin3 = 27;

var board = new firmata.Board("/dev/ttyACM0",function(){
    console.log("Priključitev na Arduino");
    console.log("Firmware: " + board.firmware.name + "-" + board.firmware.version.major + "." + board.firmware.version.minor); // izpišemo verzijo Firmware
    console.log("Omogočimo pine");
    board.pinMode(LeftEncPin1, board.MODES.INPUT); // LEFT digital pin from encoder 1
    board.pinMode(LeftEncPin2, board.MODES.INPUT); // LEFT digital pin from encoder 2
    board.pinMode(LeftEncPin3, board.MODES.INPUT); // LEFT digital pin from encoder 3
    board.pinMode(RightEncPin1, board.MODES.INPUT);  // RIGHT digital pin from encoder 1
    board.pinMode(RightEncPin2, board.MODES.INPUT); // RIGHT digital pin from encoder 2
    board.pinMode(RightEncPin3, board.MODES.INPUT); // RIGHT digital pin from encoder 3
    board.pinMode(3, board.MODES.OUTPUT);
    board.pinMode(2, board.MODES.OUTPUT); // LEFT digital pin to change direction
    board.pinMode(4, board.MODES.OUTPUT); // RIGHT digital pin to change direction
    board.pinMode(7, board.MODES.PWM);
    board.pinMode(6, board.MODES.PWM);
    board.pinMode(9, board.MODES.PWM);
    board.pinMode(10, board.MODES.PWM);
    board.pinMode(0, board.MODES.ANALOG); // analog pin for SHARP sensor 0A41SK F 3Z
    board.pinMode(12, board.MODES.OUTPUT);
    
    board.digitalWrite(LeftEncPin1, board.INPUT_PULLUP); // LEFT digital pin from encoder 1
    board.digitalWrite(LeftEncPin2, board.INPUT_PULLUP); // LEFT digital pin from encoder 2
    board.digitalWrite(LeftEncPin3, board.INPUT_PULLUP); // LEFT digital pin from encoder 3
    board.digitalWrite(RightEncPin1, board.INPUT_PULLUP);  // RIGHT digital pin from encoder 1
    board.digitalWrite(RightEncPin2, board.INPUT_PULLUP); // RIGHT digital pin from encoder 2
    board.digitalWrite(RightEncPin3, board.INPUT_PULLUP); // RIGHT digital pin from encoder 3
    
    
    board.digitalRead(LeftEncPin1, function(value) { // LEFT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        if (secondLeftFlag1 == value) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
        }
        else
        {
            //console.log("Pin LeftEncPin1 active " + Date.now() + " " + value + " " + secondLeftFlag1);
            secondLeftFlag1 = value;
            //console.log("Code on pin 22 active");
            if(NumLastMeasuresLeft < 3)
            {
                LeftLastMeasures.unshift(1);
                LeftLastTimes.unshift(Date.now());
                NumLastMeasuresLeft++;
                LeftLastIntervals.push(0);
                timesArrayLeft.push(Date.now());
            }
            else
            {
                LeftLastMeasures.pop();
                LeftLastMeasures.unshift(1);
                LeftLastTimes.pop();
                LeftLastTimes.unshift(Date.now());
                //console.log("LeftLastMeasures pin 1 " + LeftLastMeasures[0] + LeftLastMeasures[1] + LeftLastMeasures[2]);
                if(LeftLastMeasures[0] == 1 && LeftLastMeasures[1] == 2 && LeftLastMeasures[2] == 3
                || LeftLastMeasures[0] == 2 && LeftLastMeasures[1] == 3 && LeftLastMeasures[2] == 1
                || LeftLastMeasures[0] == 3 && LeftLastMeasures[1] == 1 && LeftLastMeasures[2] == 2)
                {
                    LeftLastIntervals.push(LeftLastTimes[0] - LeftLastTimes[1]);
                    timesArrayLeft.push(Date.now());
                    ///console.log("FORWARD");
                }
                else if(LeftLastMeasures[0] == 3 && LeftLastMeasures[1] == 2 && LeftLastMeasures[2] == 1
                || LeftLastMeasures[0] == 1 && LeftLastMeasures[1] == 3 && LeftLastMeasures[2] == 2
                || LeftLastMeasures[0] == 2 && LeftLastMeasures[1] == 1 && LeftLastMeasures[2] == 3)
                {
                    LeftLastIntervals.push(LeftLastTimes[1] - LeftLastTimes[0]);
                    timesArrayLeft.push(Date.now());
                    //console.log("BACKWARD");
                }
                else
                {
                    LeftLastIntervals.push(0);
                    timesArrayLeft.push(Date.now());
                    //console.log("STOP");
                }
            }
                    
            //timesArrayLeft.push(Date.now());
            //if (refreshClientGui == 1) {
            //    socket.emit("klientBeri1", {"vrednost": value, "cas": timesArrayLeft[timesArrayLeft.length - 1]});
            //}
        }
        
        //socket.emit("sporociloKlientu", "Flag 22 ->" + secondLeftFlag1);
        
    });
    
    board.digitalRead(LeftEncPin2, function(value) { // LEFT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        
        if (secondLeftFlag2 == value) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            //secondLeftFlag2++;
        }
        else
        {
            //console.log("       Pin LeftEncPin2 active " + Date.now() + " " + value + " " + secondLeftFlag2);
            secondLeftFlag2 = value;
            //console.log("       Code on pin 24 active");
            if(NumLastMeasuresLeft < 3)
            {
                LeftLastMeasures.unshift(2);
                LeftLastTimes.unshift(Date.now());
                NumLastMeasuresLeft++;
                LeftLastIntervals.push(0);
                timesArrayLeft.push(Date.now());
            }
            else
            {
                LeftLastMeasures.pop();
                LeftLastMeasures.unshift(2);
                LeftLastTimes.pop();
                LeftLastTimes.unshift(Date.now());
                //console.log("LeftLastMeasures pin 2 " + LeftLastMeasures[0] + LeftLastMeasures[1] + LeftLastMeasures[2]);
                if(LeftLastMeasures[0] == 1 && LeftLastMeasures[1] == 2 && LeftLastMeasures[2] == 3
                || LeftLastMeasures[0] == 2 && LeftLastMeasures[1] == 3 && LeftLastMeasures[2] == 1
                || LeftLastMeasures[0] == 3 && LeftLastMeasures[1] == 1 && LeftLastMeasures[2] == 2)
                {
                    LeftLastIntervals.push(LeftLastTimes[0] - LeftLastTimes[1]);
                    timesArrayLeft.push(Date.now());
                    ///console.log("FORWARD");
                }
                else if(LeftLastMeasures[0] == 3 && LeftLastMeasures[1] == 2 && LeftLastMeasures[2] == 1
                || LeftLastMeasures[0] == 1 && LeftLastMeasures[1] == 3 && LeftLastMeasures[2] == 2
                || LeftLastMeasures[0] == 2 && LeftLastMeasures[1] == 1 && LeftLastMeasures[2] == 3)
                {
                    LeftLastIntervals.push(LeftLastTimes[1] - LeftLastTimes[0]);
                    timesArrayLeft.push(Date.now());
                    //console.log("BACKWARD");
                }
                else
                {
                    LeftLastIntervals.push(0);
                    timesArrayLeft.push(Date.now());
                    //console.log("STOP");
                }
            }
                    
            //timesArrayLeft.push(Date.now());
            //if (refreshClientGui == 1) {
            //    socket.emit("klientBeri1", {"vrednost": value, "cas": timesArrayLeft[timesArrayLeft.length - 1]});
            //}
        }
        
        //socket.emit("sporociloKlientu", "Flag 24 ->" + secondLeftFlag2);
        
    });
    
    board.digitalRead(LeftEncPin3, function(value) { // LEFT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        
        if (secondLeftFlag3 == value) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            //secondLeftFlag3++;
        }
        else
        {
            //console.log("               Pin LeftEncPin3 active " + Date.now() + " " + value + " " + secondLeftFlag3);
            secondLeftFlag3 = value;
            //console.log("               Code on pin 26 active");
            if(NumLastMeasuresLeft < 3)
            {
                LeftLastMeasures.unshift(3);
                LeftLastTimes.unshift(Date.now());
                NumLastMeasuresLeft++;
                LeftLastIntervals.push(0);
                timesArrayLeft.push(Date.now());
            }
            else
            {
                LeftLastMeasures.pop();
                LeftLastMeasures.unshift(3);
                LeftLastTimes.pop();
                LeftLastTimes.unshift(Date.now());
                //console.log("LeftLastMeasures pin 3 " + LeftLastMeasures[0] + LeftLastMeasures[1] + LeftLastMeasures[2]);
                if(LeftLastMeasures[0] == 1 && LeftLastMeasures[1] == 2 && LeftLastMeasures[2] == 3
                || LeftLastMeasures[0] == 2 && LeftLastMeasures[1] == 3 && LeftLastMeasures[2] == 1
                || LeftLastMeasures[0] == 3 && LeftLastMeasures[1] == 1 && LeftLastMeasures[2] == 2)
                {
                    LeftLastIntervals.push(LeftLastTimes[0] - LeftLastTimes[1]);
                    timesArrayLeft.push(Date.now());
                    ///console.log("FORWARD");
                }
                else if(LeftLastMeasures[0] == 3 && LeftLastMeasures[1] == 2 && LeftLastMeasures[2] == 1
                || LeftLastMeasures[0] == 1 && LeftLastMeasures[1] == 3 && LeftLastMeasures[2] == 2
                || LeftLastMeasures[0] == 2 && LeftLastMeasures[1] == 1 && LeftLastMeasures[2] == 3)
                {
                    LeftLastIntervals.push(LeftLastTimes[1] - LeftLastTimes[0]);
                    timesArrayLeft.push(Date.now());
                    //console.log("BACKWARD");
                }
                else
                {
                    LeftLastIntervals.push(0);
                    timesArrayLeft.push(Date.now());
                    //console.log("STOP");
                }
            }
                    
            //timesArrayLeft.push(Date.now());
            //if (refreshClientGui == 1) {
            //    socket.emit("klientBeri1", {"vrednost": value, "cas": timesArrayLeft[timesArrayLeft.length - 1]});
            //}
        }
        
        //socket.emit("sporociloKlientu", "Flag 26 ->" + secondLeftFlag3);
        
    });
    
    
    board.digitalRead(RightEncPin1, function(value) { // RIGHT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        
        if (secondRightFlag1 == value) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            //secondRightFlag1++;
        }
        else
        {
            //console.log("Pin RightEncPin1 active " + Date.now() + " " + value + " " + secondRightFlag1);
            secondRightFlag1 = value;
            //console.log("Code on pin 22 active");
            if(NumLastMeasuresRight < 3)
            {
                RightLastMeasures.unshift(1);
                RightLastTimes.unshift(Date.now());
                NumLastMeasuresRight++;
                RightLastIntervals.push(0);
                timesArrayRight.push(Date.now());
            }
            else
            {
                RightLastMeasures.pop();
                RightLastMeasures.unshift(1);
                RightLastTimes.pop();
                RightLastTimes.unshift(Date.now());
                //console.log("RightLastMeasures pin 1 " + RightLastMeasures[0] + RightLastMeasures[1] + RightLastMeasures[2]);
                if(RightLastMeasures[0] == 1 && RightLastMeasures[1] == 2 && RightLastMeasures[2] == 3
                || RightLastMeasures[0] == 2 && RightLastMeasures[1] == 3 && RightLastMeasures[2] == 1
                || RightLastMeasures[0] == 3 && RightLastMeasures[1] == 1 && RightLastMeasures[2] == 2)
                {
                    RightLastIntervals.push(RightLastTimes[0] - RightLastTimes[1]);
                    timesArrayRight.push(Date.now());
                    ///console.log("FORWARD");
                }
                else if(RightLastMeasures[0] == 3 && RightLastMeasures[1] == 2 && RightLastMeasures[2] == 1
                || RightLastMeasures[0] == 1 && RightLastMeasures[1] == 3 && RightLastMeasures[2] == 2
                || RightLastMeasures[0] == 2 && RightLastMeasures[1] == 1 && RightLastMeasures[2] == 3)
                {
                    RightLastIntervals.push(RightLastTimes[1] - RightLastTimes[0]);
                    timesArrayRight.push(Date.now());
                    //console.log("BACKWARD");
                }
                else
                {
                    RightLastIntervals.push(0);
                    timesArrayRight.push(Date.now());
                    //console.log("STOP");
                }
            }
                    
            //timesArrayRight.push(Date.now());
            //if (refreshClientGui == 1) {
            //    socket.emit("klientBeri1", {"vrednost": value, "cas": timesArrayRight[timesArrayRight.length - 1]});
            //}
        }
        
        //socket.emit("sporociloKlientu", "Flag 22 ->" + secondRightFlag1);
        
    });
    
    board.digitalRead(RightEncPin2, function(value) { // Right funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        
        if (secondRightFlag2 == value) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            //secondRightFlag2++;
        }
        else
        {
            //console.log("       Pin RightEncPin2 active " + Date.now() + " " + value + " " + secondRightFlag2);
            secondRightFlag2 = value;
            //console.log("       Code on pin 24 active");
            if(NumLastMeasuresRight < 3)
            {
                RightLastMeasures.unshift(2);
                RightLastTimes.unshift(Date.now());
                NumLastMeasuresRight++;
                RightLastIntervals.push(0);
                timesArrayRight.push(Date.now());
            }
            else
            {
                RightLastMeasures.pop();
                RightLastMeasures.unshift(2);
                RightLastTimes.pop();
                RightLastTimes.unshift(Date.now());
                //console.log("RightLastMeasures pin 2 " + RightLastMeasures[0] + RightLastMeasures[1] + RightLastMeasures[2]);
                if(RightLastMeasures[0] == 1 && RightLastMeasures[1] == 2 && RightLastMeasures[2] == 3
                || RightLastMeasures[0] == 2 && RightLastMeasures[1] == 3 && RightLastMeasures[2] == 1
                || RightLastMeasures[0] == 3 && RightLastMeasures[1] == 1 && RightLastMeasures[2] == 2)
                {
                    RightLastIntervals.push(RightLastTimes[0] - RightLastTimes[1]);
                    timesArrayRight.push(Date.now());
                    ///console.log("FORWARD");
                }
                else if(RightLastMeasures[0] == 3 && RightLastMeasures[1] == 2 && RightLastMeasures[2] == 1
                || RightLastMeasures[0] == 1 && RightLastMeasures[1] == 3 && RightLastMeasures[2] == 2
                || RightLastMeasures[0] == 2 && RightLastMeasures[1] == 1 && RightLastMeasures[2] == 3)
                {
                    RightLastIntervals.push(RightLastTimes[1] - RightLastTimes[0]);
                    timesArrayRight.push(Date.now());
                    //console.log("BACKWARD");
                }
                else
                {
                    RightLastIntervals.push(0);
                    timesArrayRight.push(Date.now());
                    //console.log("STOP");
                }
            }
                    
            //timesArrayRight.push(Date.now());
            //if (refreshClientGui == 1) {
            //    socket.emit("klientBeri1", {"vrednost": value, "cas": timesArrayRight[timesArrayRight.length - 1]});
            //}
        }
        
        //socket.emit("sporociloKlientu", "Flag 24 ->" + secondRightFlag2);
        
    });
    
    board.digitalRead(RightEncPin3, function(value) { // Right funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        
        if (secondRightFlag3 == value) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            //secondRightFlag3++;
        }
        else
        {
            //console.log("               Pin RightEncPin3 active " + Date.now() + " " + value + " " + secondRightFlag3);
            secondRightFlag3 = value;
            //console.log("               Code on pin 26 active");
            if(NumLastMeasuresRight < 3)
            {
                RightLastMeasures.unshift(3);
                RightLastTimes.unshift(Date.now());
                NumLastMeasuresRight++;
                RightLastIntervals.push(0);
                timesArrayRight.push(Date.now());
            }
            else
            {
                RightLastMeasures.pop();
                RightLastMeasures.unshift(3);
                RightLastTimes.pop();
                RightLastTimes.unshift(Date.now());
                //console.log("RightLastMeasures pin 3 " + RightLastMeasures[0] + RightLastMeasures[1] + RightLastMeasures[2]);
                if(RightLastMeasures[0] == 1 && RightLastMeasures[1] == 2 && RightLastMeasures[2] == 3
                || RightLastMeasures[0] == 2 && RightLastMeasures[1] == 3 && RightLastMeasures[2] == 1
                || RightLastMeasures[0] == 3 && RightLastMeasures[1] == 1 && RightLastMeasures[2] == 2)
                {
                    RightLastIntervals.push(RightLastTimes[0] - RightLastTimes[1]);
                    timesArrayRight.push(Date.now());
                    ///console.log("FORWARD");
                }
                else if(RightLastMeasures[0] == 3 && RightLastMeasures[1] == 2 && RightLastMeasures[2] == 1
                || RightLastMeasures[0] == 1 && RightLastMeasures[1] == 3 && RightLastMeasures[2] == 2
                || RightLastMeasures[0] == 2 && RightLastMeasures[1] == 1 && RightLastMeasures[2] == 3)
                {
                    RightLastIntervals.push(RightLastTimes[1] - RightLastTimes[0]);
                    timesArrayRight.push(Date.now());
                    //console.log("BACKWARD");
                }
                else
                {
                    RightLastIntervals.push(0);
                    timesArrayRight.push(Date.now());
                    //console.log("STOP");
                }
            }
                    
            //timesArrayRight.push(Date.now());
            //if (refreshClientGui == 1) {
            //    socket.emit("klientBeri1", {"vrednost": value, "cas": timesArrayRight[timesArrayRight.length - 1]});
            //}
        }
        
        //socket.emit("sporociloKlientu", "Flag 26 ->" + secondRightFlag3);
        
    });
});

var fs  = require("fs");

var options = {
  key: fs.readFileSync('agent2-key.pem'),
  cert: fs.readFileSync('agent2-cert.pem')
};

var https = require("https").createServer(options, handler) // tu je pomemben argument "handler", ki je kasneje uporabljen -> "function handler (req, res); v tej vrstici kreiramo server! (http predstavlja napo aplikacijo - app)
  , io  = require("socket.io").listen(https, { log: false })
  , url = require("url");

send404 = function(res) {
    res.writeHead(404);
    res.write("404");
    res.end();
}

//process.setMaxListeners(0); 

//********************************************************************************************************
// Simple routing ****************************************************************************************
//********************************************************************************************************
function handler (req, res) { // handler za "response"; ta handler "handla" le datoteko index.html
    var path = url.parse(req.url).pathname; // parsamo pot iz url-ja
    
    switch(path) {
    
    case ('/') : // v primeru default strani

    fs.readFile(__dirname + "/dcmc_02.html",
    function (err, data) { // callback funkcija za branje tekstne datoteke
        if (err) {
            res.writeHead(500);
            return res.end("Napaka pri nalaganju strani pwmbutton...html");
        }
        
    res.writeHead(200);
    res.end(data);
    });
     
    case('/admin') :
               
    fs.readFile(__dirname + "/dcmc_admin_02.html",
    function (err, data) { // callback funkcija za branje tekstne datoteke
        if (err) {
            res.writeHead(500);
            return res.end("Napaka pri nalaganju strani admin...html");
        }
        
    res.writeHead(200);
    res.end(data);
    });
            
    case('/adminspeech') : // v primeru, da je v web naslovu na koncu napisano /zahvala
               
    fs.readFile(__dirname + "/dcmc_admin_speech_02.html",
    function (err, data) { // callback funkcija za branje tekstne datoteke
        if (err) {
            res.writeHead(500);
            return res.end("Napaka pri nalaganju strani admin...html");
        }
        
    res.writeHead(200);
    res.end(data);
    });        
            
    break;    
            
    default: send404(res);
            
    }
}
//********************************************************************************************************
//********************************************************************************************************
//********************************************************************************************************

https.listen(8080); // določimo na katerih vratih bomo poslušali | vrata 80 sicer uporablja LAMP | lahko določimo na "router-ju" (http je glavna spremenljivka, t.j. aplikacija oz. app)

console.log("Uporabite (S) httpS! - Zagon sistema - Uporabite (S) httpS!"); // na konzolo zapišemo sporočilo (v terminal)

var sendDataToClient = 1; // flag to send data to the client

var refreshFrequency = 50; // frequency of control algorithm refresh in ms

var STARTctrlFW = 0; // zastavica za zagon kontrolnega algortma za Naprej
var STARTctrlBK = 0; // zastavica za zagon kontrolnega algortma za Nazaj
var STARTctrlSpinL = 0; // zastavica za vklop kontrolnega algoritma SpinL
var STARTctrlSpinR = 0; // zastavica za izklop kontrolnega algoritma SpinR
var STARTctrlHzLRfw = 0; // zastavica za rotacijo koles naprej z različnimi frekvencami, npr. Levo = 10Hz, Desno = 5Hz 
var STARTctrlHzLRbk = 0; // zastavica za rotacijo koles nazaj z različnimi frekvencami, npr. Levo = 10Hz, Desno = 5Hz     

var upperLimitPWM = 65; // zgornja meja vrednosti PWM - le ta določa koliko lahko največ kontrolni algoritem pošlje na PWM    
var lowerLimitPWM = 0; // spodnja meja vrednosti PWM - le ta določa koliko lahko najmanj kontrolni algoritem pošlje na PWM    

var zelenaVrednostNaprej = 0;    
var zelenaVrednostNazaj = 0;

var zelenaVrednostSpinLevo = 0;    
var zelenaVrednostSpinDesno = 0;         

var zelenaVrednostHzLevo = 0;    
var zelenaVrednostHzDesno = 0;

var PWMfw = 0; // value for pin forward (pin 5)
var PWMbk = 0; // falue for pin backward (pin 6)
var PWMleft = 0; // value for pin left (pin 9)
var PWMright = 0; // value for pin right (pin 10)

var refreshClientGui = 1; // flag for refreshing values in client GUI

var arraySensor = new Array();
    arraySensor[0] = 0;
    arraySensor[1] = 0;
    arraySensor[2] = 0;
    arraySensor[3] = 0;
    arraySensor[4] = 0;
    arraySensor[5] = 0;
    arraySensor[6] = 0;
    arraySensor[7] = 0;
    arraySensor[8] = 0;
    arraySensor[9] = 0;

var ErrorLeft = new Array();
var IntegralCounterLeft = 0;
var ErrorRight = new Array();
var IntegralCounterRight = 0;
var SummInterval = 5;
var KpLeft = 0.1;
var KiLeft = 0.05;
var KdLeft = 0.8;
var KpRight = 0.1;
var KiRight = 0.05;
var KdRight = 0.8;
var LeftLastMeasures = new Array();
var LeftLastTimes = new Array();
var LeftLastIntervals = new Array();
var NumLastMeasuresLeft = 0;
var RightLastMeasures = new Array();
var RightLastTimes = new Array();
var RightLastIntervals = new Array();
var NumLastMeasuresRight = 0;

var secondLeftFlag1 = 0; // zastavica, da vemo, da sta iz LEVEGA enkoderja prišli vsaj dve vrednosti    
var secondLeftFlag2 = 0; // zastavica, da vemo, da sta iz LEVEGA enkoderja prišli vsaj dve vrednosti    
var secondLeftFlag3 = 0; // zastavica, da vemo, da sta iz LEVEGA enkoderja prišli vsaj dve vrednosti    
var secondRightFlag1 = 0; // zastavica, da vemo, da sta iz DESNEGA enkoderja prišli vsaj dve vrednosti    
var secondRightFlag2 = 0; // zastavica, da vemo, da sta iz DESNEGA enkoderja prišli vsaj dve vrednosti  
var secondRightFlag3 = 0; // zastavica, da vemo, da sta iz DESNEGA enkoderja prišli vsaj dve vrednosti  
 
var timePreviousLeft = Date.now(); // inicializiramo čas ob povezavi klienta
var timePreviousRight = timePreviousLeft;

var timesArrayLeft = new Array();
var timesArrayRight = new Array();

var LeftDistanceMade = 250000;
var RightDistanceMade = 250000;

function countValuesAndChopArrayLeft (timesArrayLeft, timeValue, LeftLastIntervals) {
// function counts the values in the timesArrayLeft that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayLeft must be defined as global variable should not lose time in between    

counter = 0;
var AvgInterval = 0;

for (i = 0; i < timesArrayLeft.length; i++) {
    if (timesArrayLeft[i] <= timeValue) {
        AvgInterval += LeftLastIntervals[i];
        counter++;
}
else {break;}
}
    
timesArrayLeft.splice(0, counter); // remove the values from 0, n=counter values
LeftLastIntervals.splice(0, counter);
  
if(counter != 0)
    return AvgInterval/counter;
else
    return 0;
//return counter; // function returns the number of occurences of times leess or equal to timeValue    

}

function countValuesAndChopArrayRight (timesArrayRight, timeValue, RightLastIntervals) {
// function counts the values in the timesArrayRight that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayRight must be defined as global variable should not lose time in between    

counter = 0;
var AvgInterval = 0;

for (i = 0; i < timesArrayRight.length; i++) {
    if (timesArrayRight[i] <= timeValue) {
        AvgInterval += RightLastIntervals[i];
        counter++;
}
else {break;}
}
    
timesArrayRight.splice(0, counter); // remove the values from 0, n=counter values
RightLastIntervals.splice(0, counter);
  
if(counter != 0)
    return AvgInterval/counter;
else
    return 0;
    
}

function frequencyMeasureAndControlLeftRight() {
    
    timeNextLeft = Date.now();
    timeNextRight = timeNextLeft;    
    numberOfCountsLeft = countValuesAndChopArrayLeft(timesArrayLeft, timeNextLeft, LeftLastIntervals); // number of counts up to current time within last second
    numberOfCountsRight = countValuesAndChopArrayRight(timesArrayRight, timeNextRight, RightLastIntervals); // number of counts up to current time within last second
    timeIntervalLeft = timeNextLeft - timePreviousLeft;
    timePreviousLeft = timeNextLeft;
    //frequencyLeft = numberOfCountsLeft/(timeIntervalLeft/1000);
    if(numberOfCountsLeft != 0)
        frequencyLeft = 1000/numberOfCountsLeft;
    else
        frequencyLeft = 0;
    
    timeIntervalRight = timeNextRight - timePreviousRight;
    timePreviousRight = timeNextRight;
    //frequencyRight = numberOfCountsRight/(timeIntervalRight/1000);    
    if(numberOfCountsRight != 0)
        frequencyRight = -1000/numberOfCountsRight;
    else
        frequencyRight = 0;
    
    LeftDistanceMade += frequencyLeft*timeIntervalLeft;
    RightDistanceMade += frequencyRight*timeIntervalRight;
    var DistRatioLeft = 1;
    var DistRatioRight = 1;
    if(RightDistanceMade != 0)
        DistRatioLeft = Math.abs(LeftDistanceMade / RightDistanceMade);
    if(LeftDistanceMade != 0)
        DistRatioRight = Math.abs(RightDistanceMade / LeftDistanceMade);
        
    // **************************************************************************************
    // Kontrolni algoritem ZAČETEK
    // **************************************************************************************

    // *************************************************************************
    // Del algoritma za naprej
    // *************************************************************************
    
    if (zelenaVrednostNazaj == 0 && STARTctrlFW == 1) { // le v primeru, da želene vrednosti v smeri nazaj nismo podali izvedemo algoritem za naprej

        //socket.emit("ukazArduinu", {"stevilkaUkaza": stevilkaUkaza, "pinNo": 5, "valuePWM": 1}); // za vsak primer pin naprej postavimo na 0
        console.log("želena naprej " + zelenaVrednostNaprej);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyLeft " + frequencyLeft);
        
        if((DistRatioLeft < 1.02 || DistRatioLeft > 0.98) && Math.abs(LeftDistanceMade) > 500000
        && (DistRatioRight < 1.02 || DistRatioRight > 0.98) && Math.abs(RightDistanceMade) > 500000)
        {
            LeftDistanceMade = LeftDistanceMade / 2;
            RightDistanceMade = RightDistanceMade / 2;
        }

        if(DistRatioLeft > 1.25)
            DistRatioLeft = 1.25;
        if(DistRatioRight > 1.25)
            DistRatioRight = 1.25;
        
        if(DistRatioLeft < 1)
            frequencyLeft = frequencyLeft * DistRatioLeft;
        if(DistRatioRight < 1)
            frequencyRight = frequencyRight * DistRatioRight;
        
        if(IntegralCounterLeft < SummInterval)
        {
            ErrorLeft.unshift(zelenaVrednostNaprej + frequencyLeft);
            IntegralCounterLeft++;
        }
        else
        {
            ErrorLeft.pop();
            ErrorLeft.unshift(zelenaVrednostNaprej + frequencyLeft);
        }
        //console.log("ErrorLeft[0] = " + ErrorLeft[0]);        
        if(IntegralCounterLeft = 1)
        {
            PWMleft += KiLeft*ErrorLeft[0];
        }
        else if(IntegralCounterLeft = 2)
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0];
        }
        else
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0] + KdLeft*(ErrorLeft[0] - 2*ErrorLeft[1] + ErrorLeft[2]);
        }
        console.log("PWMleft = " + PWMleft);
        if (PWMleft > upperLimitPWM) {
            PWMleft = upperLimitPWM;
        }
        else if(PWMleft < 0)
        {
            PWMleft = 0;
        }
        
        valuePWM = PWMleft;
        board.analogWrite(6, valuePWM);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        console.log("želena naprej " + zelenaVrednostNaprej);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyRight " + frequencyRight);
        if(IntegralCounterRight < SummInterval)
        {
            ErrorRight.unshift(zelenaVrednostNaprej + frequencyRight);
            IntegralCounterRight++;
        }
        else
        {
            ErrorRight.pop();
            ErrorRight.unshift(zelenaVrednostNaprej + frequencyRight);
        }
        //console.log("ErrorRight[0] = " + ErrorRight[0]);        
        if(IntegralCounterRight = 1)
        {
            PWMright += KiRight*ErrorRight[0];
        }
        else if(IntegralCounterRight = 2)
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0];
        }
        else
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0] + KdRight*(ErrorRight[0] - 2*ErrorRight[1] + ErrorRight[2]);
        }
        console.log("PWMright = " + PWMright);
        if (PWMright > upperLimitPWM) {
            PWMright = upperLimitPWM;
        }
        else if(PWMright < 0)
        {
            PWMright = 0;
        }
        
        valuePWM = PWMright;
        board.analogWrite(7, valuePWM);
        
    }
    
    // *****************************************************************************
    // Del algoritma za nazaj
    // *****************************************************************************
    
    else if (zelenaVrednostNaprej == 0 && STARTctrlBK == 1) {// // le v primeru, da želene vrednosti v smeri naprej nismo podali izvedemo algoritem za nazaj
        //socket.emit("ukazArduinu", {"stevilkaUkaza": stevilkaUkaza, "pinNo": 5, "valuePWM": 1}); // za vsak primer pin naprej postavimo na 0
        console.log("želena nazaj " + zelenaVrednostNazaj);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyLeft " + frequencyLeft);
        
        if((DistRatioLeft < 1.02 || DistRatioLeft > 0.98) && Math.abs(LeftDistanceMade) > 500000
        && (DistRatioRight < 1.02 || DistRatioRight > 0.98) && Math.abs(RightDistanceMade) > 500000)
        {
            LeftDistanceMade = LeftDistanceMade / 2;
            RightDistanceMade = RightDistanceMade / 2;
        }

        if(DistRatioLeft > 1.25)
            DistRatioLeft = 1.25;
        if(DistRatioRight > 1.25)
            DistRatioRight = 1.25;
        
        if(DistRatioLeft < 1)
            frequencyLeft = frequencyLeft * DistRatioLeft;
        if(DistRatioRight < 1)
            frequencyRight = frequencyRight * DistRatioRight;
        
        if(IntegralCounterLeft < SummInterval)
        {
            ErrorLeft.unshift(zelenaVrednostNazaj - frequencyLeft);
            IntegralCounterLeft++;
        }
        else
        {
            ErrorLeft.pop();
            ErrorLeft.unshift(zelenaVrednostNazaj - frequencyLeft);
        }
        //console.log("ErrorLeft[0] = " + ErrorLeft[0]);        
        if(IntegralCounterLeft = 1)
        {
            PWMleft += KiLeft*ErrorLeft[0];
        }
        else if(IntegralCounterLeft = 2)
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0];
        }
        else
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0] + KdLeft*(ErrorLeft[0] - 2*ErrorLeft[1] + ErrorLeft[2]);
        }
        console.log("PWMleft = " + PWMleft);
        if (PWMleft > upperLimitPWM) {
            PWMleft = upperLimitPWM;
        }
        else if(PWMleft < 0)
        {
            PWMleft = 0;
        }
        
        valuePWM = PWMleft;
        board.analogWrite(6, valuePWM);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        console.log("želena nazaj " + zelenaVrednostNazaj);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyRight " + frequencyRight);
        if(IntegralCounterRight < SummInterval)
        {
            ErrorRight.unshift(zelenaVrednostNazaj - frequencyRight);
            IntegralCounterRight++;
        }
        else
        {
            ErrorRight.pop();
            ErrorRight.unshift(zelenaVrednostNazaj - frequencyRight);
        }
        //console.log("ErrorRight[0] = " + ErrorRight[0]);        
        if(IntegralCounterRight = 1)
        {
            PWMright += KiRight*ErrorRight[0];
        }
        else if(IntegralCounterRight = 2)
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0];
        }
        else
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0] + KdRight*(ErrorRight[0] - 2*ErrorRight[1] + ErrorRight[2]);
        }
        console.log("PWMright = " + PWMright);
        if (PWMright > upperLimitPWM) {
            PWMright = upperLimitPWM;
        }
        else if(PWMright < 0)
        {
            PWMright = 0;
        }
        
        valuePWM = PWMright;
        board.analogWrite(7, valuePWM);
        
            
    }
    
    
    // *************************************************************************
    // Del algoritma za SpinLEFT
    // *************************************************************************
    
    if (zelenaVrednostSpinDesno == 0 && STARTctrlSpinL == 1) { // le v primeru, da želene vrednosti v smeri SpinDesno nismo podali izvedemo algoritem za SpinLevo
    
        //socket.emit("ukazArduinu", {"stevilkaUkaza": stevilkaUkaza, "pinNo": 5, "valuePWM": 1}); // za vsak primer pin naprej postavimo na 0
        console.log("želena Spin Desno " + zelenaVrednostSpinLevo);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyLeft " + frequencyLeft);
        
        if((DistRatioLeft < 1.02 || DistRatioLeft > 0.98) && Math.abs(LeftDistanceMade) > 500000
        && (DistRatioRight < 1.02 || DistRatioRight > 0.98) && Math.abs(RightDistanceMade) > 500000)
        {
            LeftDistanceMade = LeftDistanceMade / 2;
            RightDistanceMade = RightDistanceMade / 2;
        }

        if(DistRatioLeft > 1.25)
            DistRatioLeft = 1.25;
        if(DistRatioRight > 1.25)
            DistRatioRight = 1.25;
        
        if(DistRatioLeft < 1)
            frequencyLeft = frequencyLeft * DistRatioLeft;
        if(DistRatioRight < 1)
            frequencyRight = frequencyRight * DistRatioRight;
        
        if(IntegralCounterLeft < SummInterval)
        {
            ErrorLeft.unshift(zelenaVrednostSpinLevo - frequencyLeft);
            IntegralCounterLeft++;
        }
        else
        {
            ErrorLeft.pop();
            ErrorLeft.unshift(zelenaVrednostSpinLevo - frequencyLeft);
        }
        //console.log("ErrorLeft[0] = " + ErrorLeft[0]);        
        if(IntegralCounterLeft = 1)
        {
            PWMleft += KiLeft*ErrorLeft[0];
        }
        else if(IntegralCounterLeft = 2)
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0];
        }
        else
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0] + KdLeft*(ErrorLeft[0] - 2*ErrorLeft[1] + ErrorLeft[2]);
        }
        console.log("PWMleft = " + PWMleft);
        if (PWMleft > upperLimitPWM) {
            PWMleft = upperLimitPWM;
        }
        else if(PWMleft < 0)
        {
            PWMleft = 0;
        }
        
        valuePWM = PWMleft;
        board.analogWrite(6, valuePWM);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        console.log("želena naprej " + zelenaVrednostSpinLevo);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyRight " + frequencyRight);
        if(IntegralCounterRight < SummInterval)
        {
            ErrorRight.unshift(zelenaVrednostSpinLevo + frequencyRight);
            IntegralCounterRight++;
        }
        else
        {
            ErrorRight.pop();
            ErrorRight.unshift(zelenaVrednostSpinLevo + frequencyRight);
        }
        //console.log("ErrorRight[0] = " + ErrorRight[0]);        
        if(IntegralCounterRight = 1)
        {
            PWMright += KiRight*ErrorRight[0];
        }
        else if(IntegralCounterRight = 2)
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0];
        }
        else
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0] + KdRight*(ErrorRight[0] - 2*ErrorRight[1] + ErrorRight[2]);
        }
        console.log("PWMright = " + PWMright);
        if (PWMright > upperLimitPWM) {
            PWMright = upperLimitPWM;
        }
        else if(PWMright < 0)
        {
            PWMright = 0;
        }
        
        valuePWM = PWMright;
        board.analogWrite(7, valuePWM);
        
    }
    
    // *****************************************************************************
    // Del algoritma za SpinRIGHT
    // *****************************************************************************
    
    else if (zelenaVrednostSpinLevo == 0 && STARTctrlSpinR == 1) { // le v primeru, da želene vrednosti v smeri SpinLevo nismo podali izvedemo algoritem za SpinDesno
    
        //socket.emit("ukazArduinu", {"stevilkaUkaza": stevilkaUkaza, "pinNo": 5, "valuePWM": 1}); // za vsak primer pin naprej postavimo na 0
        console.log("želena naprej " + zelenaVrednostSpinDesno);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyLeft " + frequencyLeft);
        
        if((DistRatioLeft < 1.02 || DistRatioLeft > 0.98) && Math.abs(LeftDistanceMade) > 500000
        && (DistRatioRight < 1.02 || DistRatioRight > 0.98) && Math.abs(RightDistanceMade) > 500000)
        {
            LeftDistanceMade = LeftDistanceMade / 2;
            RightDistanceMade = RightDistanceMade / 2;
        }

        if(DistRatioLeft > 1.25)
            DistRatioLeft = 1.25;
        if(DistRatioRight > 1.25)
            DistRatioRight = 1.25;
        
        if(DistRatioLeft < 1)
            frequencyLeft = frequencyLeft * DistRatioLeft;
        if(DistRatioRight < 1)
            frequencyRight = frequencyRight * DistRatioRight;
        
        if(IntegralCounterLeft < SummInterval)
        {
            ErrorLeft.unshift(zelenaVrednostSpinDesno + frequencyLeft);
            IntegralCounterLeft++;
        }
        else
        {
            ErrorLeft.pop();
            ErrorLeft.unshift(zelenaVrednostSpinDesno + frequencyLeft);
        }
        //console.log("ErrorLeft[0] = " + ErrorLeft[0]);        
        if(IntegralCounterLeft = 1)
        {
            PWMleft += KiLeft*ErrorLeft[0];
        }
        else if(IntegralCounterLeft = 2)
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0];
        }
        else
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0] + KdLeft*(ErrorLeft[0] - 2*ErrorLeft[1] + ErrorLeft[2]);
        }
        console.log("PWMleft = " + PWMleft);
        if (PWMleft > upperLimitPWM) {
            PWMleft = upperLimitPWM;
        }
        else if(PWMleft < 0)
        {
            PWMleft = 0;
        }
        
        valuePWM = PWMleft;
        board.analogWrite(6, valuePWM);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        console.log("želena naprej " + zelenaVrednostSpinDesno);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyRight " + frequencyRight);
        if(IntegralCounterRight < SummInterval)
        {
            ErrorRight.unshift(zelenaVrednostSpinDesno - frequencyRight);
            IntegralCounterRight++;
        }
        else
        {
            ErrorRight.pop();
            ErrorRight.unshift(zelenaVrednostSpinDesno - frequencyRight);
        }
        //console.log("ErrorRight[0] = " + ErrorRight[0]);        
        if(IntegralCounterRight = 1)
        {
            PWMright += KiRight*ErrorRight[0];
        }
        else if(IntegralCounterRight = 2)
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0];
        }
        else
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0] + KdRight*(ErrorRight[0] - 2*ErrorRight[1] + ErrorRight[2]);
        }
        console.log("PWMright = " + PWMright);
        if (PWMright > upperLimitPWM) {
            PWMright = upperLimitPWM;
        }
        else if(PWMright < 0)
        {
            PWMright = 0;
        }
        
        valuePWM = PWMright;
        board.analogWrite(7, valuePWM);
    
    }
    
    // *************************************************************************
    // Del algoritma za Hz naprej
    // *************************************************************************
    
    if (STARTctrlHzLRfw == 1) { // če je zastavica 1 izvedemo ta del algoritma
        //socket.emit("ukazArduinu", {"stevilkaUkaza": stevilkaUkaza, "pinNo": 5, "valuePWM": 1}); // za vsak primer pin naprej postavimo na 0
        console.log("želena naprej " + zelenaVrednostHzLevo);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyLeft " + frequencyLeft);
        
        if((DistRatioLeft < 1.02 || DistRatioLeft > 0.98) && Math.abs(LeftDistanceMade) > 500000
        && (DistRatioRight < 1.02 || DistRatioRight > 0.98) && Math.abs(RightDistanceMade) > 500000)
        {
            LeftDistanceMade = LeftDistanceMade / 2;
            RightDistanceMade = RightDistanceMade / 2;
        }

        if(DistRatioLeft > 1.25)
            DistRatioLeft = 1.25;
        if(DistRatioRight > 1.25)
            DistRatioRight = 1.25;
        
        DistRatioRight *= zelenaVrednostHzLevo / zelenaVrednostHzDesno;
        DistRatioLeft *= zelenaVrednostHzDesno / zelenaVrednostHzLevo;
        
        if(DistRatioLeft < 1)
            frequencyLeft = frequencyLeft * DistRatioLeft;
        if(DistRatioRight < 1)
            frequencyRight = frequencyRight * DistRatioRight;
        
        if(IntegralCounterLeft < SummInterval)
        {
            ErrorLeft.unshift(zelenaVrednostHzLevo + frequencyLeft);
            IntegralCounterLeft++;
        }
        else
        {
            ErrorLeft.pop();
            ErrorLeft.unshift(zelenaVrednostHzLevo + frequencyLeft);
        }
        //console.log("ErrorLeft[0] = " + ErrorLeft[0]);        
        if(IntegralCounterLeft = 1)
        {
            PWMleft += KiLeft*ErrorLeft[0];
        }
        else if(IntegralCounterLeft = 2)
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0];
        }
        else
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0] + KdLeft*(ErrorLeft[0] - 2*ErrorLeft[1] + ErrorLeft[2]);
        }
        console.log("PWMleft = " + PWMleft);
        if (PWMleft > upperLimitPWM) {
            PWMleft = upperLimitPWM;
        }
        else if(PWMleft < 0)
        {
            PWMleft = 0;
        }
        
        valuePWM = PWMleft;
        board.analogWrite(6, valuePWM);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        console.log("želena naprej " + zelenaVrednostHzDesno);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyRight " + frequencyRight);
        if(IntegralCounterRight < SummInterval)
        {
            ErrorRight.unshift(zelenaVrednostHzDesno + frequencyRight);
            IntegralCounterRight++;
        }
        else
        {
            ErrorRight.pop();
            ErrorRight.unshift(zelenaVrednostHzDesno + frequencyRight);
        }
        //console.log("ErrorRight[0] = " + ErrorRight[0]);        
        if(IntegralCounterRight = 1)
        {
            PWMright += KiRight*ErrorRight[0];
        }
        else if(IntegralCounterRight = 2)
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0];
        }
        else
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0] + KdRight*(ErrorRight[0] - 2*ErrorRight[1] + ErrorRight[2]);
        }
        console.log("PWMright = " + PWMright);
        if (PWMright > upperLimitPWM) {
            PWMright = upperLimitPWM;
        }
        else if(PWMright < 0)
        {
            PWMright = 0;
        }
        
        valuePWM = PWMright;
        board.analogWrite(7, valuePWM);
        
    }
    
    
    // *****************************************************************************
    // Del algoritma za Hz nazaj
    // *****************************************************************************
    
    else if (STARTctrlHzLRbk == 1) {// če je zastavica za ta del algoritma 1 ga izvedemo
        
        //socket.emit("ukazArduinu", {"stevilkaUkaza": stevilkaUkaza, "pinNo": 5, "valuePWM": 1}); // za vsak primer pin naprej postavimo na 0
        console.log("želena naprej " + zelenaVrednostHzLevo);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyLeft " + frequencyLeft);
        
        if((DistRatioLeft < 1.02 || DistRatioLeft > 0.98) && Math.abs(LeftDistanceMade) > 500000
        && (DistRatioRight < 1.02 || DistRatioRight > 0.98) && Math.abs(RightDistanceMade) > 500000)
        {
            LeftDistanceMade = LeftDistanceMade / 2;
            RightDistanceMade = RightDistanceMade / 2;
        }

        if(DistRatioLeft > 1.25)
            DistRatioLeft = 1.25;
        if(DistRatioRight > 1.25)
            DistRatioRight = 1.25;
        
        DistRatioLeft *= zelenaVrednostHzLevo / zelenaVrednostHzDesno;
        DistRatioRight *= zelenaVrednostHzDesno / zelenaVrednostHzLevo;
        
        if(IntegralCounterLeft < SummInterval)
        {
            ErrorLeft.unshift(zelenaVrednostHzLevo - frequencyLeft);
            IntegralCounterLeft++;
        }
        else
        {
            ErrorLeft.pop();
            ErrorLeft.unshift(zelenaVrednostHzLevo - frequencyLeft);
        }
        //console.log("ErrorLeft[0] = " + ErrorLeft[0]);        
        if(IntegralCounterLeft = 1)
        {
            PWMleft += KiLeft*ErrorLeft[0];
        }
        else if(IntegralCounterLeft = 2)
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0];
        }
        else
        {
            PWMleft += KpLeft*(ErrorLeft[0] - ErrorLeft[1]) + KiLeft*ErrorLeft[0] + KdLeft*(ErrorLeft[0] - 2*ErrorLeft[1] + ErrorLeft[2]);
        }
        console.log("PWMleft = " + PWMleft);
        if (PWMleft > upperLimitPWM) {
            PWMleft = upperLimitPWM;
        }
        else if(PWMleft < 0)
        {
            PWMleft = 0;
        }
        
        valuePWM = PWMleft;
        board.analogWrite(6, valuePWM);
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        console.log("želena naprej " + zelenaVrednostHzDesno);
        console.log("ctrl BK " + STARTctrlBK);
        console.log("frequencyRight " + frequencyRight);
        if(IntegralCounterRight < SummInterval)
        {
            ErrorRight.unshift(zelenaVrednostHzDesno - frequencyRight);
            IntegralCounterRight++;
        }
        else
        {
            ErrorRight.pop();
            ErrorRight.unshift(zelenaVrednostHzDesno - frequencyRight);
        }
        //console.log("ErrorRight[0] = " + ErrorRight[0]);        
        if(IntegralCounterRight = 1)
        {
            PWMright += KiRight*ErrorRight[0];
        }
        else if(IntegralCounterRight = 2)
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0];
        }
        else
        {
            PWMright += KpRight*(ErrorRight[0] - ErrorRight[1]) + KiRight*ErrorRight[0] + KdRight*(ErrorRight[0] - 2*ErrorRight[1] + ErrorRight[2]);
        }
        console.log("PWMright = " + PWMright);
        if (PWMright > upperLimitPWM) {
            PWMright = upperLimitPWM;
        }
        else if(PWMright < 0)
        {
            PWMright = 0;
        }
        
        valuePWM = PWMright;
        board.analogWrite(7, valuePWM);
        
    }
    
    // **************************************************************************************
    // Kontrolni algoritem KONEC
    // **************************************************************************************      
}
    
var frequencyMeasureAndControlLeftRightTimer=setInterval(function(){frequencyMeasureAndControlLeftRight()}, refreshFrequency); 
 


io.sockets.on("connection", function(socket) {  // od oklepaja ( dalje imamo argument funkcije on -> ob 'connection' se prenese argument t.j. funkcija(socket) 
                                                // ko nekdo pokliče IP preko "browser-ja" ("browser" pošlje nekaj node.js-u) se vzpostavi povezava = "connection" oz.
                                                // je to povezava = "connection" oz. to smatramo kot "connection"
                                                // v tem primeru torej želi client nekaj poslati (ko nekdo z browserjem dostopi na naš ip in port)
                                                // ko imamo povezavo moramo torej izvesti funkcijo: function (socket)
                                                // pri tem so argument podatki "socket-a" t.j. argument = socket
                                                // ustvari se socket_id
    
// Senzorji imajo prioriteto / sensor    
/*    
    board.analogRead(0, function(value) {
        
        arraySensor.splice(0,1); // na mestu 0 v polju odrežemo eno vrednost
        arraySensor[9] = value; // na koncu jo dodamo
        
        sum = arraySensor.reduce(function(a, b) { return a + b; }); // vsota polja
        averageSensor = sum / 10; // povprečje polja

	if (refreshClientGui == 1) {        
        	socket.emit("klientBeri3", {"vrednost": averageSensor});
	}
        
        if (averageSensor > 81) { 
            
            STARTctrlFW = 0; // zastavica za zagon kontrolnega algortma za Naprej
            STARTctrlBK = 1; // zastavica za zagon kontrolnega algortma za Nazaj -> da lahko damo komando nazaj in se nazaj tudi pomaknemo
            STARTctrlSpinL = 0; // zastavica za vklop kontrolnega algoritma SpinL
            STARTctrlSpinR = 0; // zastavica za izklop kontrolnega algoritma SpinR
            STARTctrlHzLRfw = 0; // zastavica za rotacijo koles naprej z različnimi frekvencami, npr. Levo = 10Hz, Desno = 5Hz 
            STARTctrlHzLRbk = 0; // zastavica za rotacijo koles nazaj z različnimi frekvencami, npr. Levo = 10Hz, Desno = 5Hz
            
            //board.digitalWrite(3, board.LOW); // na pinu 3 zapišemo vrednost LOW
            //board.digitalWrite(12, board.LOW); // na pinu 3 zapišemo vrednost LOW
            board.analogWrite(5, 0); // Naprej
            //board.analogWrite(6, 0); // Nazaj
            board.analogWrite(9, 0); // Levo
            board.analogWrite(10, 0); // Desno
            
            zelenaVrednostNaprej = 0;    
            zelenaVrednostNazaj = 0;
    
            zelenaVrednostSpinLevo = 0;    
            zelenaVrednostSpinDesno = 0;         
    
            zelenaVrednostHzLevo = 0;    
            zelenaVrednostHzDesno = 0;
         
        }

    }); 
*/
    

    
    
    
    
    socket.emit("sporociloKlientu", Date.now()); // izvedemo funkcijo = "hello" na klientu, z argumentom, t.j. podatki="Strežnik povezan."

	socket.on("ukazArduinu", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        if (data.stevilkaUkaza == "1") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 1
            board.digitalWrite(12, board.HIGH); // na pinu 12 zapišemo vrednost HIGH
            board.analogWrite(6, 150); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            console.log("ana6=" + "150");
            //board.analogWrite(6, pwmValue2); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            
            
            
            socket.emit("sporociloKlientu", "LED prižgana."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED prižgana."
        }
        else if (data.stevilkaUkaza == "0") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 0
            board.digitalWrite(3, board.LOW); // na pinu 12 zapišemo vrednost LOW
            //board.analogWrite(6, 0); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            socket.emit("sporociloKlientu", "LED ugasnjena."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED ugasnjena."
        }
        else if (data.stevilkaUkaza == "2") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 2
            if (data.valuePWM != 0) { // če PWM vrednost ni 0 vklopimo rele
                board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
                board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
            }
            //else { // če je PWM vrednost enaka 0 izklopimo rele
            //    board.digitalWrite(3, board.LOW); // na pinu 3 zapišemo vrednost LOW
            //}
            board.analogWrite(data.pinNo, data.valuePWM); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            console.log("pinNO=" + data.pinNo + " | " + "valuePWM = " + data.valuePWM);
            socket.emit("sporociloKlientu", "PWM Custom."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED ugasnjena."
        }
        
        else if (data.stevilkaUkaza == "3") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 0
            if (data.valuePWM != 0) { // če PWM vrednost ni 0 vklopimo rele
                board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
            }
            //else { // če je PWM vrednost enaka 0 izklopimo rele
            //    board.digitalWrite(3, board.LOW); // na pinu 3 zapišemo vrednost LOW
            //    board.digitalWrite(12, board.LOW); // na pinu 3 zapišemo vrednost LOW
            //}
            board.analogWrite(data.pinNo, data.valuePWM); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            console.log("pinNO=" + data.pinNo + " | " + "valuePWM = " + data.valuePWM);
            socket.emit("sporociloKlientu", "PWM Custom."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED ugasnjena."
        }        
        
	});
    
    
    socket.on("commandToArduinoFW", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 100;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 0; 
        zelenaVrednostHzDesno = 0;
        
        PWMfw = 0; // value for pin forward (pin 5)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
        
        LeftDistanceMade = -250000;
        RightDistanceMade = -250000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.HIGH); // na pinu 2 LEFT zapišemo vrednost LOW - direction forward
        board.digitalWrite(4, board.LOW); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction forward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) {
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlFW = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    });
    
    socket.on("commandToArduinoBK", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 100;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 0; 
        zelenaVrednostHzDesno = 0;
        
        PWMfw = 0; // value for pin forward (pin 5)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
        
        LeftDistanceMade = 250000;
        RightDistanceMade = 250000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.LOW); // na pinu 2 zapišemo vrednost LOW - direction backward
        board.digitalWrite(4, board.HIGH); // na pinu 4 zapišemo vrednost HIGH - direction backward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 12 zapišemo vrednost HIGH
        
        //board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        //board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        //board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) { 
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlBK = 1; // zastavico za STARTctrlBK dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
        console.log("bk ctrl: " + STARTctrlBK);
        
	
    });
    
    socket.on("commandToArduinoSpinL", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 100; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 0; 
        zelenaVrednostHzDesno = 0;
        
        PWMfw = 0; // value for pin forward (pin 7)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
        
        LeftDistanceMade = 250000;
        RightDistanceMade = -250000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.LOW); // na pinu 2 LEFT zapišemo vrednost LOW - direction backward
        board.digitalWrite(4, board.LOW); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction forward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) { 
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlSpinL = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    });
    
socket.on("commandToArduinoSpinR", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 100;
        zelenaVrednostHzLevo = 0; 
        zelenaVrednostHzDesno = 0;
        
        PWMfw = 0; // value for pin forward (pin 7)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
    
        LeftDistanceMade = -250000;
        RightDistanceMade = 250000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.HIGH); // na pinu 2 LEFT zapišemo vrednost LOW - direction forward
        board.digitalWrite(4, board.HIGH); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction backward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) { 
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlSpinR = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    });
    
    socket.on("commandToArduinoTurnFwLeftL5R10", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 50; 
        zelenaVrednostHzDesno = 100;
        
        PWMfw = 0; // value for pin forward (pin 5)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
        
        LeftDistanceMade = -250000;
        RightDistanceMade = -500000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.HIGH); // na pinu 2 LEFT zapišemo vrednost LOW - direction forward
        board.digitalWrite(4, board.LOW); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction forward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) { 
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlHzLRfw = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    });   
    
     socket.on("commandToArduinoTurnFwRightL10R5", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 100; 
        zelenaVrednostHzDesno = 50;
        
        PWMfw = 0; // value for pin forward (pin 5)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
         
        LeftDistanceMade = -500000;
        RightDistanceMade = -250000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.HIGH); // na pinu 2 LEFT zapišemo vrednost LOW - direction forward
        board.digitalWrite(4, board.LOW); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction forward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
         if (refreshClientGui == 1) {
         socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
         });
         }

        STARTctrlHzLRfw = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    }); 
    
     socket.on("commandToArduinoTurnBkLeftL5R10", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 50; 
        zelenaVrednostHzDesno = 100;
        
        PWMfw = 0; // value for pin forward (pin 5)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
         
        LeftDistanceMade = 500000;
        RightDistanceMade = 250000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.LOW); // na pinu 2 LEFT zapišemo vrednost LOW - direction backward
        board.digitalWrite(4, board.HIGH); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction backward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) { 
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlHzLRbk = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    }); 
    
     socket.on("commandToArduinoTurnBkRightL10R5", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        STARTctrlFW = 0; // control flag for ForWard part of the control algorithm
        STARTctrlBK = 0; // similar
        STARTctrlSpinL = 0;
        STARTctrlSpinR = 0;
        STARTctrlHzLRfw = 0;
        STARTctrlHzLRbk = 0;

        zelenaVrednostNaprej = 0;
        zelenaVrednostNazaj = 0;
        zelenaVrednostSpinLevo = 0; 
        zelenaVrednostSpinDesno = 0;
        zelenaVrednostHzLevo = 100; 
        zelenaVrednostHzDesno = 50;
        
        PWMfw = 0; // value for pin forward (pin 5)
        PWMbk = 0; // falue for pin backward (pin 6)
        PWMleft = 0; // value for pin left (pin 9)
        PWMright = 0; // value for pin right (pin 10)
         
        LeftDistanceMade = 250000;
        RightDistanceMade = 500000;
        
        // we switch on the relay and LED indicator
        board.digitalWrite(2, board.LOW); // na pinu 2 LEFT zapišemo vrednost LOW - direction backward
        board.digitalWrite(4, board.HIGH); // na pinu 4 RIGHT zapišemo vrednost HIGH - direction backward
        board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        board.digitalWrite(12, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
        
        board.analogWrite(5, PWMfw); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(6, PWMbk); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(9, PWMleft); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(10, PWMright); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        
        if (refreshClientGui == 1) { 
         socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }

        STARTctrlHzLRbk = 1; // zastavico za STARTctrlFW dvignemo, kontrolni algoritem lahko prične z delom, vse nastavitve zgoraj so vnešene
	
    }); 
        
	socket.on("ukazArduinuSTOP", function() {
        STARTctrlFW = 0; // zastavica za zagon kontrolnega algortma za Naprej
        STARTctrlBK = 0; // zastavica za zagon kontrolnega algortma za Nazaj
        STARTctrlSpinL = 0; // zastavica za vklop kontrolnega algoritma SpinL
        STARTctrlSpinR = 0; // zastavica za izklop kontrolnega algoritma SpinR
        STARTctrlHzLRfw = 0; // zastavica za rotacijo koles naprej z različnimi frekvencami, npr. Levo = 10Hz, Desno = 5Hz 
        STARTctrlHzLRbk = 0; // zastavica za rotacijo koles nazaj z različnimi frekvencami, npr. Levo = 10Hz, Desno = 5Hz
        
        board.digitalWrite(3, board.LOW); // na pinu 3 zapišemo vrednost LOW
        board.digitalWrite(12, board.LOW); // na pinu 12 zapišemo vrednost LOW
        board.analogWrite(5, 0); // Naprej
        board.analogWrite(6, 0); // Nazaj
        board.analogWrite(7, 0); // Nazaj
        board.analogWrite(9, 0); // Levo
        board.analogWrite(10, 0); // Desno
        
        zelenaVrednostNaprej = 0;    
        zelenaVrednostNazaj = 0;
    
        zelenaVrednostSpinLevo = 0;    
        zelenaVrednostSpinDesno = 0;         
    
        zelenaVrednostHzLevo = 0;    
        zelenaVrednostHzDesno = 0;
        PWMleft = 0;
        PWMright = 0;
        PWMfw = 0;
        PWMbk = 0;
        
        LeftDistanceMade = 0;
        RightDistanceMade = 0;
        
        if (refreshClientGui == 1) { 
        socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
        });
        }
        
    });
    
    
                      
    
    

    //},1);
    
//}, 500); // digitalno branje poženemo šele čez pol sekunde zaradi pr        
        
    //analog read RIGHT:
    

    
//    board.analogRead(2, function(value) {
//        socket.emit("klientBeri2", value);
//    });
   
function ControlAndDisplayLeftRight() {
    

    socket.emit("sporociloKlientu", "No->" + numberOfCountsLeft);
    socket.emit("sporociloKlientu", "Time interval->" + timeIntervalLeft + "Freq->" + frequencyLeft);

    socket.emit("sporociloKlientu", "No->" + numberOfCountsRight);
    socket.emit("sporociloKlientu", "Time interval->" + timeIntervalRight + "Freq->" + frequencyRight);
    
    socket.emit("readOutFrequencyLeftRight", {"leftCount": numberOfCountsLeft, "frequencyLeft": frequencyLeft, "rightCount": numberOfCountsRight, "frequencyRight": frequencyRight});
    
        
    
    
    
    socket.emit("readOutControlLeftRight", {"PWMleft": PWMleft, "PWMright": PWMright});
 
    if (refreshClientGui == 1) {
    socket.emit("refreshClientGUInumValues", {
            "zelenaVrednostNaprej": zelenaVrednostNaprej,
            "zelenaVrednostNazaj": zelenaVrednostNazaj,
            "zelenaVrednostSpinLevo": zelenaVrednostSpinLevo, 
            "zelenaVrednostSpinDesno": zelenaVrednostSpinDesno,
            "zelenaVrednostHzLevo": zelenaVrednostHzLevo, 
            "zelenaVrednostHzDesno": zelenaVrednostHzDesno,
            "PWMfw": PWMfw,
            "PWMbk": PWMbk,
            "PWMleft": PWMleft,
            "PWMright": PWMright,
            "LeftDistanceMade": LeftDistanceMade,
            "RightDistanceMade": RightDistanceMade,
    });
    }
    
}
    
var ControlAndDisplayLeftRightTimer=setInterval(function(){ControlAndDisplayLeftRight()}, refreshFrequency);        
    
});