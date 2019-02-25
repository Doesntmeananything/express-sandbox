const path = require('path')
const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function validateUser (req, res, next) {
    res.locals.validated = true;
    next();
}

app.use(validateUser);

app.get('/', (req, res, next) => {
    res.render("index", {
        msg: "Success!",
        msg2: "Greater success!",
        html: `<img src="https://images.pexels.com/photos/291732/pexels-photo-291732.jpeg?cs=srgb&dl=adventure-cold-daylight-291732.jpg"</img>`
    })
});

app.listen(3000);