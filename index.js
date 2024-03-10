const mysql = require("mysql");
const http = require("http");
const jwt = require("jsonwebtoken");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const port = 9000;
const { Server } = require("socket.io");
const bodyparser = require("body-parser");
const { map, uniqBy, get, random } = require("lodash");
var app = express();
const stripe = require("stripe")(
  "sk_test_51J7vejSI1qwIpFo6iveLfFQUFqiD8STchvE8cf3ecBBahjSyMZ3QxJpIDJMGvOCylKinC5o6ek55n5zCifoEaUD100xLwUaANc"
);
const auth = async (req, res, next) => {
  try {
    const token = req.body.token;
    const ver = jwt.verify(token, "Testingjwt");
    next();
  } catch (err) {
    console.log("err");
    mysqlConnection.query(
      `SELECT reftoken from tbllog where id=` + req.body.id,
      (err, rows, fields) => {
        if (!err) {
          const reftoken = rows[0].reftoken;
          const ver = jwt.verify(reftoken, "Testingjwt");
          const token = jwt.sign(
            {
              Id: ver.Id,
              user: ver.user,
            },
            "Testingjwt",
            {
              expiresIn: "1m",
            }
          );
          next();
        } else {
          console.log("hello", err);
        }
      }
    );
  }
};

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    optionsSuccessStatus: 200, // For legacy browser support
  })
);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// server.listen(9000);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.postimg);
  },
});
const upload = multer({ storage: storage });
app.use(express.static("public"));
app.use(bodyparser.json());
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo",

  multipleStatements: true,
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use("/uploads", express.static("Uploads"));
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("send_msg", () => {
    // Emit "recieve_msg" event to the client
    io.emit("recieve_msg", "Message received"); // Use 'io.emit' to send the event to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  mysqlConnection.query(
    `SELECT id,name,mobno,email,uname,isactive, join_date,imgname,(case when isactive=0 then 'Inactive' else 'Active' end)as status from tbllog ORDER BY tbllog.join_date  ASC`,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/date", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    `SELECT name,mno,remarks,uid,DATE_FORMAT(createtym, '%Y-%m-%d')as cdate,
    DATE_FORMAT(edate, '%Y') as Datey,DATE_FORMAT(edate, '%m') as Datem,DATE_FORMAT(edate, '%d') as Dated from eventmng where edate=?`,
    [emp.edate],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/event", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "insert into eventmng(name,mno,remarks,uid,edate,isactive) values(?,?,?,?,?,1)",
    [emp.name, emp.mno, emp.remarks, emp.uid, emp.edate],
    (err, rows, fields) => {
      if (!err) {
        res.send("inserted");
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/sendMsg", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "INSERT INTO `chatmsg`(`sId`, `rId`,`CloneMsg`) VALUES (?,?,?)",
    [emp.lid, emp.fid, emp.msg],
    (err, rows, fields) => {
      if (!err) {
        mysqlConnection.query(
          "SELECT * FROM `chatmsg` WHERE sId = ? and rId = ? UNION SELECT * from chatmsg where sId=?  and rId = ? ORDER BY `createAt` ASC limit 150",
          [emp.lid, emp.fid, emp.fid, emp.lid],
          (err, rows, fields) => {
            if (!err) {
              res.send(rows);
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/hndleMsg", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "SELECT * FROM `chatmsg` WHERE sId = ? and rId = ? UNION SELECT * from chatmsg where sId=?  and rId = ? ORDER BY `createAt` ASC limit 150",
    [emp.lid, emp.fid, emp.fid, emp.lid],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/reg", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "select count(*) from tbllog where uname=?",
    [emp.uname],
    (err, rows, fields) => {
      if (rows[0].count == 0) {
        mysqlConnection.query(
          "insert into tbllog(name,email,uname,pswd,mobno,isactive) values(?,?,?,?,?,1)",
          [emp.name, emp.email, emp.uname, emp.pswd, emp.mobno],
          (err, rows, fields) => {
            if (!err) {
              res.send({
                status: true,
                message:
                  "Registered Successfully. Please LogIn Using you Login credentials",
              });
            } else {
              console.log(err);
            }
          }
        );
      } else {
        res.send({
          status: false,
          message: "User Name already exist, Please Try New One Like :",
          suggestedUname: emp.name + random(1000, 1111),
        });
      }
    }
  );
});
app.post("/log", (req, res) => {
  let emp = req.body;
  console.log(emp);
  if ((emp.uname === "", emp.pswd === "")) {
    console.log("Fill All Required Fields");
    res.status(200).send("Fill All Required Fields");
  } else {
    mysqlConnection.query(
      "select count(*) as count,name,uname,email,id,imgname,picBgoogle from tbllog where isactive = 1 and pswd=? and email=? or uname=? or mobno=?",
      [emp.pswd, emp.uname, emp.uname, emp.uname],
      (err, rows, fields) => {
        if (rows[0].count === 1) {
          console.log("Success");
          const token = jwt.sign(
            {
              Id: rows[0].id,
              user: rows[0].uname,
            },
            "Testingjwt",
            {
              expiresIn: "1m",
            }
          );
          rows[0].token = token;
          // res.send(token);
          res.send(rows[0]);
        } else if (rows[0].count === 0) {
          console.log("You are not Regiser, please Sign Up");
          res.status(200).send("You are not Regiser,please Sign Up");
        } else {
          console.log("password not Match ");
          res.status(200).send("password not Match");
        }
      }
    );
  }
});
app.post("/user", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "select count(*) as count from tbllog where uname=?",
    [emp.uname],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/profile", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "select uname,name,mobno,join_date,imgname,id,email from tbllog where isactive = 1 and uname=? ",
    [emp.uname],
    (err, rows, fields) => {
      if (!err) {
        let newData = [];
        mysqlConnection.query(
          "select * from postmanager where isactive = 1 and uid= " + rows[0].id,
          (err, rowss, fields) => {
            if (!err) {
              map(rowss, (items) => {
                mysqlConnection.query(
                  "select *,count(*) from commentpost where pId = " + items.id,
                  (err, commentuRows, fields) => {
                    if (!err) {
                      mysqlConnection.query(
                        "select *,(SELECT COUNT(*) from likeposts where pId=  " +
                          items.id +
                          ") as count from likeposts where pId = " +
                          items.id +
                          " ORDER BY `likeposts`.`likedTime` DESC",
                        (err, likeuRows, fields) => {
                          if (!err) {
                            items.isLike = get(likeuRows[0], "sts", 0);
                            items.likeCount = get(likeuRows[0], "count", 0);
                            items.commentCount =
                              commentuRows[0].count > 0
                                ? commentuRows[0].count
                                : 0;
                            newData.push(items);
                          } else {
                            console.log(err);
                          }
                        }
                      );
                    } else {
                      console.log(err);
                    }
                  }
                );
              });
              let data = rows[0];
              data.posts = newData;
              setTimeout(() => {
                res.send(data);
              }, 300);
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    }
  );
});

app.post("/refjwt", (req, res) => {
  console.log(req.body);
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
              expiresIn: "1m",
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
});
app.post("/updates", (req, res) => {
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
});
app.post("/image", upload.single("demo_image"), (req, res) => {
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
});
app.post("/getposts", (req, res) => {
  let emp = req.body;
  let userId = emp.userId;
  mysqlConnection.query(
    "select fid, lid from frnd where confirm = 1 and lid = " +
      userId +
      " or fid = " +
      userId,
    (err, rows, fields) => {
      let finalPosts = [];
      let uniqFData = uniqBy(rows, "fid");
      let uniqLData = uniqBy(rows, "lid");
      let uniqData = [];
      map(uniqFData, (fdata) => {
        uniqData.push(fdata.fid);
      });
      map(uniqLData, (fdata) => {
        uniqData.push(fdata.lid);
      });
      if (!err) {
        map(uniqData, (item) => {
          mysqlConnection.query(
            "select * from postmanager where uid = " +
              item +
              " or uid = " +
              emp.userId+" ORDER BY `postmanager`.`createat` DESC",
            (err, rowss, fields) => {
              if (!err) {
                map(rowss, (data) => {
                  finalPosts.push(data);
                });
                mysqlConnection.query(
                  //privacysts 1 means public
                  "select * from postmanager where privacysts = 1 and isactive = 1 ORDER BY `postmanager`.`createat` DESC",
                  (err, rowsss, fields) => {
                    if (!err) {
                      map(rowsss, (datas) => {
                        finalPosts.push(datas);
                      });
                    } else {
                      console.log(err);
                    }
                  }
                );
              } else {
                console.log(err);
              }
            }
          );
        });
        setTimeout(() => {
          let newData = [];
          let uniqueData = uniqBy(finalPosts, "id");
          map(uniqueData, (items) => {
            mysqlConnection.query(
              "select imgname, picBgoogle, uname from tbllog where isactive = 1 and id = " +
                items.uid,
              (err, uRows, fields) => {
                if (!err) {
                  mysqlConnection.query(
                    "select *,count(*) from commentpost where pId = " +
                      items.id,
                    (err, commentuRows, fields) => {
                      if (!err) {
                        mysqlConnection.query(
                          "select *,(SELECT COUNT(*) from likeposts where pId=  " +
                            items.id +
                            ") as count from likeposts where pId = " +
                            items.id +
                            " ORDER BY `likeposts`.`likedTime` DESC",
                          (err, likeuRows, fields) => {
                            if (!err) {
                              items.isLike = get(likeuRows[0], "sts", 0);
                              items.likeCount = get(likeuRows[0], "count", 0);
                              items.commentCount =
                                commentuRows[0].count > 0
                                  ? commentuRows[0].count
                                  : 0;
                              items.imgname =
                                get(uRows[0], "picBgoogle", "") !== ""
                                  ? uRows[0].picBgoogle
                                  : uRows[0].imgname;
                              items.uname = uRows[0].uname;
                              newData.push(items);
                            } else {
                              console.log(err);
                            }
                          }
                        );
                      } else {
                        console.log(err);
                      }
                    }
                  );
                } else {
                  console.log(err);
                }
              }
            );
          });
          setTimeout(() => {
            res.json(newData);
          }, 800);
        }, 300);
      } else {
        console.log(err);
      }
    }
  );
});

app.post("/handleLikeButton", (req, res) => {
  let emp = req.body;
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
});

app.post("/postpost", upload.single("demo_image"), (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    'insert into postmanager (posttitle, privacysts, postimg, uid ,isactive) values( "' +
      emp.posttitle +
      '",' +
      // emp.postDes +
      // '",' +
      emp.privacysts +
      ',"' +
      emp.postimg +
      '",' +
      emp.uid +
      ",1)",
    (err, rows, fields) => {
      if (!err) {
        res.send("updated");
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/frnd", (req, res) => {
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
});
app.post("/addfrnd", (req, res) => {
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
});
app.post("/removereq", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "delete from frnd where fid =? and lid=?",
    [emp.fid, emp.lid],
    (err, rows, fields) => {
      if (!err) {
        res.send("updated");
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/confirmfrnd", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "update frnd set confirm= 1 where fid=? and lid =?",
    [emp.fid, emp.lid],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/confirm", (req, res) => {
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
});
app.post("/addedfrnd", (req, res) => {
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
});

app.put("/update", (req, res) => {
  console.log(req.body);

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
});
app.get("/allts", (req, res) => {
  mysqlConnection.query(
    "select * from ts where isactive=1",

    (err, rows, fields) => {
      const data = [];
      rows.map((item) => {
        mysqlConnection.query(
          "select * from tsimg where tsid=" + item.id,

          (errs, rowss, fieldss) => {
            data.push({
              id: item.id,
              sname: item.sname,
              title: item.title,
              des: item.des,
              isactive: item.isactive,
              dataa: rowss,
            });
          }
        );
      });

      setTimeout(() => {
        res.send(data);
      }, 20);
    }
  );
});
app.post("/tsbyid", (req, res) => {
  mysqlConnection.query(
    "select * from ts where isactive=1 and id=" + req.body.id,
    (err, rows, fields) => {
      const data = [];
      rows.map((item) => {
        mysqlConnection.query(
          "select * from tsimg where tsid=" + item.id,
          (errs, rowss, fieldss) => {
            data.push({
              id: item.id,
              sname: item.sname,
              title: item.title,
              des: item.des,
              isactive: item.isactive,
              dataa: rowss,
            });
            res.send(data);
          }
        );
      });
    }
  );
});
app.post("/tsimg", upload.single("demo_image"), (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "INSERT INTO tsimg(tsid, title, imgpath, isactive) VALUES ('" +
      emp.tsid +
      "','" +
      emp.title +
      "','" +
      emp.postimg +
      "',1)",
    [emp.lid, emp.fid],
    (err, rows, fields) => {
      if (!err) {
        rows.imgpath = emp.postimg;
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.put("/tspost", (req, res) => {
  let emp = req.body;
  mysqlConnection.query(
    "INSERT INTO ts(sname, title, des, isactive) VALUES ('" +
      emp.sname +
      "','" +
      emp.title +
      "','" +
      emp.des +
      "',1)",
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.put("/tsedit", (req, res) => {
  console.log(req.body);

  let emp = req.body;
  mysqlConnection.query(
    `update ts set title = "` +
      emp.title +
      `" ,des = "` +
      emp.des +
      ` " where id=` +
      emp.id,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
app.post("/deltspic", (req, res) => {
  mysqlConnection.query(
    "UPDATE `tsimg` SET `isactive`=0" + req.body.id,

    (err, rows, fields) => {
      res.send(rows);
    }
  );
});
app.get("/rukozra", async (req, res) => {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
  });
  res.send({ prices: prices.data });
});
app.get("/productlist", async (req, res) => {
  const products = await stripe.products.list();
  const product = [];

  products.data.map(async (item) => {
    const prices = await stripe.prices.list({
      product: item.id,
    });
    const m = prices.data.filter((items) => {
      return items.recurring.interval === "month" && items.product === item.id;
    });
    const y = prices.data.filter((items) => {
      return items.recurring.interval === "year" && items.product === item.id;
    });
    product.push({
      pdid: item.id,
      name: item.name,
      mid: m[0].id,
      yid: y[0].id,
      mprice: m[0].unit_amount,
      yprice: y[0].unit_amount,
    });
  });
  setTimeout(() => {
    res.send(product);
  }, 1000);
});
app.post("/create-customer", async (req, res) => {
  const customer = await stripe.customers.create({
    email: req.body.email,
    name: req.body.uname,
  });

  res.cookie("customer", customer.id, { maxAge: 900000, httpOnly: true });

  res.send({ customer: customer });
});
app.post("/create-subscription", async (req, res) => {
  const customerId = req.body.customer;
  const priceId = req.body.priceId;
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
});
const YOUR_DOMAIN = "http://localhost:3000/";
app.post("/create-checkout-session", async (req, res) => {
  const customerId = req.body.customer;
  const priceId = req.body.priceId;
  const price = req.body.price;
  const product = req.body.product;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product,
            images: ["https://i.imgur.com/EHyR2nP.png"],
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}`,
    cancel_url: `${YOUR_DOMAIN}`,
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  // res.send({
  //   subscriptionId: subscription.id,
  //   clientSecret:
  //     subscription.latest_invoice.payment_intent.client_secret,
  // });

  res.send(session.url);
});
server.listen(port, () => {
  console.log(`Chat application listening on port ${port}`);
});
