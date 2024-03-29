const express = require("express");
const db = require("./dbconnect")
const expressLayouts = require('express-ejs-layouts')
const path = require('path')

const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.HTTP_PORT || 8000;

const votersRoute = require("./routes/votersRoute")
const moderatorRoute = require("./routes/moderatorRoute")
const candidatesRoute = require("./routes/candidatesRoute")
const homeRoute = require("./routes/homeRoute")
const candidateLogRoute = require("./routes/candidateLogRoute")
const voterLogRoute = require("./routes/voterLogRoute")

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


const corsOptions = {
    /*
        To allow requests from client changes to revert are in:
        1. https://github.com/mwchben/blockchain-vote-app/commit/6b20009c80244fb177bd8b8bd1f9861b6158bccc
        2. https://github.com/mwchben/blockchain-vote-app/commit/37aa63db12a7783a95de5e8afd3d72a55c4c6b08
        from https://stackoverflow.com/a/62821342/8479303
    */
    origin: [
        "http://localhost:3000",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
};
app.use(cors(corsOptions));
app.use(express.json());

/*
    routes used:
*/
app.use('/voters', votersRoute)
app.use('/candidates', candidatesRoute)
app.use('/moderatorDashboard', moderatorRoute)
app.use('/', homeRoute)
app.use('/voterLog', voterLogRoute)
app.use('/candidateLog', candidateLogRoute)



app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
