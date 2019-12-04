import * as mongoose from 'mongoose'
import {User} from '../users/users.model'

export interface MenuItem extends mongoose.Document {
    name: string,
    price: number,
    category: string
}

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[],
    owner: mongoose.Types.ObjectId | User,
    phone: string,
    address: string
}

export interface RestaurantModel extends mongoose.Model<Restaurant> {
    findByOwner(owner: mongoose.Types.ObjectId, projection?: string): Promise<Restaurant>
    findByOwnerAndName(owner: mongoose.Types.ObjectId, name:string, projection?: string): Promise<Restaurant>
}

const menuSchema = new mongoose.Schema ({
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
})

const restSchema = new mongoose.Schema ({
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
})

restSchema.statics.findByOwner = function(owner: mongoose.Types.ObjectId, projection: string){
    return this.find({owner},projection) //{email:email}
}

restSchema.statics.findByOwnerAndName = function(owner: mongoose.Types.ObjectId, name: string, projection: string){
    return this.find({owner,name},projection) //{email:email}
}

export const Restaurant = mongoose.model<Restaurant,RestaurantModel>('Restaurant', restSchema)