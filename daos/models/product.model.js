import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    code:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    status:{
        type: Boolean,
        default: true
    },
    stock:{
        type: Number,
        required:true
    },
    category:String,
    thumbnails:{
        type: [String],
        default: ['img/default_product_img.png']
    }
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;