"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const itensSchema = new mongoose.Schema({
    prato: {
        type: String,
        required: true
    }
});
const pedidosSchema = new mongoose.Schema({
    mesa: {
        type: String,
        required: true
    },
    itens: {
        type: [itensSchema],
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
    obervacao: {
        type: String,
        required: true
    }
});
pedidosSchema.statics.findByOwner = function (owner, projection) {
    return this.find({ owner }, projection); //{email:email}
};
exports.Pedido = mongoose.model('Pedido', pedidosSchema);
