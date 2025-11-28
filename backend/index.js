const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Middlewares
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sess',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport session serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:5000/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        emails: profile.emails,
      };
      return done(null, user);
    }
  )
);

// Start OAuth flow
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/auth/failure` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.redirect(`${FRONTEND_URL}/auth/success`);
  }
);

app.use(router);

// ================= ADD /api/me HERE =================
app.get('/api/me', (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ ok: true, user: payload });
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
});
// =====================================================

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Mongoose connected successfully'))
  .catch((err) => console.error('Mongoose connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
