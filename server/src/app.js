const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const ConnectDB=require('./config/db');
const SearchModel = require('./model/search.model');
dotenv.config();
ConnectDB();
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.post('/api/search-count',async(req,res)=>{
    try{
      const {searchTerm,movie}=req.body;
    if(!searchTerm || !movie){
        return res.status(400).json({message:"Search term and movie are required"});
    }
    const existingSearch = await SearchModel.findOne({searchTerm});
    if(existingSearch){
      existingSearch.count += 1;
     await existingSearch.save();
         res.status(200).json({        
        success: true,
        message: "count updated successfully",
      });

    }
    else{
      const newSearch=new SearchModel({
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        image_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,

        
      });
      await newSearch.save();
          res.status(201).json({        
        success: true,
        message: "Search term added successfully",
      });


    }

    




    }
    catch(error){
        console.error("Error in /trending route:", error.message);
        return res.status(500).json({message:"Internal server error"});
    }

})
module.exports=app;

