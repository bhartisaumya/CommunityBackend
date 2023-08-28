import express, { Request, Response } from "express";
import authHandler from "./Authentication/authHandler";
import creteError from "http-errors"
import "./Helper/connectingMongdb";
import authModule from "./Helper/jwtHelper";
import Community from "./Community/communityHandler";

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}));


app.get('/', authModule.verifyAccessToken, (req, res, next) => {
    res.send('This is the home page');
})

app.use('/auth', authHandler);
app.use('/community', Community)

// Error Handling
app.use((err: any, req: Request, res: Response, next: any) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status,
            message: err.message
        }
    })
})

app.listen(3000, () => {
    console.log("Listening on port 3000...");
})
