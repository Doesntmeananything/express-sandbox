const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')

const app = express();

app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(((req, res, next) => {
    if (req.query.msg === 'fail') {
        res.locals.msg = `Sorry. This username or password is invalid`
    } else {
        res.locals.msg = ``;
    }
    next();
}))

app.get('/', (req, res, next) => {
    res.send('Sanity Check');
});

app.get('/login', (req, res, next) => {
    console.log(req.query);
    res.render('login');
});

app.post('/process_login', (req, res, next) => {
    const password = req.body.password;
    const username = req.body.username;

    if (password === 'x') {
        res.cookie('username', username);
        res.redirect('/welcome');
    } else {
        res.redirect('/login?msg=fail&text=hello');
    };

    // res.json(req.body);
});

app.get('/welcome', (req, res, next) => {
    res.render('welcome', {
        username: req.cookies.username
    });
});

app.param('id', (req, res, next, id) => {
    console.log("Params called: " + id);
    next();
});

app.get('/story/:id', (req, res, next) => {
    res.send(`<h1>Story ${req.params.id}</h1>`);
    // res.send('<h1>Story 1</h1>');
});

// app.get('/story/:storyId/:link', (req, res, next) => {
//     res.send(`<h1>Story ${req.params.storyId} - ${req.params.link}</h1>`);
//     res.send('<h1>Story 1</h1>');
// });

app.get('/statement', (req, res, next) => {
    res.download(path.join(__dirname,'/user-statements/BankStatementChequing.png'), 'MyStatement.png', (error) => {
        if (error) {
            if (!res.headersSent) {
                res.redirect('/download/error');
            };
        };
    });
});

app.get('/logout', (req, res, next) => {
    res.clearCookie('username');
    res.redirect('/login');
});

app.listen(3000);
