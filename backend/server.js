const express=require('express');
const mongoose=require('mongoose');
const cors =require('cors');
const morgan =require('morgan');
const { MongoMemoryServer } =require("mongodb-memory-server");
const userRoutes =require('./routes/user');
const env=require('./config');

async function connect(){
    const mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    mongoose.set('strictQuery', true)
    const connect = await mongoose.connect(uri);
    return connect;
}

const app=express();

app.use(express.json());
app.use((req,res,next)=>{
    next();
})
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');



const port=process.env.PORT;

app.get('/', (req, res) => {
    
});

app.use('/api/user', userRoutes);

connect().then(()=>{
    app.listen(port,()=>{
        console.log(`on port n connected to db port: ${port}`);
    });
})
.catch((error)=>{
    console.log(error);
})
