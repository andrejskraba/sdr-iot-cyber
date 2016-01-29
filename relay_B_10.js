/*********************************************************************        
University of Maribor ************************************************
Faculty of Organizational Sciences ***********************************
Cybernetics & Decision Support Systems Laboratory ********************
@author Andrej Škraba ************************************************
@author Andrej Koložvari**********************************************
@author Davorin Kofjač ***********************************************
*********************************************************************/

var http = require("http").createServer(handler) // tu je pomemben argument "handler", ki je kasneje uporabljen -> "function handler (req, res); v tej vrstici kreiramo server! (http predstavlja napo aplikacijo - app)
  , io  = require("socket.io").listen(http)
  , fs  = require("fs");

function handler (req, res) { // handler za "response"; ta handler "handla" le datoteko index.html
    fs.readFile(__dirname + "/relay_B_10.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            return res.end("Napaka pri nalaganju datoteke relay_B_10.html");
        }
    res.writeHead(200);
    res.end(data);
    });
}

http.listen(8080); // določimo na katerih vratih bomo poslušali | vrata 80 sicer uporablja LAMP | lahko določimo na "router-ju" (http je glavna spremenljivka, t.j. aplikacija oz. app)

var firmata = require("firmata");

console.log("Zagon sistema"); // na konzolo zapišemo sporočilo (v terminal)

var board = new firmata.Board("/dev/ttyACM0",function(){
    console.log("Priključitev na Arduino");
    console.log("Firmware: " + board.firmware.name + "-" + board.firmware.version.major + "." + board.firmware.version.minor); // izpišemo verzijo Firmware
    console.log("Omogočimo pine");
	board.pinMode(22, board.MODES.INPUT); // LEFT digital pin from encoder L1
    board.pinMode(24, board.MODES.INPUT); // LEFT digital pin from encoder L2
    board.pinMode(26, board.MODES.INPUT); // LEFT digital pin from encoder L3
    board.pinMode(52, board.MODES.INPUT); // RIGHT digital pin from encoder
    board.pinMode(3, board.MODES.OUTPUT);
    board.pinMode(5, board.MODES.PWM);
    board.pinMode(6, board.MODES.PWM);
    board.pinMode(9, board.MODES.PWM);
    board.pinMode(10, board.MODES.PWM);    
});


// var timePrevious = Date.now();

function countValuesAndChopArrayLeft1 (timesArrayLeft1, timeValue) {
// function counts the values in the timesArrayLeft1 that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayLeft1 must be defined as global variable not to lose time in between    

counter = 0;

for (i = 0; i < timesArrayLeft1.length; i++) {
    if (timesArrayLeft1[i] <= timeValue) {
        counter++;
}
else {break;}
}
    
timesArrayLeft1.splice(0, counter); // remove the values from 0, n=counter values
    
return counter; // function returns the number of occurences of times leess or equal to timeValue    

}

function countValuesAndChopArrayLeft2 (timesArrayLeft2, timeValue) {
// function counts the values in the timesArrayLeft2 that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayLeft1 must be defined as global variable not to lose time in between    

counter = 0;

for (i = 0; i < timesArrayLeft2.length; i++) {
    if (timesArrayLeft2[i] <= timeValue) {
        counter++;
}
else {break;}
}
    
timesArrayLeft2.splice(0, counter); // remove the values from 0, n=counter values
    
return counter; // function returns the number of occurences of times leess or equal to timeValue    

}

function countValuesAndChopArrayLeft3 (timesArrayLeft3, timeValue) {
// function counts the values in the timesArrayLeft3 that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayLeft1 must be defined as global variable not to lose time in between    

counter = 0;

for (i = 0; i < timesArrayLeft3.length; i++) {
    if (timesArrayLeft3[i] <= timeValue) {
        counter++;
}
else {break;}
}
    
timesArrayLeft3.splice(0, counter); // remove the values from 0, n=counter values
    
return counter; // function returns the number of occurences of times leess or equal to timeValue    

}




