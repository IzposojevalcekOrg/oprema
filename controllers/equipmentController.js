var equipmentModel = require('../models/equipmentModel.js');
var generate = require("../models/factory.js");
var _ = require('lodash');
/**
 * equipmentController.js
 *
 * @description :: Server-side logic for managing equipment.
 */
module.exports = {

    /**
     * equipmentController.list()
     */
    list: function (req, res) {
        let filters = {
            ownerId: req.query.ownerId
        };
        filters = _.omitBy(filters, _.isNil);

        equipmentModel.find(filters, function (err, equipment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting equipment.',
                    error: err
                });
            }
            return res.json(equipment);
        });
    },

    /**
     * equipmentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        equipmentModel.findOne({
                _id: id
            },
            function (err, equipment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting equipment.',
                        error: err
                    });
                }
                if (!equipment) {
                    return res.status(404).json({
                        message: 'No such equipment'
                    });
                }
                return res.status(200).json(equipment);
            });
    },

    /**
     * equipmentController.create()
     */
    create: function (req, res) {
        var equipment = new equipmentModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            priceTimeRange: req.body.priceTimeRange,
            created: req.body.created,
            ownerId: req.body.ownerId,
        });

        equipment.save(function (err, equipment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating equipment',
                    error: err
                });
            }
            return res.status(201).json(equipment);
        });
    },

    /**
     * equipmentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        equipmentModel.findOne({
                _id: id
            },
            function (err, equipment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting equipment',
                        error: err
                    });
                }
                if (!equipment) {
                    return res.status(404).json({
                        message: 'No such equipment'
                    });
                }

                equipment.name = req.body.name ? req.body.name : equipment.name;
                equipment.description = req.body.description ? req.body.description : equipment.description;
                equipment.price = req.body.price ? req.body.price : equipment.price;
                equipment.priceTimeRange = req.body.priceTimeRange ? req.body.priceTimeRange : equipment.priceTimeRange;
                equipment.created = req.body.created ? req.body.created : equipment.created;
                equipment.ownerId = req.body.ownerId ? req.body.ownerId : equipment.ownerId;

                equipment.save(function (err, equipment) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating equipment.',
                            error: err
                        });
                    }

                    return res.json(equipment);
                });
            });
    },

    /**
     * equipmentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        equipmentModel.findByIdAndRemove(id, function (err, equipment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the equipment.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    generateDummies: function (req, res) {
        var num = req.body.num;
        var ownerId = req.body.ownerId;
        generate(num, ownerId);
        equipmentModel.find(function (err, equipment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting equipment.',
                    error: err
                });
            }
            return res.json(equipment);
        });
    }

};