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
    }
});
restSchema.statics.findByOwner = function (owner, projection) {
    return this.find({ owner }, projection); //{email:email}
};
exports.Table = mongoose.model('Table', restSchema);
