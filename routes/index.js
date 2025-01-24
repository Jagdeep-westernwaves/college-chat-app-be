const { login, registerUser } = require("../controller/auth");
const { sendMessages, getMessages } = require("../controller/chat");
const { getPosts, postPost, handleLikePost } = require("../controller/posts");
const {
  getUserProfile,
  updateUserProfilePicture,
} = require("../controller/profiles");
const {
  sendFriendRequest,
  getAllFriendList,
  cancelFriendRequest,
  getFriendsList,
  geFriendRequestList,
  updateUser,
  updatesUser,
  confirmFriendRequest,
} = require("../controller/user_actions");
const { tokenAuth } = require("../middleware/auth");
const { uploadFile } = require("../middleware/upload");

module.exports = (app, mysqlConnection) => {
  // Authentication section
  app.post("/log", (req, res) => login(req, res, mysqlConnection));
  app.post("/reg", (req, res) => registerUser(req, res, mysqlConnection));
  app.post("/refjwt", (req, res) =>
    referanceTokenGenerator(req, res, mysqlConnection)
  );
  // Posts section
  app.post("/postpost", uploadFile.single("demo_image"), (req, res) =>
    postPost(req, res, mysqlConnection)
  );
  app.get("/getposts", tokenAuth, (req, res) =>
    getPosts(req, res, mysqlConnection)
  );
  app.post("/handleLikeButton", async (req, res) =>
    handleLikePost(req, res, mysqlConnection)
  );
  // Users Actions section
  app.post("/image", uploadFile.single("demo_image"), (req, res) =>
    updateUserProfilePicture(req, res, mysqlConnection)
  );
  app.post("/profile", (req, res) => getUserProfile(req, res, mysqlConnection));
  app.post("/frnd", (req, res) => getAllFriendList(req, res, mysqlConnection));
  app.post("/addfrnd", (req, res) =>
    sendFriendRequest(req, res, mysqlConnection)
  );
  app.post("/removereq", (req, res) =>
    cancelFriendRequest(req, res, mysqlConnection)
  );
  app.post("/confirmfrnd", (req, res) =>
    confirmFriendRequest(req, res, mysqlConnection)
  );
  app.post("/confirm", (req, res) =>
    geFriendRequestList(req, res, mysqlConnection)
  );
  app.post("/addedfrnd", (req, res) =>
    getFriendsList(req, res, mysqlConnection)
  );
  app.put("/update", (req, res) => updateUser(req, res, mysqlConnection));
  app.post("/updates", (req, res) => updatesUser(req, res, mysqlConnection));
  // chat section
  app.post("/sendMsg", (req, res) => sendMessages(req, res, mysqlConnection));
  app.post("/hndleMsg", (req, res) => getMessages(req, res, mysqlConnection));
};
