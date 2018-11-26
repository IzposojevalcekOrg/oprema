const dummy = require('mongoose-dummy');
const equipmentModel = require('./equipmentModel');
const ignoredFields = ["_id"];


const generate = function (n, ownerId) {
    for (var i = 0; i < n; i++) {
        var dummyEquipment = new equipmentModel(dummy(equipmentModel, {
            ignore: ignoredFields,
            returnDate: true,
            force: {
                ownerId: ownerId
            }
        }));

        dummyEquipment.save();
    }
}

module.exports = generate;