var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipmentSchema = new Schema({
    'name': {
        type: String,
        required: true
    },
    'description': {
        type: String,
        required: true
    },
    'price': {
        type: Number,
        required: true
    },
    'created': {
        type: String,
        default: Date.now
    },
    'ownerId': {
        type: Schema.Types.ObjectId,
        required: true
    }
});


const equipmentModel = mongoose.model('equipment', equipmentSchema);

module.exports = equipmentModel;