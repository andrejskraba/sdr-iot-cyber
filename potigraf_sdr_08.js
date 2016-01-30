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
var factor = 0.1; // factor is determined as (desiredValue - actualValue)/1023; both, desiredValue and actualValue could have values between 0 and 1023; therefore value of term "(desiredValue - actualValue)/1023" could be between 0 and 1 this factor, between 0 and 1 is then multiplied by 100, which would mean, that the output to the PWM pin 3 would be between 0 and 100 (97.75=100/1023) ~ factor determines, how fast, the system will achieve it's desired value

http.listen(8080, "192.168.3.205");
console.log("Listening on http://193.2.123.25:8080...");

// directs page requests to html files

function handler (req, res) {
    fs.readFile(__dirname + '/potigraf_sdr_08.html',
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
    
        pwm = factor*(desiredValue - actualValue);
        if (pwm < 0) {board.digitalWrite(2, 0)}; // determine the direction of motor rotation ~ H-bridge logical switch
        if (pwm > 0) {board.digitalWrite(2, 1)}; // determine the direction of motor rotation ~ H-bridge logical switch
        board.analogWrite(3, Math.abs(pwm)); // set the analog pin to the absolute value of the term factor*(desiredValue - actualValue)

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