const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

mongoose.connect(process.env.MONGODB).then(()=>
console.log("mongodb is connected")).catch(()=>console.log("some error is ocured"))
// middleware

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('welcome to home page');
});
app.get('/users', (req, res) => {
  res.send('welcome to user pages');
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(5000, () => {
  console.log('Backend server is running');
});
