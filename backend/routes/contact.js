const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { messages, uuidv4 } = require('../data/store');
const { sanitizeInputs } = require('../middleware/sanitize');
const { authenticate, requireAdmin } = require('../middleware/auth');

const contactValidation = [
  body('name').isString().trim().isLength({ min: 2, max: 80 }).matches(/^[a-zA-Z\s'-]+$/).withMessage('Name must be 2–80 letters.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('subject').isString().trim().isLength({ min: 3, max: 120 }).withMessage('Subject must be 3–120 characters.'),
  body('message').isString().trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be 10–1000 characters.'),
];

router.post('/', sanitizeInputs, contactValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }

  const { name, email, subject, message } = req.body;
  const msg = {
    id: uuidv4(),
    name, email, subject, message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(msg);
  res.status(201).json({ message: 'Your message has been received. We\'ll be in touch within 24 hours.' });
});

router.get('/', authenticate, requireAdmin, (req, res) => {
  res.json({ messages });
});

module.exports = router;