function countValuesAndChopArrayLeft (timesArrayLeft, timeValue) {
// function counts the values in the timesArrayLeft that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayLeft must be defined as global variable not to lose time in between    

counter = 0;

for (i = 0; i < timesArrayLeft.length; i++) {
    if (timesArrayLeft[i] <= timeValue) {
        counter++;
}
else {break;}
}
    
timesArrayLeft.splice(0, counter); // remove the values from 0, n=counter values
    
return counter; // function returns the number of occurences of times leess or equal to timeValue    

}

function countValuesAndChopArrayRight (timesArrayRight, timeValue) {
// function counts the values in the timesArrayLeft that are less or equal to timeValue and chops them out
// function returns chopped array and number of occurences
// timesArrayLeft must be defined as global variable not to lose time in between    

counter = 0;

for (i = 0; i < timesArrayRight.length; i++) {
    if (timesArrayRight[i] <= timeValue) {
        counter++;
}
else {break;}
}
    
timesArrayRight.splice(0, counter); // remove the values from 0, n=counter values
    
return counter; // function returns the number of occurences of times leess or equal to timeValue    

}


io.sockets.on("connection", function(socket) {  // od oklepaja ( dalje imamo argument funkcije on -> ob 'connection' se prenese argument t.j. funkcija(socket) 
                                                // ko nekdo pokliče IP preko "browser-ja" ("browser" pošlje nekaj node.js-u) se vzpostavi povezava = "connection" oz.
                                                // je to povezava = "connection" oz. to smatramo kot "connection"
                                                // v tem primeru torej želi client nekaj poslati (ko nekdo z browserjem dostopi na naš ip in port)
                                                // ko imamo povezavo moramo torej izvesti funkcijo: function (socket)
                                                // pri tem so argument podatki "socket-a" t.j. argument = socket
                                                // ustvari se socket_id
    var timePreviousLeft = Date.now(); // inicializiramo čas ob povezavi klienta
    var timePreviousRight = timePreviousLeft;
    
    //var leftCount = 0;
    //var rightCount = 0;

    var timesArrayLeft1 = new Array();
    var timesArrayLeft1 = []; // ob povezavi klienta matriko brišemo    
    var timesArrayLeft2 = new Array();
    var timesArrayLeft2 = []; // ob povezavi klienta matriko brišemo        
    var timesArrayLeft3 = new Array();
    var timesArrayLeft3 = []; // ob povezavi klienta matriko brišemo            
    
    var timesArrayLeft = new Array();
    var timesArrayLeft = []; // ob povezavi klienta matriko brišemo
    
    var timesArrayRight = new Array();
    var timesArrayRight = []; // ob povezavi klienta matriko brišemo    
    
    var secondLeftFlag1 = 0; // zastavica, da vemo, da sta iz LEVEGA_1 enkoderja prišli vsaj dve vrednosti        
    var secondLeftFlag2 = 0; // zastavica, da vemo, da sta iz LEVEGA_2 enkoderja prišli vsaj dve vrednosti            
    var secondLeftFlag3 = 0; // zastavica, da vemo, da sta iz LEVEGA_3 enkoderja prišli vsaj dve vrednosti                
    
    var secondLeftFlag = 0; // zastavica, da vemo, da sta iz LEVEGA enkoderja prišli vsaj dve vrednosti
    var secondRightFlag = 0; // zastavica, da vemo, da sta iz DESNEGA enkoderja prišli vsaj dve vrednosti    
    
    
    
    socket.emit("sporociloKlientu", Date.now()); // izvedemo funkcijo = "hello" na klientu, z argumentom, t.j. podatki="Strežnik povezan."
    
	socket.on("ukazArduinu", function(data) { // ko je socket ON in je posredovan preko connection-a: ukazArduinu (t.j. ukaz: išči funkcijo ukazArduinu)
        if (data.stevilkaUkaza == "1") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 1
            board.digitalWrite(12, board.HIGH); // na pinu 13 zapišemo vrednost HIGH
            console.log("Solenoid ON");
            //board.analogWrite(6, pwmValue2); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            
            
            
            socket.emit("sporociloKlientu", "Solenoid ON."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED prižgana."
        }
        else if (data.stevilkaUkaza == "0") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 0
            board.digitalWrite(12, board.LOW); // na pinu 13 zapišemo vrednost LOW
            //board.analogWrite(6, 0); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            console.log("Solenoid OFF");
            socket.emit("sporociloKlientu", "Solenoid OFF."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED ugasnjena."
        }
        else if (data.stevilkaUkaza == "2") { // če je številka ukaza, ki smo jo dobili iz klienta enaka 2
            if (data.valuePWM != 0) { // če PWM vrednost ni 0 vklopimo rele
                board.digitalWrite(3, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
                board.digitalWrite(13, board.HIGH); // na pinu 3 zapišemo vrednost HIGH
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
            //    board.digitalWrite(13, board.LOW); // na pinu 3 zapišemo vrednost LOW
            //}
            board.analogWrite(data.pinNo, data.valuePWM); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
            console.log("pinNO=" + data.pinNo + " | " + "valuePWM = " + data.valuePWM);
            socket.emit("sporociloKlientu", "PWM Custom."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED ugasnjena."
        }        
        
	});
    
	socket.on("ukazArduinuSTOP", function() {
        board.digitalWrite(3, board.LOW); // na pinu 3 zapišemo vrednost LOW
        board.analogWrite(5, 0); // Naprej
        board.analogWrite(6, 0); // Nazaj
        board.analogWrite(9, 0); // Levo
        board.analogWrite(10, 0); // Desno
    });
    
    
    board.digitalRead(22, function(value) { // LEFT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        if (secondLeftFlag1 < 1) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            secondLeftFlag1++;     // pod hall senzorjem je lahko magnet postavljen tako, da senzor vrne 1; to bi pomenilo, da bi ob vklopu iz "default" vrednosti 0 na digitalnem pinu preklopil na 1
        }
        else
        {
        timesArrayLeft1.push(Date.now());
        socket.emit("klientBeriL1", {"vrednost": value, "cas": timesArrayLeft1[timesArrayLeft1.length - 1]});
        }
        
        socket.emit("sporociloKlientu", "Flag LEFT 1 ->" + secondLeftFlag1);
        
    });
    
board.digitalRead(24, function(value) { // LEFT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        if (secondLeftFlag2 < 1) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            secondLeftFlag2++;     // pod hall senzorjem je lahko magnet postavljen tako, da senzor vrne 1; to bi pomenilo, da bi ob vklopu iz "default" vrednosti 0 na digitalnem pinu preklopil na 1
        }
        else
        {
        timesArrayLeft2.push(Date.now());
        socket.emit("klientBeriL2", {"vrednost": value, "cas": timesArrayLeft2[timesArrayLeft2.length - 1]});
        }
        
        socket.emit("sporociloKlientu", "Flag LEFT 2 ->" + secondLeftFlag2);
        
    });
    
board.digitalRead(26, function(value) { // LEFT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        if (secondLeftFlag3 < 1) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            secondLeftFlag3++;     // pod hall senzorjem je lahko magnet postavljen tako, da senzor vrne 1; to bi pomenilo, da bi ob vklopu iz "default" vrednosti 0 na digitalnem pinu preklopil na 1
        }
        else
        {
        timesArrayLeft3.push(Date.now());
        socket.emit("klientBeriL3", {"vrednost": value, "cas": timesArrayLeft3[timesArrayLeft3.length - 1]});
        }
        
        socket.emit("sporociloKlientu", "Flag LEFT 3 ->" + secondLeftFlag3);
        
    });    
        
    
    board.digitalRead(52, function(value) { // RIGHT funkcija se aktivira le, kadar se spremeni stanje; sicer bi bilo 1M čitanj na sekundo
        if (secondRightFlag < 1) { // ta del rabimo, da se ne zgodi, da nam ob vklopu, ko kolesa mirujejo digitalRead prebere 1 - kolo sicer miruje (enko vedno prebre) in bi nato narobe preračunali frekvenco 1/0.5=2 V resnici kolo miruje. Prvi preračun lahko naredimo le, ko se pojavi naslednja vrednost
            secondRightFlag++;
        }
        else
        {
        timesArrayRight.push(Date.now());
        socket.emit("klientBeri2", {"vrednost": value, "cas": timesArrayRight[timesArrayRight.length - 1]});
        }
        
        socket.emit("sporociloKlientu", "Flag RIGHT ->" + secondRightFlag);
        
    });
    
    
    //},1);
    
//}, 500); // digitalno branje poženemo šele čez pol sekunde zaradi pr        
        
    //analog read RIGHT:
    

    
//    board.analogRead(2, function(value) {
//        socket.emit("klientBeri2", value);
//    });
    
    
    
function frequencyMeasureLeft() {
    
    timeNextLeft = Date.now();
    numberOfCountsLeft = countValuesAndChopArrayLeft(timesArrayLeft, timeNextLeft); // number of counts up to current time within last second
    timeIntervalLeft = timeNextLeft - timePreviousLeft;
    timePreviousLeft = timeNextLeft;
    frequencyLeft = numberOfCountsLeft/(timeIntervalLeft/1000);
    
    socket.emit("sporociloKlientu", "No->" + numberOfCountsLeft);
    socket.emit("sporociloKlientu", "Time interval->" + timeIntervalLeft + "Freq->" + frequencyLeft);
    
    socket.emit("readOutFrequencyLeft", {"stevilo": numberOfCountsLeft, "frekvenca": frequencyLeft});
    
}
    
function frequencyMeasureRight() {
    
    timeNextRight = Date.now();
    numberOfCountsRight = countValuesAndChopArrayRight(timesArrayRight, timeNextRight); // number of counts up to current time within last second
    timeIntervalRight = timeNextRight - timePreviousRight;
    timePreviousRight = timeNextRight;
    frequencyRight = numberOfCountsRight/(timeIntervalRight/1000);
    
    socket.emit("sporociloKlientu", "No->" + numberOfCountsRight);
    socket.emit("sporociloKlientu", "Time interval->" + timeIntervalRight + "Freq->" + frequencyRight);
    
    socket.emit("readOutFrequencyRight", {"stevilo": numberOfCountsRight, "frekvenca": frequencyRight});
    
}
    
function frequencyMeasureLeftRight() {
    
    timeNextLeft = Date.now();
    timeNextRight = timeNextLeft;    
    numberOfCountsLeft = countValuesAndChopArrayLeft(timesArrayLeft1, timeNextLeft); // number of counts up to current time within last second
    numberOfCountsRight = countValuesAndChopArrayRight(timesArrayRight, timeNextRight); // number of counts up to current time within last second
    timeIntervalLeft = timeNextLeft - timePreviousLeft;
    timePreviousLeft = timeNextLeft;
    frequencyLeft = numberOfCountsLeft/(timeIntervalLeft/1000);
    
    timeIntervalRight = timeNextRight - timePreviousRight;
    timePreviousRight = timeNextRight;
    frequencyRight = numberOfCountsRight/(timeIntervalRight/1000);    
    
    socket.emit("sporociloKlientu", "No->" + numberOfCountsLeft);
    socket.emit("sporociloKlientu", "Time interval->" + timeIntervalLeft + "Freq->" + frequencyLeft);

    socket.emit("sporociloKlientu", "No->" + numberOfCountsRight);
    socket.emit("sporociloKlientu", "Time interval->" + timeIntervalRight + "Freq->" + frequencyRight);
    
    socket.emit("readOutFrequencyLeftRight", {"leftCount": numberOfCountsLeft, "frequencyLeft": frequencyLeft, "rightCount": numberOfCountsRight, "frequencyRight": frequencyRight});
    
    
}    
    
    
    
//var frequencyMeasureLeftTimer=setInterval(function(){frequencyMeasureLeft()}, 500);
//var frequencyMeasureRightTimer=setInterval(function(){frequencyMeasureRight()}, 500);
    
var frequencyMeasureLeftRightTimer=setInterval(function(){frequencyMeasureLeftRight()}, 500);        
    
});
