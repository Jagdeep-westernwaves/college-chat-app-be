exports.getUserProfile = async (req, res, mysqlConnection) => {
  let emp = req.body;
  if (emp.id && emp.uname) {
    mysqlConnection.query(
      "select count(*) as count,uname,name,mobno,join_date,imgname,id,email from tbllog where isactive = 1 and uname=? ",
      [emp.uname],
      (err, rows, fields) => {
        if (!err) {
          if (rows[0].count > 0) {
            mysqlConnection.query(
              `select postmanager.*, tbllog.imgname, tbllog.uname,(SELECT COUNT(*) FROM likeposts where pId = postmanager.id) as likeCount,(SELECT COUNT(*) FROM commentpost where pId = postmanager.id) as commentCount,COALESCE((SELECT sts FROM likeposts where pId = postmanager.id and uid=${emp.id}),0) as isLike from postmanager JOIN tbllog on postmanager.uid= tbllog.id WHERE (postmanager.uid = ${rows[0].id}) and postmanager.isactive = 1 GROUP BY postmanager.id ORDER BY postmanager.createat DESC;`,
              (err, rowss, fields) => {
                if (!err) {
                  rows[0].posts = rowss;
                  res.json(rows[0]);
                } else {
                  console.log(err);
                }
              }
            );
          } else {
            res.status(400).send({
              status: false,
              message: "Invalid Request",
            });
          }
        } else {
          console.log(err);
        }
      }
    );
  } else {
    res.status(400).send({
      message: "Invalid Request",
    });
  }
};
exports.updateUserProfilePicture = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "update tbllog set imgname=? where uname=?",
    [emp.postimg, emp.uname],
    (err, rows, fields) => {
      if (!err) {
        res.send("updated");
      } else {
        console.log(err);
      }
    }
  );
};
