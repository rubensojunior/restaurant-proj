import * as mongoose from 'mongoose'
import {User} from '../users/users.model'

export interface Item extends mongoose.Document {
    prato: string
}

export interface Pedido extends mongoose.Document {
    mesa: string,
    itens: Item[],
    owner: mongoose.Types.ObjectId | User,
    status: string,
    obervacao: string,
}

export interface PedidoModel extends mongoose.Model<Pedido> {
    findByOwner(owner: mongoose.Types.ObjectId, projection?: string): Promise<Pedido>
}

const itensSchema = new mongoose.Schema ({
    prato: {
        type: String,
        required: true
    }
})

const pedidosSchema = new mongoose.Schema ({
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
})

pedidosSchema.statics.findByOwner = function(owner: mongoose.Types.ObjectId, projection: string){
    return this.find({owner},projection) //{email:email}
}

export const Pedido = mongoose.model<Pedido,PedidoModel>('Pedido', pedidosSchema)