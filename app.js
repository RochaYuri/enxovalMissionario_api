//#region imports e variáveis

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require('./routes/users');
const items = require('./routes/items');
const categories = require('./routes/categories');
const personalInfos = require('./routes/personalInfos');
const path = require("path"); 
const swagger = require('./swagger');

const port = 5000;

//#endregion

//#region middlewares

const allowedOrigins = [
    "https://www.missaoelderrocha.com.br",
    "http://www.uptimerobot.com"
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);
app.use('/items', items);
app.use('/categories', categories);
app.use('/personalInfos', personalInfos);

//#endregion

swagger(app);

app.listen(port, () => {});
