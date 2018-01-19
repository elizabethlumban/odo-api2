const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const logger = require('winston');
const appEnv = require('cfenv').getAppEnv();

const app = express();
const port = process.env.PORT || 5010;

const ItemController = require('./ItemController');

// Some middleware
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Map the routes
const itemController = new ItemController();
app.get('/items', itemController.getItems.bind(itemController));
app.post('/items', itemController.addItem.bind(itemController));

app.listen(port, (err) => {
    if(err) {
        logger.error(err)
    } else {
        logger.info(`App listening on port ${port}!`)
    }
});