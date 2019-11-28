import * as mongoose from 'mongoose'
import {User} from '../users/users.model'

export interface MenuItem extends mongoose.Document {
    name: string,
    price: number
}

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[],
    owner: mongoose.Types.ObjectId | User
}

const menuSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const restSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
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
})

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema)