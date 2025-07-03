const mongoose = require('mongoose');
const SearchSchema = new mongoose.Schema({
    searchTerm:{
        type: String,
        required: true
    },
    count:{
        type: Number,
        default: 1
    },
    movie_id:{
        type: String,
        required: true
    },
    image_url:{
        type: String,
        required: true  
    },

},{
    timestamps: true}
);
const SearchModel = mongoose.model('Search', SearchSchema);
module.exports = SearchModel;