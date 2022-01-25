// ExpressJs
const express = require('express');
// Mongoose
const mongoose = require('mongoose');
// Core
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('61e581c3c10d8245f7e46d29')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Mongoose connect
const url =
	'mongodb+srv://admin:admin@funixlab-nodejs.n4ini.mongodb.net/shop?retryWrites=true&w=majority';
mongoose
	.connect(url)
	.then(() => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'Toan',
					email: 'test@go.go',
					cart: { items: [] },
				});
				console.log('From: app.js || Created User!');
				user.save();
			}
		});
		app.listen(3000);
	})
	.catch((err) => console.log(err));
