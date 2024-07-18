var express = require('express'); 
var bodyParser = require('body-parser'); 
var cors = require('cors');
require('dotenv').config();
const route = require('./src/router');
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');


var app = express();
 
// Middleware setup
app.use(cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. 
        credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());


//swagger setup
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define routes
app.use('/api/v1', route);

// Start the server
let port = process.env.PORT || 4000; 
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`); 
});
