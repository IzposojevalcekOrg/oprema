const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var config = require("./etcd/EtcdInit");
let user = process.env.DB_USER || "borrowland";
let password = process.env.DB_PASSWORD || "password";
let db_uri = process.env.DB_URI || "192.168.99.100:27017";

mongoose.connect(`mongodb://${user}:${password}@${db_uri}/tenants?authSource=admin`, {
    useNewUrlParser: true
});

var db = mongoose.connection;
const port = process.env.PORT || 8080;
const environment = process.env.ENVIRONMENT || "prod";
const version = process.env.VERSION || "v1";
let app = express();
let baseUrl = "/equipment/" + version;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// METRICS
const NodeProcessMetrics = require('node-process-metrics');
const NodeProcessMetricsPrometheus = require('node-process-metrics-prometheus');

// Use as an event emitter
const pm = new NodeProcessMetricsPrometheus({
    metrics: new NodeProcessMetrics({ period: 5000 })
});
pm.on('metrics', (metrics) => {
    console.log({metrics: metrics, time: Date(), source: baseUrl});
});

let logger = function (req, res, next) {
    let _req = {headers: req.headers, url: req.url, method: req.method, body: req.body};
    console.log({request: _req, time: Date(), baseUrl: req.baseUrl, originalUrl: req.originalUrl });
    next();
};
app.use(logger);
global.health = true;
app.get('/disableHealth/', (req, res) => {
    global.health = false
    res.send('Health disabled')
});
app.get('/health', (req, res) => {
    if (health)
        res.status(200).send(health)
    else {
        res.status(400).send(health);
    }
});

// init each route separately
app.use(baseUrl, require("./routes/equipmentRoutes"));

// Leave here for easy checking if the app is running.
app.get('/', (req, res) => res.send('<h1> Equipment API running!</h1>'));

app.get('/etcd', (req, res) => res.send(JSON.stringify(config)));


app.listen(port, function () {
    console.log(`Running server on port ${port}. Version: ${version}  Environment: ${environment}`);
});