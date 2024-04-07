const mysql = require("mysql");
const http = require("http");
const jwt = require("jsonwebtoken");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const port = 9000;
const { Server } = require("socket.io");
const bodyparser = require("body-parser");
const YOUR_DOMAIN = "*";
var app = express();
const stripe = require("stripe")(
  "sk_test_51J7vejSI1qwIpFo6iveLfFQUFqiD8STchvE8cf3ecBBahjSyMZ3QxJpIDJMGvOCylKinC5o6ek55n5zCifoEaUD100xLwUaANc"
);
app.use(
  cors({
    origin: YOUR_DOMAIN,
    optionsSuccessStatus: 200, // For legacy browser support
  })
);
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
    origin: YOUR_DOMAIN,
  },
});
exports.io = io;
app.use("/uploads", express.static("Uploads"));

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
  socket.on("send_msg", () => {
    io.emit("recieve_msg", "Message received");
  });
  socket.on("user_request", () => {
    io.emit("recieve_request", "Request received");
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
require("./routes")(app, mysqlConnection);
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
