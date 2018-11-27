const mongoose = require("mongoose");
const passport = require("passport");
const router = require("express").Router();
const auth = require("../auth");
const User = mongoose.model("users");

//POST new user route (optional, everyone has access)
router.post("/", auth.optional, (req, res) => {  
  User.find({
    email: req.body.email
  })
  .then(user => {
    if (user.length != 0) {
      return res.status(422).json({
        errors: {
          email: "is taken"
        }
      });
    } 
    if (!req.body.name) {
      return res.status(422).json({
        errors: {
          name: "is required"
        }
      });
    }
    if (!req.body.email) {
      return res.status(422).json({
        errors: {
          email: "is required"
        }
      });
    }
    if (!req.body.password) {
      return res.status(422).json({
        errors: {
          password: "is required"
        }
      });
    } else {
      const finalUser = new User(req.body);
      finalUser.setPassword(req.body.password);
      return finalUser
        .save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
    }
  })
  .catch(err => console.log(err));
});

//POST login route (optional, everyone has access)
router.post("/login", auth.optional, (req, res, next) => {
    const user = req.body
    console.log(user)


  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required"
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required"
      }
    });
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return status(400).info;
    }
  )(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get("/current", auth.required, (req, res, next) => {
  const {
    payload: { id }
  } = req;

  return User.findById(id).then(user => {
    if (!user) {
      return res.sendStatus(400);
    }

    return res.json({ user: user.toAuthJSON() });
  });
});

module.exports = router;