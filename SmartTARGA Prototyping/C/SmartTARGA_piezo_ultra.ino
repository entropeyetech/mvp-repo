#include "Ultrasonic.h" 
#include "Arduino.h"
#include "rgb_lcd.h"

int ledred = 2;
int ledgreen = 3;
int ledblue = 6;
int buzzer = 4;
const int piezo = 5;
const int triggerPort = 9;
const int echoPort = 10;
rgb_lcd lcd;
const int colorR = 255;
const int colorG = 0;
const int colorB = 0;
const int colorR1 = 0;
const int colorG1 = 255;
const int colorB1 = 0;
const int colorR2 = 0;
const int colorG2 = 0;
const int colorB2 = 255;

Ultrasonic ultrasonic(9,10);


void setup()
{
  lcd.begin(16,2);
  pinMode(ledgreen,OUTPUT);
  pinMode(ledred,OUTPUT);
  pinMode(ledblue,OUTPUT);
  pinMode(buzzer,OUTPUT);
  pinMode(piezo, INPUT);
  pinMode(triggerPort, OUTPUT);
  pinMode(echoPort, INPUT);
  Serial.begin(9600);
}
void loop()
{
 digitalWrite (triggerPort,LOW);
 digitalWrite (triggerPort,HIGH);
 delayMicroseconds(10);
 digitalWrite (triggerPort,LOW);

 long durata = pulseIn(echoPort, HIGH);

 long distanza = 0.034 * durata / 2;

Serial.print(distanza);
Serial.println(" cm");

  for (int positionCounter = 0; positionCounter < 29; positionCounter++) {  
      if (distanza > 15)
  {
  lcd.setRGB(colorR2, colorG2, colorB2);
  lcd.setCursor(0,0);
  lcd.print("Il Veicolo Rilevato è distante: ");
  lcd.setCursor(0,1);
  lcd.print(distanza);
  lcd.setCursor(5,1);
  lcd.print("cm");
  digitalWrite(ledblue,HIGH);
  digitalWrite(ledred,LOW);
  digitalWrite(ledgreen,LOW);
  digitalWrite(buzzer,LOW);
  delay(10);
  }
  }
 lcd.clear();
  int sensorstate = digitalRead(piezo);
  Serial.println(sensorstate);
  for (int positionCounter = 0; positionCounter < 29; positionCounter++) {  
  if (sensorstate == HIGH)
  {
    lcd.setRGB(colorR, colorG, colorB);
    digitalWrite(ledred,HIGH);
    digitalWrite(ledgreen,LOW);
    digitalWrite(ledblue,LOW);
    digitalWrite(buzzer,HIGH);
    lcd.setCursor(0,0);
    lcd.print("Collision ON");
    delay(50);
  }
  }
  lcd.clear();
  for (int positionCounter = 0; positionCounter < 29; positionCounter++) {  
   if (sensorstate == LOW)
  {
    lcd.setRGB(colorR1, colorG1, colorB1);
    digitalWrite(ledgreen,HIGH);
    digitalWrite(ledred,LOW);
    digitalWrite(ledblue,LOW);
    digitalWrite(buzzer,LOW);
    lcd.setCursor(0,1);
    lcd.print("Collision OFF");
    delay(50);
  }
  }
  lcd.clear();
}