const jwt = require("jsonwebtoken");
const { random } = require("lodash");
exports.login = async (req, res, mysqlConnection) => {
  let emp = req.body;
  if (emp.uname === "" || emp.pswd === "") {
    res.status(400).send({
      status: false,
      message: "Fill All Required Fields",
    });
  } else {
    const { uname, pswd } = emp;
    mysqlConnection.query(
      "select count(*) as count,name,uname,email,id,imgname,picBgoogle from tbllog where isactive = 1 and pswd=? and email=? or uname=? or mobno=?",
      [pswd, uname, uname, uname],
      (err, rows, fields) => {
        if (rows[0].count === 1) {
          const token = jwt.sign(
            {
              Id: rows[0].id,
              user: rows[0].uname,
            },
            "Testingjwt",
            {
              expiresIn: "1h",
            }
          );
          rows[0].token = token;
          res.send(rows[0]);
        } else if (rows[0].count === 0) {
          res.status(200).send({
            status: false,
            message: "You are not Regiser, please Sign Up",
          });
        } else {
          res.status(200).send({
            status: false,
            message: "Login details doesn't match with any user!",
          });
        }
      }
    );
  }
};
exports.registerUser = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "select count(*) as count from tbllog where uname=?",
    [emp.uname],
    (err, rows, fields) => {
      if (rows[0].count == 0) {
        const { name, email, uname, pswd, mobno } = emp;
        mysqlConnection.query(
          "insert into tbllog(name,email,uname,pswd,mobno,isactive) values(?,?,?,?,?,1)",
          [name, email, uname, pswd, mobno],
          (err, rows, fields) => {
            if (!err) {
              res.send({
                status: true,
                message: "Registered successfully.",
              });
            } else {
              console.log(err);
            }
          }
        );
      } else {
        res.status(400).send({
          status: false,
          message: `Username already exist, please try new one like : “${
            emp.uname + random(1000, 1111)
          }”`,
          suggestedUname: emp.uname + random(1000, 1111),
        });
      }
    }
  );
};
exports.referanceTokenGenerator = async (req, res, mysqlConnection) => {
  try {
    mysqlConnection.query(
      "SELECT reftoken from tbllog where id=" + req.body.id,

      (err, rows, fields) => {
        if (!err) {
          const reftoken = rows.reftoken;
          const ver = jwt.verify(reftoken, "Testingjwt");
          const token = jwt.sign(
            {
              Id: ver.Id,
              user: ver.user,
            },
            "Testingjwt",
            {
              expiresIn: "1h",
            }
          );
          res.send(token);
        } else {
          console.log("hello", err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
