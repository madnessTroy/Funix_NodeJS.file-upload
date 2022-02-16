const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

// var options = {
// 	auth: {
// 		api_key: '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',
// 	},
// };
// var client = nodemailer.createTransport(sgTransport(options));

exports.getLogin = (req, res) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: [],
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			pageTitle: 'Log In',
			path: '/login',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
			},
			validationErrors: errors.array(),
		});
	}

	User.findOne({ email })
		.then((user) => {
			if (!user) {
				return res.status(422).render('auth/login', {
					pageTitle: 'Log In',
					path: '/login',
					errorMessage: 'Invalid email or password',
					oldInput: {
						email: email,
						password: password,
					},
					validationErrors: [],
				});
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
					return res.status(422).render('auth/login', {
						pageTitle: 'Log In',
						path: '/login',
						errorMessage: 'Invalid email or password',
						oldInput: {
							email: email,
							password: password,
						},
						validationErrors: [],
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	// Validate form
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
				confirmPassword: req.body.confirmPassword,
			},
			validationErrors: errors.array(),
		});
	}

	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			const user = new User({
				email,
				password: hashedPassword,
				cart: { items: [] },
			});
			return user.save();
		})
		.then(() => {
			res.redirect('/login');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
