var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipmentSchema = new Schema({
    'name': String,
    'description': String,
    'price': Number,
    'priceTimeRange': String,
    'created': Date,
    'ownerId': Schema.Types.ObjectId
});

module.exports = mongoose.model('equipment', equipmentSchema);