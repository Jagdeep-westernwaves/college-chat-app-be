const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.postimg);
  },
});
exports.uploadFile = multer({ storage: storage });
