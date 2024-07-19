const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Task Manager API');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
if (require.main === module) {
    app.listen(port, () => {
        logger.info(`Server running at http://localhost:${port}/`);
    });
}

module.exports = app;
