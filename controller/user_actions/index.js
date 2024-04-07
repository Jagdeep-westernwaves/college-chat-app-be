exports.updateUser = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "update tbllog set name =' " +
      emp.name +
      "', pswd = '" +
      emp.pswd +
      "' ,email = '" +
      emp.email +
      " ', mobno = '" +
      emp.mobno +
      "', isactive = " +
      emp.status +
      " where id=" +
      emp.id,
    (err, rows, fields) => {
      if (!err) {
        res.send("User Updated");
      } else {
        console.log(err);
      }
    }
  );
};
exports.updatesUser = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "update tbllog set name= ?,bio=?,mobno=?,email=?, where uname=? ",
    [emp.name, emp.bio, emp.mobno, emp.email, emp.uname],
    (err, rows, fields) => {
      if (!err) {
        res.send("updated");
      } else {
        console.log(err);
      }
    }
  );
};
exports.getAllFriendList = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "SELECT name,uname,imgname,id,mobno,email, 3 as req FROM tbllog WHERE id IN ( SELECT fid FROM frnd WHERE req=1 and confirm=1 and lid=" +
      emp.srch +
      " ) or id IN ( SELECT lid FROM frnd WHERE req=1 and confirm=1 and fid=" +
      emp.srch +
      " ) and id!=" +
      emp.srch +
      " UNION select tbllog.name,tbllog.uname,tbllog.imgname,tbllog.id,tbllog.mobno,tbllog.email, 1 as req from tbllog inner join frnd where tbllog.id=frnd.fid and frnd.req=1 and frnd.confirm=0 and frnd.lid=" +
      emp.srch +
      " union select tbllog.name,tbllog.uname,tbllog.imgname,tbllog.id,tbllog.mobno,tbllog.email,2 as req from tbllog inner join frnd where tbllog.id=frnd.lid and frnd.req=1 and frnd.confirm=0 and frnd.fid=" +
      emp.srch +
      " union SELECT name,uname,imgname,id,mobno,email, 0 as req FROM tbllog WHERE id NOT IN ( SELECT fid FROM frnd WHERE req=1 and lid=" +
      emp.srch +
      " ) and id NOT IN ( SELECT lid FROM frnd WHERE req=1 and fid=" +
      emp.srch +
      " ) and id!=" +
      emp.srch,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(rows);
      }
    }
  );
};
exports.sendFriendRequest = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "insert into frnd(lid,fid,req) values(?,?,1)",
    [emp.lid, emp.fid],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
};
exports.cancelFriendRequest = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "delete from frnd where fid =? and lid=?",
    [emp.fid, emp.lid],
    (err, rows, fields) => {
      if (!err) {
        res.send({
          status: true,
          message: "Request cancelled successfully!",
        });
      } else {
        console.log(err);
      }
    }
  );
};
exports.confirmFriendRequest = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "update frnd set confirm= 1 where fid=? and lid =?",
    [emp.fid, emp.lid],
    (err, rows, fields) => {
      if (!err) {
        res.send({
          status: true,
          message: "Friend request accepted successfully",
        });
      } else {
        console.log(err);
      }
    }
  );
};
exports.geFriendRequestList = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "select tbllog.name,tbllog.uname,tbllog.imgname,tbllog.id,tbllog.mobno,tbllog.email from tbllog inner join frnd where tbllog.id=frnd.lid and frnd.req=1 and frnd.confirm=0 and frnd.fid=" +
      emp.srch,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
};
exports.getFriendsList = async (req, res, mysqlConnection) => {
  let emp = req.body;
  mysqlConnection.query(
    "SELECT uname,name,mobno,join_date,imgname,id FROM tbllog WHERE id IN ( SELECT fid FROM frnd WHERE req=1 and confirm=1 and lid=" +
      emp.srch +
      " ) or id IN ( SELECT lid FROM frnd WHERE req=1 and confirm=1 and fid=" +
      emp.srch +
      " ) and id!=" +
      emp.srch,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
};
