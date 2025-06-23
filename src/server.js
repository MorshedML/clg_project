import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';


// npm run dev
// npx expo

dotenv.config();

const app = express();

// Middleware 
app.use(ratelimiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;



app.use('/api/transactions', transactionsRoute);




initDB().then(()=>{
    app.listen(PORT, () =>{
    console.log('Server is running on port ' + PORT);
    });
})