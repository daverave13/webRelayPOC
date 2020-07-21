//NPM dependencies
const express = require("express");
const cors = require("cors");

//Initializations
const app = express();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Middleware
app.use(cors());

//Environment variables
const port = 3000;
const ipaddress = "10.5.10.100";

//Empty variables decleared in global scope so they can be accessed by getState() and HTTP routes
let xmlDoc = new XMLHttpRequest();
let state = "";

//getState() uses XHR to retrieve the XML data
//Recieves no parameters
//Returns XML state of relays
function getState() {
  xmlDoc.open("GET", "http://" + ipaddress + "/state.xml", false);
  xmlDoc.send(null);
  if (xmlDoc.readyState == 4) {
    const xmlLength = xmlDoc.statusText.rawPacket.data.length;
    const bytes = xmlDoc.statusText.rawPacket.data;
    for (let i = 0; i < xmlLength; i++) {
      state += String.fromCharCode(bytes[i]);
    }
    return state;
  }
}

//HTTP GET route
app.get("/getState", (req, res) => {
  res.send(getState());
});

//Initialize App
app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
