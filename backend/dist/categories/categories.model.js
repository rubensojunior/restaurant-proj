"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
});
restSchema.statics.findByOwner = function (owner, projection) {
    return this.find({ owner }, projection); //{email:email}
};
restSchema.statics.findByOwnerAndRestaurant = function (owner, restaurant, projection) {
    return this.find({ owner, restaurant }, projection); //{email:email}
};
exports.Category = mongoose.model('Category', restSchema);
