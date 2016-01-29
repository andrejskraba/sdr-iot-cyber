var http = require("http").createServer(handler) // tu je pomemben argument "handler", ki je kasneje uporabljen -> "function handler (req, res); v tej vrstici kreiramo server! (http predstavlja napo aplikacijo - app)
  , io  = require("socket.io").listen(http)
  , fs  = require("fs");

function handler (req, res) { // handler za "response"; ta handler "handla" le datoteko index.html
    fs.readFile(__dirname + "/pwm_motor_test_01.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            return res.end("Napaka pri nalaganju datoteke pwmbutton_01.html");
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
	board.pinMode(12, board.MODES.OUTPUT);
    board.pinMode(2, board.MODES.OUTPUT);
    board.pinMode(5, board.MODES.PWM);
    board.pinMode(6, board.MODES.PWM);
});

io.sockets.on("connection", function(socket) {  // od oklepaja ( dalje imamo argument funkcije on -> ob 'connection' se prenese argument t.j. funkcija(socket) 
                                                // ko nekdo pokliče IP preko "browser-ja" ("browser" pošlje nekaj node.js-u) se vzpostavi povezava = "connection" oz.
                                                // je to povezava = "connection" oz. to smatramo kot "connection"
                                                // v tem primeru torej želi client nekaj poslati (ko nekdo z browserjem dostopi na naš ip in port)
                                                // ko imamo povezavo moramo torej izvesti funkcijo: function (socket)
                                                // pri tem so argument podatki "socket-a" t.j. argument = socket
                                                // ustvari se socket_id
    socket.emit("sporociloKlientu", "Strežnik povezan."); // izvedemo funkcijo = "hello" na klientu, z argumentom, t.j. podatki="Strežnik povezan."

    socket.on("directionAndPWM", function(data) {
        console.log("digitalPinNo=" + data.digitalPinNo + " | " + "valueDigitalPin = " + data.valueDigitalPin);
        console.log("pinNo=" + data.PWMpinNo + " | " + "valuePWM = " + data.valuePWM);
        if (data.valueDigitalPin == 0) {
            board.digitalWrite(2, 0);
        }
        else if (data.valueDigitalPin == 1) {
                board.digitalWrite(2, 1);
        }
        
        
        //board.digitalWrite(data.digitalPinNo, data.valueDigitalPin);
        //board.digitalWrite(2, 0);
        //board.analogWrite(5, 20); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        board.analogWrite(data.PWMpinNo, data.valuePWM); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        console.log("digitalPinNo=" + data.digitalPinNo + " | " + "valueDigitalPin = " + data.valueDigitalPin);
        console.log("pinNo=" + data.PWMpinNo + " | " + "valuePWM = " + data.valuePWM);
        socket.emit("sporociloKlientu", "PWM + digital vrednosti prejeti na strežniku."); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED prižgana."
    
	});
    
    socket.on("stop", function() {
        board.analogWrite(5, 0); // tretji argument je lahko tudi callback - za funkcijo, ki jo kličemo po izvedbi
        socket.emit("sporociloKlientu", "stop"); // izvedemo to funkcijo = "sporociloKlientu" na klientu, z argumentom, t.j. podatki="LED prižgana."
    
	});    
    

});