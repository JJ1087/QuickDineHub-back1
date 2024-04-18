 const mongoose = require ('mongoose');
 const dbURL = require ('./properties').DB;

 //conexion con la BD, creacion de la API
 module.exports = async ()=>{


     try{
        
             const conn = await mongoose.connect(dbURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
             });
             
             console.log('mongo ATLAS conectado')

     }catch(error){
            console.log('Error chamo, checale:',error);
        }


 } 

