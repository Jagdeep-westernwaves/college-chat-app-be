const { io } = require("../..");

exports.sendMessages = async (req, res, mysqlConnection) => {
  let emp = req.body;
  if (emp.uname && emp.lid && emp.msg) {
    mysqlConnection.query(
      "select id, count(*) as count from tbllog where uname=?",
      [emp?.uname],
      (err, rows, fields) => {
        if (rows[0].count > 0) {
          mysqlConnection.query(
            "INSERT INTO `chatmsg`(`sId`, `rId`,`CloneMsg`) VALUES (?,?,?)",
            [emp.lid, rows[0].id, emp.msg],
            (err, rowss, fields) => {
              if (!err) {
                io.emit("recieve_msg_" + emp.uname, () => {});
                res.send({ message: "sent" });
              } else {
                console.log(err);
              }
            }
          );
        }
      }
    );
  } else {
    res.status(400).send({ message: "Invalid payload" });
  }
};
exports.getMessages = async (req, res, mysqlConnection) => {
  const emp = req.body;
  mysqlConnection.query(
    "select id, count(*) as count from tbllog where uname=?",
    [emp?.uname],
    (err, rows, fields) => {
      if (rows[0].count > 0) {
        mysqlConnection.query(
          "SELECT * FROM `chatmsg` WHERE sId = ? and rId = ? UNION SELECT * from chatmsg where sId=?  and rId = ? ORDER BY `createAt` ASC",
          [emp.lid, rows[0].id, rows[0].id, emp.lid],
          (err, rows, fields) => {
            if (!err) {
              res.send(rows);
            } else {
              console.log(err);
            }
          }
        );
      }
    }
  );
};
