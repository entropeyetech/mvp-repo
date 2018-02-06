var five = require("johnny-five");                        // inclusione librerie framework JS Johnny-Five
var Edison = require("edison-io");                        // inclusione librerie board Intel Edison per Johnny-Five
var LCD = require('jsupm_i2clcd');                        // inclusione libreria Grove LCD RGB BackLight
var ultrasensor = require('jsupm_groveultrasonic');       // inclusione libreria UPM Grove UltraSonic Sensor
var piezosensor = require('jsupm_ldt0028');               // inclusione libreria UPM Grove Piezo Vibration Sensor

var board = new five.Board({
    io: new Edison()
});

var MyLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
var MyUltrasensor = new ultrasensor.GroveUltraSonic(5);
var MyPiezosensor = new piezosensor.LDT0028(3);

MyLcd.setCursor(0,0);
MyLcd.setColor(0,0,0);

board.on("ready", function(){
    this.pinMode(3, five.Pin.INPUT);
    this.pinMode(2, five.Pin.OUTPUT);
    this.pinMode(4, five.Pin.OUTPUT);
    this.pinMode(8, five.Pin.OUTPUT);
    this.digitalRead(3, function(value){
    var positionCounter;
        for (positionCounter = 0; positionCounter <29; positionCounter++) {
        if (value==1){
            console.log("Collisione");
        this.digitalWrite(2,1);
        this.digitalWrite(4,0);
        this.digitalWrite(8,1);
        MyLcd.setCursor(0,0);
        MyLcd.setColor(255,0,0);
        MyLcd.write('Collisione');
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
