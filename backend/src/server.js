require('dotenv').config();
 
const express = require('express');
const cors = require('cors');
const initDb = require('./config/initDb');   


initDb();                                    

 
const app = express();
const PORT = process.env.PORT || 3001;