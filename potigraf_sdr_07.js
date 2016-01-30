var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var fs = require('fs');
var firmata = require('firmata');

var board = new firmata.Board("/dev/ttyACM0",function(){
    board.pinMode(2, board.MODES.OUTPUT);
    board.pinMode(3, board.MODES.PWM);
    board.pinMode(0, board.MODES.ANALOG);
    board.pinMode(1, board.MODES.ANALOG);
    startControlAlgorithm();
});

var desiredValue = 0;
var actualValue  = 0;

http.listen(8080, "192.168.3.205");
console.log("Listening on http://193.2.123.25:8080...");

// directs page requests to html files

function handler (req, res) {
    fs.readFile(__dirname + '/potigraf_sdr_07.html',
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
    
        if (desiredValue < actualValue) {
            pwm = (Math.abs((desiredValue - actualValue)) / 1024) * 100;
            if (pwm > 100) {
                pwm = 100;
            }
            board.digitalWrite(2, 0);
            board.analogWrite(3, pwm);
        }
        else if (desiredValue > actualValue) {
            pwm = (Math.abs((desiredValue - actualValue)) / 1024) * 100;
            if (pwm > 100) { 
                pwm = 100;
            }
            board.digitalWrite(2, 1);
            board.analogWrite(3, pwm);
        }
        else { // v tem primeru je zadeva enaka
            board.analogWrite(3, 0);
        }
}

// this handles socket.io comm from html files

io.sockets.on('connection', function(socket) {

    socket.send('connected...');

    board.analogRead(0, function(value) {
        desiredValue = value;
        socket.emit("klientBeri", value);
    });

    board.analogRead(1, function(value) {
        actualValue = value;
        socket.emit("klientBeri2", value);
    });    

    socket.on('disconnect', function() {
        socket.send('disconnected...');
    });

});

function startControlAlgorithm() {
    var timerTest = setInterval(function(){ controlAlgorithm(); }, 150);
}