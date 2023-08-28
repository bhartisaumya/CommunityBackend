import mongoose from "mongoose";

mongoose.connect("mongodb+srv://surya:vSiMXGiddMXKC03l@cluster0.u0iusxy.mongodb.net/?retryWrites=true")
.then(() => {
    console.log("MongoDB Connected")
})
.catch((err: Error) => {
    console.log(err.message);
})

process.on("beforeExit" , () => {
    mongoose.disconnect();
    process.exit(0);
});