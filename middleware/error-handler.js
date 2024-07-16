function errorHanlder(error, req, res, next) {
  if ((error.code = 404)) {
    console.log(error);
    return res.status(404).render("shared/404");
  }
  console.log(error);
  res.status(500).render("shared/500");
}

module.exports = errorHanlder;
