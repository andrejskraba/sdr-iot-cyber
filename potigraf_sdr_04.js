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


setInterval(function(){board.analogWrite(5, 0);}, 5000);