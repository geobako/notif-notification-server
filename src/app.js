const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const router = require('./api/routes/index');
const morgan = require('morgan');
const { handleError } = require('./helpers/errorHandling');
const gcm = require('node-gcm');

const app = express();

/*
middlewares
*/
app.use(compression());
app.use(morgan('tiny'));
app.use(helmet());
app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: false,
        parameterLimit: 50000
    })
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.get('/notification/:token', (req, res) => {
    const { token } = req.params;
    console.log(token);
    // Create a message
    // ... with default values

    // ... or some given values
    const message = new gcm.Message({
        priority: 'high',

        notification: {
            title: 'Hello, World',
            icon: 'ic_launcher',
            body: 'This is a notification that will be displayed if your app is in the background.'
        }
    });

    // Change the message data
    // ... as key-value

    // ... or as a data object (overwrites previous data object)

    // Set up the sender with you API key
    const sender = new gcm.Sender(
        'AAAAVGfXkmU:APA91bEEfALzKRGx22-8Hj7jVtTTpPMrjSeceZ_MigigfRhAoRZoZDjAsk-y1daYqB4bMxn5by0q8CB5WYEnAMCfoHxXmLr--GnxxWB_Y4hYCAo0xTtuXPydLhNWpz_8d_esb6eavm2l'
    );

    // Add the registration tokens of the devices you want to send to
    const registrationTokens = [];
    registrationTokens.push(token);

    // Send the message
    // ... trying only once
    sender.send(message, { registrationTokens: registrationTokens }, function(err, response) {
        if (err) {
            console.error(err);
            console.log('error');
        } else {
            console.log(response);
            console.log('success');
            return res.json({ mes: 'ok' });
        }
    });
});

/*
Swagger
*/
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*
Use routes
*/
app.use('/', router);

/*
Error handling middleware
*/

app.use((err, req, res, next) => {
    handleError(err, res);
});

module.exports = app;
