const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyparser = require("body-parser");
var app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const upload = multer({ storage: storage });

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use("/Upload", express.static("Upload"));
app.use(bodyparser.json());
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo",
  multipleStatements: true,
});
app.listen(9000);

app.post("/user", (req, res) => {
  let emp = req.body;
  console.log(req.body);
  mysqlConnection.query(
    "select email,name from tbllog where isactive = 1",
    (err, rows, fields) => {
      if (!err) {
        if (rows.length > 0) {
          rows.map((item) => {
            console.log(item);

            sendSmtpEmail.subject = "My {{params.subject}}";
            sendSmtpEmail.htmlContent =
              "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
            sendSmtpEmail.sender = {
              name: "John Doe",
              email: "jagdeepsharma.seo@gmail.com",
            };
            sendSmtpEmail.to = [{"email":item.email,"name":item.name}];
            sendSmtpEmail.cc = [
              { email: "abhijeetbhandari3000@gmail.com", name: "Janice Doe" },
            ];
            sendSmtpEmail.params = {
              parameter: "My param value",
              subject: "New Subject",
            };

            apiInstance.sendTransacEmail(sendSmtpEmail).then(
              function (data) {
                console.log(
                  "API called successfully. Returned data: " +
                    JSON.stringify(data)
                );
              },
              function (error) {
                console.error("inner error : "+error);
              }
            );
          });
        }
      } else {
        console.log("outer error : "+err);
      }
    }
  );
});

app.post("/user", (req, res) => {
  let verifycode = Math.floor(1000+Math.random()*9000);

    let emp = req.body;
    console.log(req.body);
    mysqlConnection.query(
      "select email,name from tbllog where isactive = 1",
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            rows.map((item) => {
              console.log(item);
  
              sendSmtpEmail.subject = "My {{params.subject}}";
              sendSmtpEmail.htmlContent =
                "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
              sendSmtpEmail.sender = {
                name: "John Doe",
                email: "jagdeepsharma.seo@gmail.com",
              };
              sendSmtpEmail.to = [{"email":item.email,"name":item.name}];
              sendSmtpEmail.cc = [
                { email: "abhijeetbhandari3000@gmail.com", name: "Janice Doe" },
              ];
              sendSmtpEmail.params = {
                parameter: "My param value",
                subject: "New Subject",
              };
  
              apiInstance.sendTransacEmail(sendSmtpEmail).then(
                function (data) {
                  console.log(
                    "API called successfully. Returned data: " +
                      JSON.stringify(data)
                  );
                },
                function (error) {
                  console.error("inner error : "+error);
                }
              );
            });
          }
        } else {
          console.log("outer error : "+err);
        }
      }
    );
  });
  