const express = require('express');
const app = express();
const PORT = 5000;

const path = require('path')

const { Navigator } = require("node-navigator");
const navigator = new Navigator();

const { v4: uuidv4 } = require('uuid');

const NodeGeocoder = require('node-geocoder');
const geoOptions = {
    provider: 'openstreetmap',
    httpAdapter: 'https', // Default
    apiKey: ' ', // for Mapquest, OpenCage, Google Premier
    formatter: 'json' // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(geoOptions);

let database = {}

const latlong = navigator.geolocation.getCurrentPosition((success, error) => {
        geocoder.reverse({lat:success.latitude, lon:success.longitude}, function(err, result) {
            app.get('/location/api/ip',(req,res)=>{
                database[result[0].formattedAddress] = [result[0].latitude,result[0].longitude]
                res.send(result[0])
            })
        });
});

app.get('/location',(req,res)=>{
    res.sendFile(path.join(__dirname, '../geolocation/public', 'index.html'))
})

app.put('/location/',(req,res)=>{
    res.send(database)
})

app.get('/api/visitors',(req,res)=>{
    res.send(database);
})

app.get('/', (req, res) {
    res.redirect('/location');
});

app.listen(PORT,() => console.log(`Listening at http://localhost:${PORT}`))
