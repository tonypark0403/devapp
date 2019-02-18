import dotenv from 'dotenv';
dotenv.config();
import app from './src/app';

const PORT = process.env.PORT || 5000;

const handleListening = () => console.log(`Server running on port ${PORT}`);

app.listen(PORT, handleListening);