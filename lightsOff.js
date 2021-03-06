var hue = require("node-hue-api"),
  HueApi = hue.HueApi,
  lightState = hue.lightState;

function startStopLights(light, lightState) {
  api.setLightState(light, lightState)
    .then(displayResult)
    .fail(displayError)
    .done();
}

var displayResult = function(result) {
  console.log(result);
};

var displayError = function(err) {
  console.error(err);
};

var host = "192.168.178.91",
  username = "65f4a5ce170da4897839a5d35dc41afa",
  api = new HueApi(host, username),
  state = lightState.create();


for (var i = 1; i < 5; i++) {
  startStopLights(i, state.off());
}
