var http = require('http').createServer(handler);
var io = require('socket.io').listen(http),
fs = require('fs'),
firmata = require('firmata');

var BoardStartedFlag = 0;

var board = new firmata.Board("/dev/ttyACM0",function(){
    console.log("Priključitev na Arduino");
    console.log("Firmware: " + board.firmware.name + "-" + board.firmware.version.major + "." + board.firmware.version.minor); // izpišemo verzijo Firmware
    console.log("Omogočimo pine");
	board.pinMode(12, board.MODES.OUTPUT);
    console.log("Pin 12 OK");
    board.pinMode(2, board.MODES.OUTPUT);
    console.log("Pin 2 OK");
    board.pinMode(5, board.MODES.PWM);
    console.log("Pin 5 OK");
    board.pinMode(6, board.MODES.PWM);
    console.log("Pin 6 OK");
    BoardStartedFlag = 1;
    console.log("Flag 1");
    startControlAlgorithm();
});






//board = new firmata.Board('/dev/ttyACM0', arduinoReady);



var desiredValue = 0;
var actualValue  = 0;



var analogPin = 0; // pozor Analog Pin in ne digital RX->
var analogPin2 = 5; // pozor Analog Pin in ne digital RX->

function arduinoReady(err) {
if (err) {
console.log(err);
return;
}
console.log('Firmware: ' + board.firmware.name
+ '-' + board.firmware.version.major
+ '.' + board.firmware.version.minor);


}

http.listen(8080, "192.168.3.205");
console.log("Listening on http://193.2.123.25:8080...");

// directs page requests to html files

function handler (req, res) {
fs.readFile(__dirname + '/potigraf_sdr_06.html',
function (err, data) {
if (err) {
res.writeHead(500);
return res.end('Error loading index.html');
}

res.writeHead(200);
res.end(data);
});
}


function controlAlgorithm () {
    
            console.log("desired: " + desiredValue);
            console.log("actual: " + actualValue);
    
        if (desiredValue < actualValue) {
            pwm = (Math.abs((desiredValue - actualValue)) / 1024) * 100;
            if (pwm > 100) {
                pwm = 100;
            }
            board.digitalWrite(2, 0);
            board.analogWrite(5, pwm);
        }
        else if (desiredValue > actualValue) {
            pwm = (Math.abs((desiredValue - actualValue)) / 1024) * 100;
            if (pwm > 100) { 
                pwm = 100;
            }
            board.digitalWrite(2, 1);
            board.analogWrite(5, pwm);
        }
        else { // v tem primeru je zadeva enaka
            board.analogWrite(5, 0); // tret    
        }
}

if (BoardStartedFlag == 1) {
    
    console.log("*******************************************************************");
    console.log("*******************************************************************");
    console.log("*******************************************************************");
    console.log("*******************************************************************");
    console.log("*******************************************************************");

    var controlAlgorithmTimer=setInterval(function(){controlAlgorithm()}, 150);  

}


// this handles socket.io comm from html files

io.sockets.on('connection', function(socket) {
    
    //var controlAlgorithmTimer=setInterval(function(){controlAlgorithm()}, 150);  
    
    console.log("boardFlag:" + BoardStartedFlag);

    socket.send('connected...');

    //analog read:
    board.analogRead(analogPin, function(value) {
        desiredValue = value;
        socket.emit("klientBeri", value);
        if (value > 300) {
             board.digitalWrite(8, board.HIGH);
        }
        else if (value <= 300 && value > 100) {
             board.digitalWrite(7, board.HIGH);
        }
        else {
        board.digitalWrite(7, board.LOW);            
        board.digitalWrite(8, board.LOW);
        
        }
        
        
        
    });
    
    board.analogRead(analogPin2, function(value) {
        actualValue = value;
        console.log("boardFlag:" + BoardStartedFlag);
        socket.emit("klientBeri2", value);
    });    

    socket.on('disconnect', function() {
        socket.send('disconnected...');
    });

});

console.log("Pred funkcijo");

function startControlAlgorithm() {

if (BoardStartedFlag == 1) {

    var timerTest = setInterval(function(){ controlAlgorithm(); }, 150);
    console.log("Na funkciji");

};
}

// setTimeout(function(){ setInterval(function(){ controlAlgorithm(); }, 150); }, 5000);



