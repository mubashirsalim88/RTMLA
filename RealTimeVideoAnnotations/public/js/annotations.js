document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('annotation-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let drawingMode = null; // To track which mode is active
    let startX, startY;

    // Function to handle drawing rectangles
    function drawRectangle(e) {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Clear only the last rectangle drawn
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the rectangle
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
    }

    // Function to handle adding text
    function addText(e) {
        const text = prompt("Enter your annotation:");
        if (text) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            ctx.font = "20px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(text, mouseX, mouseY);
        }
        drawingMode = null; // Reset mode after adding text
        canvas.style.pointerEvents = 'none'; // Disable drawing after adding text
    }

    // Event listener for drawing rectangle
    document.getElementById('draw-rect').addEventListener('click', function() {
        drawingMode = 'rectangle';
        canvas.style.pointerEvents = 'auto';
        canvas.addEventListener('mousedown', function(e) {
            drawing = true;
            startX = e.clientX - canvas.getBoundingClientRect().left;
            startY = e.clientY - canvas.getBoundingClientRect().top;
        });
        canvas.addEventListener('mousemove', drawRectangle);
        canvas.addEventListener('mouseup', function() {
            drawing = false;
            drawingMode = null;
            canvas.removeEventListener('mousemove', drawRectangle);
            canvas.style.pointerEvents = 'none'; // Disable drawing after finishing
        });
    });

    // Event listener for adding text
    document.getElementById('add-text').addEventListener('click', function() {
        drawingMode = 'text';
        canvas.style.pointerEvents = 'auto';
        canvas.addEventListener('click', addText, { once: true });
    });

    // Clear annotations button
    document.getElementById('clear-canvas').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});


canvas.addEventListener('mouseup', function() {
    if (drawingMode === 'rectangle') {
        drawing = false;
        drawingMode = null;
        canvas.style.pointerEvents = 'none';

        // Emit the drawing data
        socket.emit('draw', {
            type: 'rectangle',
            startX,
            startY,
            endX: mouseX,
            endY: mouseY,
        });
    }
});

// Listen for drawing events from others
socket.on('draw', function(data) {
    if (data.type === 'rectangle') {
        ctx.strokeRect(data.startX, data.startY, data.endX - data.startX, data.endY - data.startY);
    }
});