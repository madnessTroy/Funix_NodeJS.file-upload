// ExpressJs
const express = require('express');
// Mongoose
const mongoose = require('mongoose');
// Core module
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
	'mongodb+srv://admin:admin@funixlab-nodejs.n4ini.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(new Error(err));
		});
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
	res.status(500).render('500', {
		path: '/500',
		pageTitle: 'Error!',
		isAuthenticated: req.session.isLoggedIn,
	});
});
// Mongoose connect
mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => console.log(err));
