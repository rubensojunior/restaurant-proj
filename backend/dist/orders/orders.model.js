"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});
const ordersSchema = new mongoose.Schema({
    table: {
        type: String,
        required: true
    },
    items: {
        type: [itemsSchema],
        required: true,
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
});
ordersSchema.statics.findByOwner = function (owner, projection) {
    return this.find({ owner }, projection); //{email:email}
};
ordersSchema.statics.findByOwnerAndRestaurant = function (owner, restaurant, projection) {
    return this.find({ owner, restaurant }, projection); //{email:email}
};
exports.Order = mongoose.model('Order', ordersSchema);
