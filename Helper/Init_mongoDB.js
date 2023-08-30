const mongoose = require('mongoose')
// mongodb+srv://surya:<password>@cluster0.u0iusxy.mongodb.net/?retryWrites=true&w=majority
//surya
// vSiMXGiddMXKC03l
mongoose
.connect(process.env.MONGODB_URI, {
    dbName : 'auth_details',
    // user : process.env.USERNAME,
    // pass : process.env.PASSWORD,
    useNewUrlParser : true,
    useUnifiedTopology : true,
    //useFindAndModify : false,
    //useCreateIndex : true,
}).then(() => {
    console.log('mongodb connected');
}).catch((err) => {
    console.log(err.message);
})

mongoose.connection.on('connected' , () => {
    console.log('mongoose connected to db');
})

mongoose.connection.on('error' , (err) => {
    console.log(err.message);
})

mongoose.connection.on('disconnected' , () => {
    console.log('mongoose disconnected');
})

process.on('SIGINT' , async() => {
    await mongoose.connection.close();
    process.exit(0);
})