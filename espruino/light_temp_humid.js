digitalWrite(B9, 1); // enable on Pico Shim V2

Serial2.setup(115200, {
  rx: A3,
  tx: A2
});
//what we send to the server
var dataSet = ["0", "", ""];
//http and wifi config.
var http = require("http");
var network = "Sorin_WLAN";
var password = "9334804578476971";
// stores the timeout used to turn lights off
var timeout;

setSleepIndicator(LED1);

function start() {
  var wifi = require("ESP8266WiFi_0v25").connect(Serial2, function(err) {
    if (err) throw err;
    wifi.reset(function(err) {
      if (err) throw err;
      console.log("Connecting to WiFi");
      wifi.connect(network, password, function(err) {
        if (err) throw err;
        console.log("Connected");
        setInterval(function() {
        digitalWrite(LED1, 1);
          setTimeout(function () {
            digitalWrite(LED1, 0);
            setDeepSleep(0);
            dataSet[0] = "9";
            dataSet[1] = "13";
            dataSet[2] = "65";
            postSample(dataSet);
            setDeepSleep(1);
            }, 20);
        }, 60000);
      });
    });
  });
}

// Wrapper function of "http.request" to execute POST request.
function postSample(payload) {

  var queryString =
    "Espruino_LAB:" +
    "lux:" + payload[0] +
    ":temperature:" + payload[1] +
    ":humidity:" + payload[2];

  var host = "192.168.178.95";
  var port = 8080;
  var path = "/";
  var options = {
    host: host,
    port: port,
    path: path
  };

  post(http, options, queryString, function(chunk) {
    console.log('BODY: ' + chunk);
  });
}

// Wrapper function of "http.request" to execute POST request.
function post(http, options, queryString, callback) {
  // complete the options
  options.headers = options.headers || {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': queryString.length
  };
  options.method = "POST";

  var dataAsString = "";
  var req = http.request(options, function(res) {
    res.on('data', function(data) {
      dataAsString += data;
    });
    res.on('close', function() {
      callback(dataAsString);
    });
  });
  req.write(queryString);
  req.end();
}
//Store sketch on device flash, but first delete current contents from flash
E.on("init", start);
save();
