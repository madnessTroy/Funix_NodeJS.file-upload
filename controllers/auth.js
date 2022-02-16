const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

var options = {
	auth: {
		api_key: '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',
	},
};
var client = nodemailer.createTransport(sgTransport(options));

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		errorMessage: req.flash('error'),
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
	});
};

exports.postLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid email or password!');
				return res.redirect('/login');
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(() => {
							res.redirect('/');
						});
					}
					return res.redirect('/login');
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	// Validate form
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
		});
	}

	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				return res.redirect('/signup');
			}
			return bcrypt.hash(password, 12).then((hashedPassword) => {
				const user = new User({
					email,
					password: hashedPassword,
					cart: { items: [] },
				});
				return user.save();
			});
		})
		.then(() => {
			res.redirect('/login');
			client
				.sendMail({
					to: email,
					from: 'flyht18@gmail.com',
					subject: 'Sign-up Succeded!',
					html: '<h1>Complete</h1>',
				})
				.then(() => console.log('Email sent!'));
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
