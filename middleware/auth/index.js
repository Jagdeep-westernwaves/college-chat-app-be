const jwt = require("jsonwebtoken");
exports.tokenAuth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const userDetails = jwt.verify(token, "Testingjwt");
    req.body = { ...req.body, userDetails };
    next();
  } catch (err) {
    res.status(401).send({ status: false, error: err });
    console.log("Auth Error: " + err?.message);
  }
};
