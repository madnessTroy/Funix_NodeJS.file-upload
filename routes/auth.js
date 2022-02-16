const express = require('express');
const { check, body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Please enter a valid email!'),
		body('password')
			.isLength({ min: 5 })
			.withMessage(
				'Please enter a password with only numbers and text || At least 5 characters'
			)
			.isAlphanumeric(),
	],
	authController.postLogin
);

router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email!')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject(
							'E-Mail exists already, please pick a different one.'
						);
					}
				});
			}),
		body(
			'password',
			'Please enter a password with only numbers and text || At least 5 characters'
		)
			.isLength({ min: 5 })
			.isAlphanumeric(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Password is not match!');
			}
			return true;
		}),
	],
	authController.postSignup
);

router.post('/logout', authController.postLogout);

module.exports = router;
