const express = require('express');
const cors = require('cors');
const booksRoutes = require('./lib/routes/books-routes');
// const userDataRoutes = require('./lib/routes/userDataRoute')
// const { config } = require('./config');
// const mogoose = require('mongoose');

// mogoose.connect(config.SYSTEM_MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/books', booksRoutes);

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`server running on port ${port}`))