const app = require('./src/app');
PORT=process.env.PORT || 5000;





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});