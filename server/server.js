import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// load env variables
dotenv.config();
// create server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// basic testing routes
app.get('/', (req, res) => {
    res.send({
        messag: 'Welcome to the PM System API',
        status: 'Server is running successfully'
    })
});

// Import and use routes
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// database connection 
connectDB()
.then(() => {
    console.log('Database connected successfully');
})
.catch((err) => {
    console.log('Database connection failed', err);
});
