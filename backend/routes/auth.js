const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');
const { validateRequest } = require('../middlewares/validate');

router.post('/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username must be 3-30 alphanumeric characters'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
  ],
  validateRequest,
  signup
);


router.post('/login',
  [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail(),
    body('password')
      .notEmpty()
  ],
  validateRequest,
  login
);

module.exports = router;