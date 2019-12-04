"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: false
    }
});
const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
restSchema.statics.findByOwner = function (owner, projection) {
    return this.find({ owner }, projection); //{email:email}
};
restSchema.statics.findByOwnerAndName = function (owner, name, projection) {
    return this.find({ owner, name }, projection); //{email:email}
};
exports.Restaurant = mongoose.model('Restaurant', restSchema);
