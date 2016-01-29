var http = require('http').createServer(handler);
var io = require('socket.io').listen(http),
fs = require('fs'),
firmata = require('firmata');
board = new firmata.Board('/dev/ttyACM0', arduinoReady);





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
fs.readFile(__dirname + '/potigraf_sdr_01.html',
function (err, data) {
if (err) {
res.writeHead(500);
return res.end('Error loading index.html');
}

res.writeHead(200);
res.end(data);
});
}

// this handles socket.io comm from html files

io.sockets.on('connection', function(socket) {

    socket.send('connected...');

    //analog read:
    board.analogRead(analogPin, function(value) {
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
        socket.emit("klientBeri2", value);
    });    

    socket.on('disconnect', function() {
        socket.send('disconnected...');
    });

});