const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// STEP 1: Redirect to GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// STEP 2: GitHub Callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        avatar: req.user.avatar,
        lastActiveRole: req.user.lastActiveRole
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

res.redirect(
  `http://localhost:5173/auth-success?token=${encodeURIComponent(token)}`
);
  }
);


module.exports = router;
