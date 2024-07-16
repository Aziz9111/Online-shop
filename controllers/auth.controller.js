const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/flash-session");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      name: "",
      email: "",
      confirmedEmail: "",
      confirmedPassword: "",
      password: "",
      street: "",
      city: "",
    };
  }
  res.render("customers/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    name: req.body.name,
    email: req.body.email,
    confirmedEmail: req.body.confirmedEmail,
    password: req.body.password,
    confirmedPassword: req.body.comparePassword,
    street: req.body.street,
    city: req.body.city,
  };

  if (
    !validation.validUserData(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.street,
      req.body.city
    ) ||
    !validation.emailConfirmed(req.body.email, req.body.confirmedEmail) ||
    !validation.passwordConfirmed(req.body.password, req.body.confirmedPassword)
  ) {
    sessionFlash.falshSessionData(
      req,
      {
        errorMessage: "Please Enter Valid Data",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.street,
    req.body.city
  );

  try {
    const userExistAlready = await user.userExist();

    if (userExistAlready) {
      sessionFlash.falshSessionData(
        req,
        {
          errorMessage: "User Exists",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );

      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customers/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(null, req.body.email, req.body.password);

  let existingUser;

  try {
    existingUser = await user.getUserEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionData = {
    errorMessage: "User does not exists",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.falshSessionData(req, sessionData, () => {
      res.redirect("/login");
    });
    return;
  }

  const isPasswordValid = await user.comparePassword(existingUser.password);

  if (!isPasswordValid) {
    sessionFlash.falshSessionData(req, sessionData, () => {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
