import express from 'express';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// app.use('/api/auth',)

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`)
});