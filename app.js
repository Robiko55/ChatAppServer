
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./api/routes/auth');
const cors = require('cors');
const { getGPTResponse } = require('./gptscript.js');
const { MongoServerSelectionError } = require('mongodb');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:8080']
  }
});


const PORT = 3000;
const socket = require('socket.io')(5000);




app.use(cors());
app.use(bodyParser.json());
socket.use(cors());

app.use('/api/auth', authRoutes); // Use the auth routes under the /api/auth path

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('my message', (msg)=>{
    socket.broadcast.emit('my broadcast', msg);
  });

  socket.on('gpt-message', async (msg)=> {
    const gptResponse = await getGPTResponse(msg);
    console.log(msg);
    socket.emit('gpt-broadcast', gptResponse);
  });
});




// Connect to MongoDB and start the server
const dbURI = 'mongodb+srv://aleksandarmatovic:test123@registerlogin.59fjchz.mongodb.net/RegisterLogin?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    http.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));


