const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const morgan=require('morgan');
const ConnectDB=require('./config/db');
const SearchModel = require('./model/search.model');
dotenv.config();
ConnectDB();
const app=express();

app.use(cors());
app.use(morgan('dev'));
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
        data:{
          count:existingSearch.count
        }
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
        data:{
          count:newSearch.count
        }
      });


    }

    




    }
    catch(error){
        console.error("Error in /trending route:", error.message);
        return res.status(500).json({message:"Internal server error"});
    }
    })
    app.get('/api/trending-movies',async(req,res)=>{
      try{
        const trendingMovies=await SearchModel.find({count:{$gt:1}}).sort({count:-1}).limit(5);
        if(!trendingMovies || trendingMovies.length===0){
          return res.status(404).json({message:"No trending movies found"});
        }
        res.status(200).json({
          success:true,
          message:"Trending movies fetched successfully",
          data:trendingMovies
        });

      }
      catch(error){
        console.error("Error in /trending route:", error.message);
        return res.status(500).json({message:"Internal server error"});
      }
    })


module.exports=app;

