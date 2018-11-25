let Etcd = require("node-etcd");
let etcdUrls = process.env.ETCD_URL || "192.168.99.100:2379";
let etcd = new Etcd(etcdUrls);

const version = process.env.VERSION || "v1";
const environment = process.env.ENVIRONMENT || "prod";

const root = `/equipment/${environment}/${version}/`;

const defaultConfig = require("../default-config.json");
// Get default configuration from env and default-config.json
var config = {
    "numEquipmentPerTenantGet": process.env.ETCD_NUMEQUIPMENTPERTENANTGET ||
        defaultConfig[environment][version]["numEquipmentPerTenantGet"] || 10
};

function registerService() {
    etcd.set(`${root}routes/${process.env.HOST_PORT}`,
        JSON.stringify({
            hostname: '127.0.0.1',
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
        for (let i = 0; i < res.node.nodes.length; i++) {
            processConfig(res.node.nodes[i]);
        }
    } catch (ex) {
        console.error(ex);
        setDefault();
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

function setDefault() {
    for (let env in defaultConfig) {
        for (let ver in defaultConfig[env]) {
            for (let key in defaultConfig[env][ver]) {
                etcd.set(`/equipment/${env}/${ver}/${key}`, defaultConfig[env][ver][key]);
            }
        }
    }
}