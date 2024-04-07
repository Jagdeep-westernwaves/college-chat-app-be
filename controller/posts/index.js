exports.getPosts = async (req, res, mysqlConnection) => {
  let emp = req.body;
  const userId = emp.userDetails.Id;
  mysqlConnection.query(
    `select postmanager.*, tbllog.imgname, tbllog.uname,(SELECT COUNT(*) FROM likeposts where pId = postmanager.id) as likeCount,(SELECT COUNT(*) FROM commentpost where pId = postmanager.id) as commentCount,COALESCE((SELECT sts FROM likeposts where pId = postmanager.id and uid=${userId}),0) as isLike from postmanager JOIN tbllog on postmanager.uid= tbllog.id WHERE (postmanager.uid IN (SELECT DISTINCT CASE WHEN fid != ${userId} THEN fid ELSE lid END AS uid FROM frnd WHERE confirm = 1 AND (fid = ${userId} OR lid = ${userId})) or postmanager.uid=${userId}) OR postmanager.privacysts = 1 and postmanager.isactive = 1 GROUP BY postmanager.id ORDER BY postmanager.createat DESC;`,
    (err, rowss, fields) => {
      if (!err) {
        res.json(rowss);
      } else {
        console.log(err);
      }
    }
  );
};
exports.postPost = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    'insert into postmanager (posttitle, privacysts, postimg, uid ,isactive) values( "' +
      emp.posttitle +
      '",' +
      emp.privacysts +
      ',"' +
      emp.postimg +
      '",' +
      emp.uid +
      ",1)",
    (err, rows, fields) => {
      if (!err) {
        res.send({ status: true, message: "Post is posted successfully!" });
      } else {
        console.log(err);
      }
    }
  );
};
exports.handleLikePost = async (req, res, mysqlConnection) => {
  let emp = req.body;
  await mysqlConnection.query(
    `DELETE FROM likeposts WHERE uid=${emp.uid} AND pId=${emp.pId}`
  );
  mysqlConnection.query(
    "INSERT INTO `likeposts`(`uid`, `pId`, `sts`) VALUES (" +
      emp.uid +
      "," +
      emp.pId +
      "," +
      emp.sts +
      ")",
    (err, likeuRows, fields) => {
      if (!err) {
        res.status(200).send(emp.sts == 1 ? "Post Liked" : "Like Removed");
      } else {
        console.log(err);
      }
    }
  );
};
