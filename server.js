require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('EduQuizProject'); 
        console.log("✅ Successfully connected to local MongoDB!");
    } catch (err) {
        console.error(" Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    const existingUser = await db.collection('users').findOne({ username: username });
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.collection('users').insertOne({
        username: username,
        password: hashedPassword
    });
    res.status(201).json({ message: 'User created successfully!' });
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    const user = await db.collection('users').findOne({ username: username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.status(200).json({ message: 'Login successful!' });
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
    });
});