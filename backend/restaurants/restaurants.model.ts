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

export interface RestaurantModel extends mongoose.Model<Restaurant> {
    findByOwner(owner: mongoose.Types.ObjectId, projection?: string): Promise<Restaurant>
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

restSchema.statics.findByOwner = function(owner: mongoose.Types.ObjectId, projection: string){
    return this.find({owner},projection) //{email:email}
}

export const Restaurant = mongoose.model<Restaurant,RestaurantModel>('Restaurant', restSchema)