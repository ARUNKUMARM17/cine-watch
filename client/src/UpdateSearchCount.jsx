// import { Databases } from 'appwrite';
// import { Client } from 'appwrite';  
// import { ID, Query } from 'appwrite';

// const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
// const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTIONS_ID;
// const APPWRITE_ENDPOINT=import.meta.env.VITE_APPWRITE_ENDPOINT;



// const client=new Client()
//     .setEndpoint(APPWRITE_ENDPOINT) 
//     .setProject(PROJECT_ID);
// const database=new Databases(client);


// export const updateSearchCount=async (searchTerm,movie)=>{
//     try{
//         const result=await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
//             Query.equal('searchTerm', searchTerm)
//         ]);
//         if(result.documents.length > 0) {
//             const doc=result.documents[0];
//             await database.updateDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 doc.$id,
//                 {
//                     count: doc.count + 1,   

//                 }
//             );


//         }
//         else{
//             await database.createDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 ID.unique(),
//                 {
//                     searchTerm,
//                     count: 1,
//                     poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,          

//                     movie_id: movie.id,
//                 }
//             )
//         }

//     }
//     catch(error){
//         console.error('Error updating search count:', error);
//     }
// }
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5678';
export const UpdateSearchCount = async (searchTerm, movie) => {
    try{
        const response=await fetch(`${backendUrl}/api/search-count`,{
            method:'POST',
            headers:{
                      'Content-Type': 'application/json', // Tells server this is JSON
                      'Accept': 'application/json',  
                      },
            body:JSON.stringify({
                searchTerm,
                movie
            })
        });
        const data=await response.json();
        if(data.success){
            console.log(data.message);
            console.log('Search count updated:', data.data.count);
        }

    }catch(error){
        console.error('Error updating search count:', error);
    }
}