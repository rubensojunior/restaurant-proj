import * as mongoose from 'mongoose'
import {User} from '../users/users.model'
import { Restaurant } from '../restaurants/restaurants.model'

export interface Item extends mongoose.Document {
    name: string,
    amount: number,
    price: number
}

export interface Order extends mongoose.Document {
    table: string,
    items: Item[],
    owner: mongoose.Types.ObjectId | User,
    status: string,
    note: string,
    restaurant: mongoose.Types.ObjectId | Restaurant
}

export interface OrderModel extends mongoose.Model<Order> {
    findByOwner(owner: mongoose.Types.ObjectId, projection?: string): Promise<Order>
    findByOwnerAndRestaurant(owner: mongoose.Types.ObjectId, restaurant: mongoose.Types.ObjectId, projection?: string): Promise<Restaurant>
}

const itemsSchema = new mongoose.Schema ({
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
})

const ordersSchema = new mongoose.Schema ({
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
})

ordersSchema.statics.findByOwner = function(owner: mongoose.Types.ObjectId, projection: string){
    return this.find({owner},projection) //{email:email}
}

ordersSchema.statics.findByOwnerAndRestaurant = function(owner: mongoose.Types.ObjectId, restaurant: mongoose.Types.ObjectId, projection: string){
    return this.find({owner,restaurant},projection) //{email:email}
}

export const Order = mongoose.model<Order,OrderModel>('Order', ordersSchema)