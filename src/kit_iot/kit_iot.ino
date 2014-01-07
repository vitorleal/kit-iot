#include <Servo.h>
#include <dht11.h>
dht11 DHT11;

bool debug = false;

int index = 0;

char messageBuffer[12];
char cmd[3];
char pin[3];
char val[4];
char aux[4];

void setup() {
  Serial.begin(115200);
}

void loop() {
  while (Serial.available() > 0) {
    char x = Serial.read();
    
    if (x == '!') {
      index = 0;      // start
      
    } else if (x == '.') {
      process(); // end
      
    } else {
      messageBuffer[index++] = x;
    }
  }
}

/*
 * Deal with a full message and determine function to call
 */
void process() {
  index = 0;

  strncpy(cmd, messageBuffer, 2);
  cmd[2] = '\0';
  
  strncpy(pin, messageBuffer + 2, 2);
  pin[2] = '\0';

  if (atoi(cmd) > 90) {
    strncpy(val, messageBuffer + 4, 2);
    val[2] = '\0';
    
    strncpy(aux, messageBuffer + 6, 3);
    aux[3] = '\0';
    
  } else {
    strncpy(val, messageBuffer + 4, 3);
    val[3] = '\0';
    
    strncpy(aux, messageBuffer + 7, 3);
    aux[3] = '\0';
  }
  
  Debug(messageBuffer);
  
  int cmdid = atoi(cmd);

  switch (cmdid) {
    case 1 :  dw(pin,val);     break;
    case 2 :  dr(pin,val);     break;
    case 3 :  aw(pin,val);     break;
    case 4 :  ar(pin,val);     break;
    case 5 :  dht11Read(pin);  break;
    case 99: toggleDebug(val); break;
    default:                   break;
  }
}

/*
 * Toggle debug mode
 */
void toggleDebug(char *val) {
  if (atoi(val) == 0) {
    debug = false;
    Serial.println("goodbye");
    
  } else {
    debug = true;
    Serial.println("hello");
  }
}

/*
 * Analog read
 */
void ar(char *pin, char *val) {
  Debug("ar");
  
  int p = getPin(pin);
  
  if(p == -1) {
    Debug("badpin");
    return;
  }
  
  pinMode(p, INPUT);
  int rval = analogRead(p);
  
  Serial.println(pin);
  if (pin == "A0") {
    Serial.println("yeahh");
  }
  
  char m[8];
  sprintf(m, "%s::%03d", pin, rval);
  Serial.println(m);
}


/*
 * Analog write
 */
void aw(char *pin, char *val) {
  Debug("aw");
  
  int p = getPin(pin);
  pinMode(p, OUTPUT);
  
  if(p == -1) {
    Debug("badpin");
    return;
  }
  
  analogWrite(p,atoi(val));
}


/*
 * Digital write
 */
void dw(char *pin, char *val) {
  Debug("dw");
  
  int p = getPin(pin);
  
  if(p == -1) { 
    Debug("badpin");
    return; 
  }
  
  pinMode(p, OUTPUT);
  
  if (atoi(val) == 0) {
    digitalWrite(p, LOW);
    
  } else {
    digitalWrite(p, HIGH);
  }
}

/*
 * Digital read
 */
void dr(char *pin, char *val) {
  Debug("dr");
  
  int p = getPin(pin);
  
  if(p == -1) { 
    Debug("badpin");
    return; 
  }
  
  pinMode(p, INPUT);
  int oraw = digitalRead(p);
  
  char m[7];
  sprintf(m, "%02d::%02d", p,oraw);
  Serial.println(m);
}


/*
 * Converts to A0-A5, and returns -1 on error
 */
int getPin(char *pin) {
  int ret = -1;
  
  if(pin[0] == 'A' || pin[0] == 'a') {
    switch(pin[1]) {
      case '0':  ret = A0; break;
      case '1':  ret = A1; break;
      case '2':  ret = A2; break;
      case '3':  ret = A3; break;
      case '4':  ret = A4; break;
      case '5':  ret = A5; break;
      default:             break;
    }
    
  } else {
    ret = atoi(pin);
    
    if(ret == 0 && (pin[0] != '0' || pin[1] != '0')) {
      ret = -1;
    }
  }
  return ret;
}


/*
 *  Dht11 read
 */
void dht11Read(char *pin) {
  Debug("dht11Read");
  int p = getPin(pin);
  
  if(p == -1) { 
    Debug("badpin");
    return; 
  }
  
  int chk = DHT11.read(atoi(pin));
  
  char m[7];
  sprintf(m, "%s::%d::%d", pin, DHT11.temperature, DHT11.humidity);
  Serial.println(m);
}


/*
 * Debug
 */
void Debug(char *name) {
  if (debug) {
    Serial.println(name);
  }
}

