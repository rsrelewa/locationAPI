const express = require('express');
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//const jsonParser = bodyParser.json()


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

/*
const latlong = navigator.geolocation.getCurrentPosition((success, error) => {
        geocoder.reverse({lat:success.latitude, lon:success.longitude}, function(err, result) {
            app.get('/location/api/ip',(req,res)=>{
                database[result[0].formattedAddress] = [result[0].latitude,result[0].longitude]
                res.send(result[0])
            })
        });
});
*/

app.post('/location',function(req,res){
    const browserLatLong = req.body;
    geocoder.reverse({lat:browserLatLong.latitude, lon:browserLatLong.longitude}, function(err, result) {
        database[result[0].formattedAddress] = [result[0].latitude,result[0].longitude]
        console.log(result)
        res.send(result)
    });

    
})

app.get('/location',(req,res)=>{
    res.sendFile('/index.html' , { root : __dirname});
})


app.put('/location/',(req,res)=>{
    //should update the database
    res.send(database)
})

app.get('/api/visitors',(req,res)=>{
    res.send(database);
})

app.get('/', (req, res) =>{
    res.redirect('/location');
});

app.listen(PORT,() => console.log(`Listening at http://localhost:${PORT}`))
