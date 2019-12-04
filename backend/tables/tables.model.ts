import * as mongoose from 'mongoose'
import {User} from '../users/users.model'
import { Restaurant } from '../restaurants/restaurants.model'

export interface Table extends mongoose.Document {
    name: string,
    owner: mongoose.Types.ObjectId | User,
    restaurant: mongoose.Types.ObjectId | Restaurant
}

export interface TableModel extends mongoose.Model<Table> {
    findByOwner(owner: mongoose.Types.ObjectId, projection?: string): Promise<Table>
    findByOwnerAndRestaurant(owner: mongoose.Types.ObjectId, restaurant: mongoose.Types.ObjectId, projection?: string): Promise<Restaurant>
}

const restSchema = new mongoose.Schema ({
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
})

restSchema.statics.findByOwnerAndRestaurant = function(owner: mongoose.Types.ObjectId, restaurant: mongoose.Types.ObjectId, projection: string){
    return this.find({owner,restaurant},projection) //{email:email}
}

restSchema.statics.findByOwner = function(owner: mongoose.Types.ObjectId, projection: string){
    return this.find({owner},projection) //{email:email}
}

export const Table = mongoose.model<Table,TableModel>('Table', restSchema)