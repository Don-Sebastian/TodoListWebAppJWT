require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const AuthRouter = require('./Routes/AuthRouter');
const TodoRouter = require('./Routes/TodoRouter');
const {authMiddleware, checkUser, guestMiddleware} = require('./Middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

const { PORT } = process.env;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log('MongoDB Connected Successfully');
        app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
    })
    .catch((err) => console.error(err));

// routes
app.use("*", checkUser);
app.use("/", AuthRouter);
app.use('/' ,authMiddleware, TodoRouter);