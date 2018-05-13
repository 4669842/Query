// server.js
// where your node app starts
// init project
var express = require('express');
const { spawn } = require('child_process');
var app = express();

const Gamedig = require('gamedig');
//stuff for later
var exec = require('child_process').exec;
var child,serverId,serverId,serverIP,port;
//baited servers IP and port pool.
var serverIP = [ '109.230.215.195', '89.35.29.6', '185.44.78.52', '109.230.215.208', '89.34.96.7' ];
var port = [ '27095','27105','27155','27125', '27125' ];
var fs = require('fs');
      const mapList = { 
        de_dust2: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_dust2.png?1526139956204',
        de_inferno: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_Inferno.jpg?1526139969804',
        de_cache: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_cache.png?1526140087362',
		    de_season: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_season.png?1526139906690',
        de_mirage: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_mirage.jpg?1526139852435',
        de_train: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_train.png?1526140088949',
        de_nuke: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_nuke.png?1526139854867',
        de_cobblestone: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_cobblestone.jpg?1526143103527',
        de_overpass: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2Fde_overpass.png?1526143148982',
        de_canals: 'https://cdn.glitch.com/83c7560b-6912-4af2-8ded-dd33dcec1792%2FDe_canals_large.jpg?1526143182352'}
       

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
console.log('Starting query service...\n Current IPs in the Baited roster list is:')
console.log('IPs: '+serverIP);
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
response.sendFile(__dirname + '/views/index.html');
});
// README: Each query is partitioned into chunks where 
//smaller queries are grouped with server Id.

// Start SERVER CHUNK
// Server Query Start
app.get("/:serverId", function (req, response) {
  //which server ID was entered
  //Query the server associated with the ID
  var serverId = req.params.serverId - 1;
  console.log('Starting full query..');
  console.log('ServerId is:'+req.params.serverId);
  console.log(serverIP[serverId],port[serverId]);
  
  Gamedig.query(
    {type: 'csgo',host: serverIP[serverId], port: port[serverId]},function(e,state) {
      //Catch errors
    if(e) console.log("Server "+req.params.serverId+" is offline");
      //Log sucecssful query
      else console.log("Server "+req.params.serverId+" has responded!");
      console.log('Server '+req.params.serverId+' has been pinged');
      //Show results to user
      response.send(JSON.stringify(state));
      //Write results to local json file in servers folder.
      fs.writeFile('servers/'+req.params.serverId+'.json', JSON.stringify(state), function(err) {
    if(err) {return console.log(err);}
    console.log("The server stats were updated!");});
    })//end of query function
});
// Server Query End

// Server Name Query Start
app.get("/:serverId/name", function (req, response) {
  console.log('Starting name query..');
  var serverId = req.params.serverId - 1;
  
  Gamedig.query(
    {type: 'csgo',host: serverIP[serverId], port: port[serverId]},function(e,state) {
    if(e) console.log("Server "+serverId+" is offline");
      else console.log("Server "+serverId+" has responded!");
      
    //  if (state.players = "{}") response.sendFile(__dirname + '/views/empty.html');
      response.send(state.name);
      
    })//end of query function
  
});
// Server Name Query End

// Server Player Query Start
app.get("/:serverId/players", function (req, response) {
  console.log('Starting players query..');
  var serverId = req.params.serverId - 1;
  Gamedig.query(
    {type: 'csgo',host: serverIP[serverId], port: port[serverId]},function(e,state) {
    if(e) console.log("Server "+serverId+" is offline");
      else console.log("Server "+serverId+" has responded!");
      
    //  if (state.players = "{}") response.sendFile(__dirname + '/views/empty.html');
      response.send(state.players);
      
    })//end of query function
});
// Server Player Query End

// Server Map Query Start
app.get("/:serverId/map", function (req, response) {
 var serverId = req.params.serverId;
  console.log('Starting server map query..');
  Gamedig.query(
   {type: 'csgo',host: serverIP[serverId], port: port[serverId]},function(e,state) {
    if(e) console.log("Server "+serverId+" is offline");
      else console.log("Server "+serverId+" has responded!");
     console.log('Current Map: '+state.map);
      response.send(state.map);
    })//end of query function
  console.log('Starting players query..');
});
// END SERVER CHUNK

/*
This part of the script is to declare the endpoints for the services that will use this
data. Unless you really know what you are doing just ignore.
*/
app.get("/servers/:serverId.json", function (req, response) {
 var serverId = req.params.serverId;
  console.log('A service has requested stats on a server..');
  response.sendFile(__dirname + '/servers/'+serverId+'.json');
  console.log('Request finished..');
});

app.get("/servers/maps.json", function (req, response){
  console.log('A service has requested stats on a server..');
  response.sendFile(__dirname + '/servers/maps.json');
  console.log('Request finished..');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  //console.log(mapList);
  console.log('Refresh has finished. Services running\n');
  console.log('View a server by entering the server ID .e.g. http://138.68.106.162/1');
  console.log('Each server can be extended or reduce to its output formed from mere essentials.');
});
