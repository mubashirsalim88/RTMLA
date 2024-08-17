const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handling socket connections
io.on('connection', (socket) => {
    console.log('New user connected');

    // Listen for annotation events
    socket.on('draw', (data) => {
        io.emit('draw', data); // Broadcast to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
