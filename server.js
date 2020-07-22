//NPM dependencies
const express = require("express");
const cors = require("cors");

//Initializations
const app = express();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Environment variables
const port = 3000;
const ipaddress = "10.5.10.100";

//Empty variables decleared in global scope so they can be accessed by getState() and HTTP routes
let xmlDoc = new XMLHttpRequest();
let state = "";

function convertRaw(data) {
  let output = "";
  for (let i = 0; i < data.length; i++) {
    output += String.fromCharCode(data[i]);
  }
  return output;
}

//getState() uses XHR to retrieve the XML data
//Recieves no parameters
//Returns XML state of relays
function getState() {
  xmlDoc.open("GET", "http://" + ipaddress + "/state.xml", false);
  xmlDoc.send(null);
  if (xmlDoc.readyState == 4) {
    const bytes = xmlDoc.statusText.rawPacket.data;
    return convertRaw(bytes);
  }
}

function setState(relayNumber, state) {
  let request;
  if (relayNumber != 0)
    request =
      "http://" +
      ipaddress +
      "/state.xml?relay" +
      relayNumber +
      "State=" +
      state;
  else request = "http://" + ipaddress + "/state.xml?relayState=" + state;

  xmlDoc.open("GET", request, false);

  xmlDoc.send(null);
  if (xmlDoc.readyState == 4) {
    const bytes = xmlDoc.statusText.rawPacket.data;
    return convertRaw(bytes);
  }
}

//HTTP GET route
app.get("/getState", (req, res) => {
  res.send(getState());
});

//HTTP POST route
app.post("/setState", (req, res) => {
  res.send(setState(req.body.relay, req.body.state));
});

//Initialize App
app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
