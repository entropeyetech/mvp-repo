var five = require("johnny-five");                        // inclusione librerie framework JS Johnny-Five
var Edison = require("edison-io");                        // inclusione librerie board Intel Edison per Johnny-Five
var LCD = require('jsupm_i2clcd');                        // inclusione libreria Grove LCD RGB BackLight
var ultrasensor = require('jsupm_groveultrasonic');       // inclusione libreria UPM Grove UltraSonic Sensor
var piezosensor = require('jsupm_ldt0028');               // inclusione libreria UPM Grove Piezo Vibration Sensor
var Bot = require('node-telegram-bot');                   // inclusione libreria Telegram Bot per NodeJS
var fs = require('fs');                                   // file stream per bot.sendVideo


var board = new five.Board({
    io: new Edison()
});

var MyLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
var MyUltrasensor = new ultrasensor.GroveUltraSonic(5);
var MyPiezosensor = new piezosensor.LDT0028(3);

var authorized_users = [
  17892141,346001737
];

var bot = new Bot({
  token: '513219619:AAF-y7hwivlH4_UwvL3b7Ph8NUnI0ml7GMc'
});

bot.on('message', function (message) {
parseMessage (message);
});

bot.start();
console.log("BOT ready!");

MyLcd.setCursor(0,0);
MyLcd.setColor(0,0,0);

board.on("ready", function(){
    this.pinMode(3, five.Pin.INPUT);
    this.pinMode(2, five.Pin.OUTPUT);
    this.pinMode(4, five.Pin.OUTPUT);
    this.pinMode(8, five.Pin.OUTPUT);
    this.digitalRead(3, function(value){
    var positionCounter;
    for (positionCounter = 0; positionCounter < 29; positionCounter++) {
    if (value==1){
        console.log("Collisione");
        this.digitalWrite(2,1);
        this.digitalWrite(4,0);
        this.digitalWrite(8,1);
        MyLcd.setCursor(0,0);
        MyLcd.setColor(255,0,0);
        MyLcd.write('Collisione');
        bot.on('message', function(message) {
        bot.sendMessage ({
        chat_id: message.chat.id,
        text: 'La tua autovettura targata AA000AA è stata collisa',
        }); 
        });
        }
        else {
        this.digitalWrite(2,0);
        this.digitalWrite(4,1);
        this.digitalWrite(8,0);
        MyLcd.clear();
        MyLcd.setCursor(0,0);
        MyLcd.setColor(0,0,0);
        }
        }
    });

var myInterval = setInterval(function()
{
  var travelTime = MyUltrasensor.getDistance();
  if (travelTime > 0) {
    var distance = (travelTime / 29 / 2).toFixed(2);
    var distancefloat = parseInt(distance);
    console.log("Distanza: " + distancefloat + " cm");
    MyLcd.setCursor(0,0);
    MyLcd.setColor(0,0,255);
    MyLcd.write("Distanza:" + distancefloat + " cm");
    var positionCounter; 
    for (positionCounter = 0; positionCounter < 29; positionCounter++) {
    if (distancefloat<=10){
    console.log("Avvio camera");
    MyLcd.setCursor(0,0);
    MyLcd.setColor(255,0,0);
    MyLcd.write('  Avvio camera  ');
    bot.on('message', function(message) {
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'SmartTARGA Security Video System è attivo e sta riprendendo',
    }); 
    });
    } 
    }
    }
},100);

process.on('SIGINT', function()
{
  clearInterval(myInterval);
  console.log("Exiting...");
  process.exit(0);
});
});

function parseMessage(message) {
switch(true) {
    case  message.text == '/start' :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'Ciao e benvenuto nel ChatBot di SmartTARGA',
    }); break;
    
    case  message.text == '/infostato' :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'SmartTARGA è attivo',
    }); break;
     
    case message.text == "/infoalert" :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'La tua autovettura targata AA000AA è stata collisa 5 minuti fa. Per foto(/infofoto), per video(/infovideo)',
    }); break;
    
    case message.text == "/infofoto" :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'E presente una foto non vista in memoria: per invio richedi /inviofoto' ,
    }); break;
    
    case message.text == "/infovideo" :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'E presente un video non visto in memoria: per invio richedi /inviovideo' ,
    }); break;
    
    case message.text == "/inviofoto" :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'SmartTARGA sta per inviarti una foto',
    }); 
    bot.sendPhoto ({
    chat_id: message.chat.id,
    caption: 'Questo è quello che è accaduto alla tua macchina',
    files: {
    photo: '/home/root/node_modules/smarttarga/multimedia/polo.jpg'
    }
    }); break;
    
    case message.text == "/inviovideo" :
    bot.sendMessage ({
    chat_id: message.chat.id,
    text: 'SmartTARGA sta per inviarti un video',
    }); 
    bot.sendVideo ({
    chat_id: message.chat.id,
    caption: 'Questo è quello che è accaduto alla tua macchina',
    files: {
    filename: '/home/root/node_modules/smarttarga/multimedia/polo.mp4',
    stream: fs.createReadStream('/home/root/node_modules/smarttarga/multimedia/polo.mp4'),
    }
    }); break;
    }
}

function isAuthorized(userid) {

  for(i = 0; i < authorized_users.length; i++)
    if(authorized_users[i] == userid) return true;

  return false;
}