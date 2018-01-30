var five = require("johnny-five");                        // inclusione librerie framework JS Johnny-Five
var Edison = require("edison-io");                        // inclusione librerie board Intel Edison per Johnny-Five
var ultrasensor = require('jsupm_groveultrasonic');       // inclusione libreria UPM Grove UltraSonic Sensor
var piezosensor = require('jsupm_ldt0028');               // inclusione libreria UPM Grove Piezo Vibration Sensor

var board = new five.Board({
    io: new Edison()
});

var MyUltrasensor = new ultrasensor.GroveUltraSonic(7);
var MyPiezosensor = new piezosensor.LDT0028(4);

board.on("ready", function(){
    this.pinMode(4, five.Pin.INPUT);
    this.digitalRead(4, function(value){
        if (value===1){
            console.log("Probabile Collisione");
        }
    });
});
var myInterval = setInterval(function()
{
  var travelTime = MyUltrasensor.getDistance();
  if (travelTime > 0) {
    var distance = (travelTime / 29 / 2).toFixed(3);
    var distancefloat = parseInt(distance);
    console.log("Distanza: " + distancefloat + " cm");
    if (distancefloat<=10){
    console.log("Avvio camera");
      }
  }
}, 100);

process.on('SIGINT', function()
{
  clearInterval(myInterval);
  console.log("Exiting...");
  process.exit(0);
});