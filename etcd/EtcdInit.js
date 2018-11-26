const uuidv4 = require('uuid/v4');
let Etcd = require("node-etcd");
let etcdUrls = process.env.ETCD_URL || "192.168.99.100:2379";
let etcd = new Etcd(etcdUrls);

const serviceId = uuidv4();
let root = "/equipment/v1/";


const defaultConfig = require("../default-config.json");
// Get default configuration from env and config.json
var config = {
    "numEquipmentPerTenantGet": process.env.ETCD_NUMEQUIPMENTPERTENANTGET ||
    defaultConfig[environment][version]["numEquipmentPerTenantGet"] || 10
};

function registerService() {
    etcd.set(`${root}routes/${serviceId}`,
        JSON.stringify({
            hostname: process.env.HOST,
            port: process.env.HOST_PORT,
        }), {
            ttl: 8
        }
    );
    setTimeout(registerService, 5000);
}
registerService();

// Get initial values
etcd.get(root, {
    recursive: true
}, function (err, res) {
    try {
        for (let node of res.node.nodes) {
            processConfig(node);
        }
    } catch (ex) {
        console.error(ex);
    }
});

// Watcher setup
let watcher = etcd.watcher(root, null, {
    recursive: true
});

watcher.on("change", (val) => {
    processConfig(val.node);
});

// validate and process configuration change
function processConfig(node) {
    let key = node.key.replace(root, '');
    let value = node.value;

    // Optional validations
    switch (key) {
        case "numEquipmentPerTenantGet":
            value = parseInt(value);
            break;
    }

    // Save keys
    config[key] = value;
}


module.exports = config;