import * as mongoose from 'mongoose'
import {User} from '../users/users.model'
import { Restaurant } from '../restaurants/restaurants.model'

export interface Category extends mongoose.Document {
    name: string,
    owner: mongoose.Types.ObjectId | User,
    restaurant: mongoose.Types.ObjectId | Restaurant
}

export interface CategoryModel extends mongoose.Model<Category> {
    findByOwner(owner: mongoose.Types.ObjectId, projection?: string): Promise<Category>
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

restSchema.statics.findByOwner = function(owner: mongoose.Types.ObjectId, projection: string){
    return this.find({owner},projection) //{email:email}
}

restSchema.statics.findByOwnerAndRestaurant = function(owner: mongoose.Types.ObjectId, restaurant: mongoose.Types.ObjectId, projection: string){
    return this.find({owner,restaurant},projection) //{email:email}
}

export const Category = mongoose.model<Category,CategoryModel>('Category', restSchema)