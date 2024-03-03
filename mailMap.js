const mysql = require(`mysql`);
const express = require(`express`);
const router = express.Router();
var mysqlConnection = mysql.createConnection({
  host: `localhost`,
  user: `root`,
  password: ``,
  database: `demo`,

  multipleStatements: true,
});
const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require(`sib-api-v3-sdk`);
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications[`api-key`];
apiKey.apiKey = `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`;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
router.post(`/verify`, (req, res) => {
  console.log("ffgfgfgfgfgfgfgf");
  const emp = req.body;
  mysqlConnection.query(
    "select id,status from tbllog where email = ?;",
    [emp.email],
    (err, rows, fields) => {
      console.log(rows[0].status);
      if (rows[0].status === 0) {
        let verifycode = Math.floor(1000 + Math.random() * 9000);
        const ctoken = jwt.sign(
          { email: emp.email, vCode: verifycode },
          process.env.JWT_REFRESH_TOKEN
        );
        sendSmtpEmail.subject = `My ${emp.name}`;
        sendSmtpEmail.htmlContent = `<table width="100%" cellspacing="0" cellpadding="0">
         <tr>
             <td>
                 <table cellspacing="0" cellpadding="0">
                     <tr><td style="color: #000; "> Verify our Account</td>  </tr>  <tr>
                         <td style="border-radius: 2px;" bgcolor="#ED2939">
                         <a href="http://localhost:3000/verify/${ctoken}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                               Verify   
                             </a>
                         </td>
                     </tr>
                 </table>
             </td>
         </tr>
       </table>`;
        sendSmtpEmail.sender = {
          name: `Western Waves`,
          email: `market@weternwaves.in`,
        };
        sendSmtpEmail.to = [{ email: emp.email, name: emp.name }];
        sendSmtpEmail.cc = [
          { email: `market@weternwaves.in`, name: `Western Waves` },
        ];
        sendSmtpEmail.params = {
          parameter: `My param value`,
          subject: `New Subject`,
        };

        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
            console.log(
              `API called successfully. Returned data: ` + JSON.stringify(data)
            );
          },
          function (error) {
            console.error(error);
          }
        );
        mysqlConnection.query(
          "update tbllog set cverify=? where id=?",
          [verifycode, rows[0].id],
          (err, rowss, fields) => {
            if (!err) {
              res.status(200).send("Sent");
            } else {
              console.log(err);
            }
          }
        );
      } else {
        res.send({ error: "E-mail Already Verify" });
      }
    }
  );
});
router.post("/cverify", (req, res) => {
  let emp = req.body;
  jwt.verify(emp.vCode, process.env.JWT_REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    mysqlConnection.query(
      "select  count(*) as count,id, status from tbllog where cverify = ? and email=?;",
      [user.vCode, user.email],
      (err, rows, fields) => {
        console.log(rows);
        if (rows[0].count > 0) {
          if (rows[0].status === 0) {
            mysqlConnection.query(
              "update tbllog set status= 1 where id=?",
              [rows[0].id],
              (err, rows, fields) => {
                if (!err) {
                  res.status(200).send("Verified");
                } else {
                  console.log(err);
                }
              }
            );
          } else {
            res.status(200).send("Already Verified");
          }
        } else {
          res.send({ error: "E-mail Already Verified Enjoy" });
        }
      }
    );
  });
  console.log(emp);
});
router.post(`/sends`, (req, res) => {
  let verifycode = Math.floor(1000 + Math.random() * 9000);
  let emp = req.body;
  mysqlConnection.query(
    `select email,name,pswd,mobno from tbllog`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length > 0) {
          rows.map((item) => {
            sendSmtpEmail.subject = `My ${item.name}`;
            sendSmtpEmail.htmlContent = `<div data-template-type="html" style="height: auto; padding-bottom: 149px;" class="ui-sortable">
   <!--[if !mso]><!-->
   <!--<![endif]-->
   <!-- ====== Module : Intro ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-1.png" data-module="Module-1" data-bgcolor="M1 Bgcolor 1">
      <tbody>
         <tr>
            <td height="25" style="font-size:0px">&nbsp;</td>
         </tr>
         <!-- top -->
         <tr>
            <td>
               <table align="center" class="res-full ui-resizable" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                     <tr>
                        <td>
                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td valign="middle" style="vertical-align: middle;">
                                       <img width="18" style="max-width: 18px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module01-img01.png">
                                    </td>
                                    <td width="10"></td>
                                    <td valign="middle" style="vertical-align: middle;">
                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                          <!-- link -->
                                          <tbody>
                                             <tr>
                                                <td class="res-center" style="text-align: center;">
                                                   <a href="https://example.com" style="color: #798999; font-family: 'Nunito', Arial, Sans-serif; font-size: 15px; letter-spacing: 0.6px; text-decoration: none; word-break: break-word; font-weight: 600;" data-color="M1 Link 1" data-size="M1 Link 1" data-max="25" data-min="5">
                                                   View in Browser
                                                   </a>
                                                </td>
                                             </tr>
                                             <!-- link end -->
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
         <!-- top end -->
         <tr>
            <td height="25" style="font-size:0px">&nbsp;</td>
         </tr>
         <tr>
            <td>
               <table bgcolor="#304050" align="center" width="750" class="margin-full ui-resizable" style="background-size: cover; background-position: center center; border-radius: 6px 6px 0px 0px; background-image: url(&quot;http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module01-bg01.png&quot;);" border="0" cellpadding="0" cellspacing="0" background="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module01-bg01.png" data-bgcolor="M1 Bgcolor 2" data-background="M1 Background 1">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="65" style="max-width: 65px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module01-img02.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <tr>
                                    <td height="45" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 26px; letter-spacing: 1.5px; word-break: break-word; font-weight: 300; padding-left: 1.5px;" data-color="M1 Title 1" data-size="M1 Title 1" data-max="36" data-min="16">
                                       WE ARE THE CREATIVE
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="12" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 35px; letter-spacing: 3px; word-break: break-word; font-weight: 800; padding-left: 3px;" data-color="M1 Title 2" data-size="M1 Title 2" data-max="45" data-min="25">
                                       ${item.name}
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="30" style="font-size:0px" class="">&nbsp;</td>
                                 </tr>
                                 <tr>
                                    <td>
                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- link -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center;">
                                                               <a href="https://example.com" style="color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M1 Link 2" data-size="M1 Link 2" data-max="26" data-min="6">
                                                               Support
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                </td>
                                                <td style="padding: 0 12px; color: #798999;">
                                                   •
                                                </td>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- link -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center;">
                                                               <a href="https://example.com" style="color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M1 Link 3" data-size="M1 Link 3" data-max="26" data-min="6">
                                                               Webpage
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                </td>
                                                <td style="padding: 0 12px; color: #798999;">
                                                   •
                                                </td>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- link -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center;">
                                                               <a href="https://example.com" style="color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M1 Link 4" data-size="M1 Link 4" data-max="26" data-min="6">
                                                               Contact
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Texts ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full selected-table" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-2.png" data-module="Module-2" data-bgcolor="M2 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M2 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- subtitle -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M2 Subtitle 1" data-size="M2 Subtitle 1" data-max="24" data-min="5">
                                       LOREM IPSUM
                                    </td>
                                 </tr>
                                 <!-- subtitle end -->
                                 <tr>
                                    <td height="13" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center selected-element" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M2 Title 1" data-size="M2 Title 1" data-max="32" data-min="12" contenteditable="true">
                                       We Provide High Quality
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M2 Paragraph 1" data-size="M2 Paragraph 1" data-max="26" data-min="6">
                                       Lorem ipsum dolor sit amet consectetur
                                       adipiscing elit. In dictum pretium felistruas
                                       sedula placerat. Maecenas rhoncus justo quis
                                       justo maximus sit amet consectetur purus
                                       soliam Nullam consectetur ultrices diam
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="23" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- link -->
                                 <tr>
                                    <td class="res-center" style="text-align: center;">
                                       <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M2 Link 1" data-size="M2 Link 1" data-max="26" data-min="6">
                                       Learn More About Us
                                       </a>
                                    </td>
                                 </tr>
                                 <!-- link end -->
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Features ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-3.png" data-module="Module-3" data-bgcolor="M3 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M3 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M3 Title 1" data-size="M3 Title 1" data-max="32" data-min="12">
                                       Products Features
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="23" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="295" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table style="border: 1px solid #F0F0F0; padding: 14px 15px; border-radius: 5px;" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- subtitle -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M3 Subtitle 1" data-size="M3 Subtitle 1" data-max="30" data-min="10">
                                                                           Design
                                                                        </td>
                                                                     </tr>
                                                                     <!-- subtitle end -->
                                                                     <tr>
                                                                        <td height="5" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <!-- paragraph -->
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M3 Paragraph 1" data-size="M3 Paragraph 1" data-max="26" data-min="6">
                                                                           Vivamus vulputate commodo man malesuada. Aenean
                                                                           sit ames
                                                                        </td>
                                                                     </tr>
                                                                     <!-- paragraph end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table style="border: 1px solid #F0F0F0; padding: 14px 15px; border-radius: 5px;" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- subtitle -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M3 Subtitle 2" data-size="M3 Subtitle 2" data-max="30" data-min="10">
                                                                           Supports
                                                                        </td>
                                                                     </tr>
                                                                     <!-- subtitle end -->
                                                                     <tr>
                                                                        <td height="5" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <!-- paragraph -->
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M3 Paragraph 2" data-size="M3 Paragraph 2" data-max="26" data-min="6">
                                                                           Vivamus vulputate commodo man malesuada. Aenean
                                                                           sit ames
                                                                        </td>
                                                                     </tr>
                                                                     <!-- paragraph end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="10" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="295" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table style="border: 1px solid #F0F0F0; padding: 14px 15px; border-radius: 5px;" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- subtitle -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M3 Subtitle 3" data-size="M3 Subtitle 3" data-max="30" data-min="10">
                                                                           Rocket Speed
                                                                        </td>
                                                                     </tr>
                                                                     <!-- subtitle end -->
                                                                     <tr>
                                                                        <td height="5" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <!-- paragraph -->
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M3 Paragraph 3" data-size="M3 Paragraph 3" data-max="26" data-min="6">
                                                                           Vivamus vulputate commodo man malesuada. Aenean
                                                                           sit ames
                                                                        </td>
                                                                     </tr>
                                                                     <!-- paragraph end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table style="border: 1px solid #F0F0F0; padding: 14px 15px; border-radius: 5px;" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- subtitle -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M3 Subtitle 4" data-size="M3 Subtitle 4" data-max="30" data-min="10">
                                                                           Boosters
                                                                        </td>
                                                                     </tr>
                                                                     <!-- subtitle end -->
                                                                     <tr>
                                                                        <td height="5" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <!-- paragraph -->
                                                                     <tr>
                                                                        <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M3 Paragraph 4" data-size="M3 Paragraph 4" data-max="26" data-min="6">
                                                                           Vivamus vulputate commodo man malesuada. Aenean
                                                                           sit ames
                                                                        </td>
                                                                     </tr>
                                                                     <!-- paragraph end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Center Image ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-4.png" data-module="Module-4" data-bgcolor="M4 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M4 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M4 Title 1" data-size="M4 Title 1" data-max="32" data-min="12">
                                       The Design is Awesome
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="395" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td width="190" style="border: 1px solid #F0F0F0; border-radius: 4px;">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0" style="padding: 15px; line-height: 27px;">
                                                                  <!-- subtitle -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td class="res-left" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 18px; letter-spacing: 0.7px; word-break: break-word; padding-bottom: 8px;" data-color="M4 Subtitle 1" data-size="M4 Subtitle 1" data-max="28" data-min="8">
                                                                           Grab Something Beautiful
                                                                        </td>
                                                                     </tr>
                                                                     <!-- subtitle end -->
                                                                     <!-- paragraph -->
                                                                     <tr>
                                                                        <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 21px; word-break: break-word; padding-bottom: 6px;" data-color="M4 Paragraph 1" data-size="M4 Paragraph 1" data-max="26" data-min="6">
                                                                           Nullam consectetur ultrices diam atmu iaculis enim uda
                                                                        </td>
                                                                     </tr>
                                                                     <!-- paragraph end -->
                                                                     <!-- link -->
                                                                     <tr>
                                                                        <td class="res-left" style="text-align: left;">
                                                                           <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M4 Link 1" data-size="M4 Link 1" data-max="26" data-min="6">
                                                                           @ John Doe
                                                                           </a>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- link end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                            <td width="15"></td>
                                                            <td width="190">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="190" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module04-img01.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="15" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table style="background: #00BB9D; border-radius: 4px; padding: 15px;" width="190" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="30" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="35" style="max-width: 35px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module04-img02.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="17" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word;" data-color="M4 Paragraph 2" data-size="M4 Paragraph 2" data-max="26" data-min="6">
                                                               Donec elit arcu Rhoncus ut lore nec dictum
                                                               ornare
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="30" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Products Samples ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-5.png" data-module="Module-5" data-bgcolor="M5 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M5 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M5 Title 1" data-size="M5 Title 1" data-max="32" data-min="12">
                                       Products Samples
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M5 Subtitle 1" data-size="M5 Subtitle 1" data-max="30" data-min="10">
                                                               Product Name
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M5 Paragraph 1" data-size="M5 Paragraph 1" data-max="26" data-min="6">
                                                               Donec elit arcu rhoncus ut lorem nec dictum
                                                               ornare metus. Sed cursus lobortis urna nec
                                                               consequat velda commodo acnunc lorem
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- link -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left;">
                                                               <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M5 Link 1" data-size="M5 Link 1" data-max="26" data-min="6">
                                                               Purchase Now
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="290" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module05-img01.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2r -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <!-- right column -->
                                                   <table width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M5 Subtitle 2" data-size="M5 Subtitle 2" data-max="30" data-min="10">
                                                               Second Product
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M5 Paragraph 2" data-size="M5 Paragraph 2" data-max="26" data-min="6">
                                                               Donec elit arcu rhoncus ut lorem nec dictum
                                                               ornare metus. Sed cursus lobortis urna nec
                                                               consequat velda commodo acnunc lorem
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- link -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left;">
                                                               <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M5 Link 2" data-size="M5 Link 2" data-max="26" data-min="6">
                                                               Purchase Now
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                   <table width="1" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column -->
                                                   <table width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="290" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module05-img02.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2r end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Video ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-6.png" data-module="Module-6" data-bgcolor="M6 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="#304050" align="center" width="750" class="margin-full ui-resizable" style="background-size: cover; background-position: center center; background-image: url(&quot;http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module06-bg01.png&quot;);" border="0" cellpadding="0" cellspacing="0" background="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module06-bg01.png" data-bgcolor="M6 Bgcolor 2" data-background="M6 Background 1">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="90" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- subtitle -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 15px; letter-spacing: 2px; word-break: break-word; font-weight: 700;" data-color="M6 Subtitle 1" data-size="M6 Subtitle 1" data-max="25" data-min="5">
                                       LET'S WATCH
                                    </td>
                                 </tr>
                                 <!-- subtitle end -->
                                 <tr>
                                    <td height="20" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 30px; letter-spacing: 2px; word-break: break-word; font-weight: 300;" data-color="M6 Title 1" data-size="M6 Title 1" data-max="40" data-min="20">
                                       HOW IT IS CREATED
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="40" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td style="padding: 12px 10px 12px 14px; border: 1.5px solid white; border-radius: 50%;">
                                                               <img width="18" style="max-width: 18px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module06-img01.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <tr>
                                    <td height="40" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M6 Paragraph 1" data-size="M6 Paragraph 1" data-max="26" data-min="6">
                                       Integer scelerisque sem justo sit amet
                                       elementum velit pulvinar suscipitm Aenean
                                       ullamcorper venen Lorem ipsum dolorm
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="90" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Members ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-7.png" data-module="Module-7" data-bgcolor="M7 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M7 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- subtitle -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M7 Subtitle 1" data-size="M7 Subtitle 1" data-max="24" data-min="5">
                                       EXPRESS SUPPORT
                                    </td>
                                 </tr>
                                 <!-- subtitle end -->
                                 <tr>
                                    <td height="13" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M7 Title 1" data-size="M7 Title 1" data-max="32" data-min="12">
                                       Meet Our Expert Team
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="20" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M7 Paragraph 1" data-size="M7 Paragraph 1" data-max="26" data-min="6">
                                       Integer scelerisque sem justo sit amet
                                       elementum velit pulvinar suscipit. Aenean
                                       ullamcorper venen elementum velit Sincpos
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="24" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x3 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table style="border: 1px solid #F5F5F5; overflow: hidden; border-radius: 4px;" width="190" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="188" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img01.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- title -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word;" data-color="M7 Title 2" data-size="M7 Title 2" data-max="30" data-min="10">
                                                               Nosel Gomez
                                                            </td>
                                                         </tr>
                                                         <!-- title end -->
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 15px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-weight: 600;" data-color="M7 Paragraph 2" data-size="M7 Paragraph 2" data-max="25" data-min="5">
                                                               # Founder
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="17" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img02.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <td style="padding: 0 23px;">
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img03.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <td>
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img04.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="22" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="15" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- middle column -->
                                                   <table style="border: 1px solid #F5F5F5; overflow: hidden; border-radius: 4px;" width="190" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="188" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img05.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- title -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word;" data-color="M7 Title 3" data-size="M7 Title 3" data-max="30" data-min="10">
                                                               Ears Hoffman
                                                            </td>
                                                         </tr>
                                                         <!-- title end -->
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 15px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-weight: 600;" data-color="M7 Paragraph 3" data-size="M7 Paragraph 3" data-max="25" data-min="5">
                                                               # Director
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="17" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img06.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <td style="padding: 0 23px;">
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img07.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <td>
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img08.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="22" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- middle column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="15" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table style="border: 1px solid #F5F5F5; overflow: hidden; border-radius: 4px;" width="190" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="188" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img09.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- title -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word;" data-color="M7 Title 4" data-size="M7 Title 4" data-max="30" data-min="10">
                                                               Julias Black
                                                            </td>
                                                         </tr>
                                                         <!-- title end -->
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 15px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-weight: 600;" data-color="M7 Paragraph 4" data-size="M7 Paragraph 4" data-max="25" data-min="5">
                                                               # Manager
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="17" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img10.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <td style="padding: 0 23px;">
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img11.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <td>
                                                                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module07-img12.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="22" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x3 end -->
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Highlight ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-8.png" data-module="Module-8" data-bgcolor="M8 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="#00BB9D" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M8 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="55" style="max-width: 55px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module08-img01.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <tr>
                                    <td height="33" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 40px; letter-spacing: 2px; line-height: 23px; word-break: break-word; line-height: 50px; padding-left: 2px;" data-color="M8 Paragraph 1" data-size="M8 Paragraph 1" data-max="50" data-min="30">
                                       58,890,444
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- subtitle -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 17px; letter-spacing: 1.5px; word-break: break-word; font-weight: 500;" data-color="M8 Subtitle 1" data-size="M8 Subtitle 1" data-max="27" data-min="7">
                                       COPIES SOLD
                                    </td>
                                 </tr>
                                 <!-- subtitle end -->
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Products Features ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-9.png" data-module="Module-9" data-bgcolor="M9 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M9 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M9 Title 1" data-size="M9 Title 1" data-max="32" data-min="12">
                                       Ultimate Product Features
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="290" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 5px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module09-img01.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td width="84">
                                                                           <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <table align="left" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="70" style="max-width: 70px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 3px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module09-img02.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                        <td>
                                                                           <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <!-- subtitle -->
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td class="res-left" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 18px; letter-spacing: 0.7px; word-break: break-word;" data-color="M9 Subtitle 1" data-size="M9 Subtitle 1" data-max="28" data-min="8">
                                                                                       Brand Solution
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- subtitle end -->
                                                                                 <tr>
                                                                                    <td height="6" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- paragraph -->
                                                                                 <tr>
                                                                                    <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 21px; word-break: break-word;" data-color="M9 Paragraph 1" data-size="M9 Paragraph 1" data-max="26" data-min="6">
                                                                                       Nullam consectetur ultrices diam at iaculis diams
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- paragraph end -->
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                     <tr>
                                                                        <td height="20" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <!-- image -->
                                                                     <tr>
                                                                        <td width="84">
                                                                           <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <table align="left" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="70" style="max-width: 70px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 3px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module09-img03.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                        <td>
                                                                           <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <!-- subtitle -->
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td class="res-left" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 18px; letter-spacing: 0.7px; word-break: break-word;" data-color="M9 Subtitle 2" data-size="M9 Subtitle 2" data-max="28" data-min="8">
                                                                                       Photoshop
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- subtitle end -->
                                                                                 <tr>
                                                                                    <td height="6" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- paragraph -->
                                                                                 <tr>
                                                                                    <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 21px; word-break: break-word;" data-color="M9 Paragraph 2" data-size="M9 Paragraph 2" data-max="26" data-min="6">
                                                                                       Nullam consectetur ultrices diam at iaculis diams
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- paragraph end -->
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                     <tr>
                                                                        <td height="20" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <!-- image -->
                                                                     <tr>
                                                                        <td width="84">
                                                                           <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <table align="left" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <img width="70" style="max-width: 70px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 3px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module09-img04.png">
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                        <td>
                                                                           <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <!-- subtitle -->
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td class="res-left" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 18px; letter-spacing: 0.7px; word-break: break-word;" data-color="M9 Subtitle 3" data-size="M9 Subtitle 3" data-max="28" data-min="8">
                                                                                       Email Marketing
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- subtitle end -->
                                                                                 <tr>
                                                                                    <td height="6" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- paragraph -->
                                                                                 <tr>
                                                                                    <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 21px; word-break: break-word;" data-color="M9 Paragraph 3" data-size="M9 Paragraph 3" data-max="26" data-min="6">
                                                                                       Nullam consectetur ultrices diam at iaculis diams
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- paragraph end -->
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- link -->
                                                         <tr>
                                                            <td class="res-left" style="text-align: left;">
                                                               <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M9 Link 1" data-size="M9 Link 1" data-max="26" data-min="6">
                                                               Learn more about our ultimate solution guides
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Skills ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-10.png" data-module="Module-10" data-bgcolor="M10 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M10 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M10 Title 1" data-size="M10 Title 1" data-max="32" data-min="12">
                                       Genesis Jordan Skills
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2r -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <!-- right column -->
                                                   <table width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="290" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module10-img01.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                   <table width="1" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column -->
                                                   <table width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- skill -->
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-left" style="text-align: left; color: #607080; font-family: 'Raleway', Arial, Sans-serif; font-size: 13.5px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M10 Subtitle 1" data-size="M10 Subtitle 1" data-max="23" data-min="5">
                                                               PRESENTATIONS
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table style="background: #F5F5F5" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table style="width: 75%; background: #00BB9D; border-radius: 2px;" align="left" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- skill end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- skill -->
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-left" style="text-align: left; color: #607080; font-family: 'Raleway', Arial, Sans-serif; font-size: 13.5px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M10 Subtitle 2" data-size="M10 Subtitle 2" data-max="23" data-min="5">
                                                               PSD
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table style="background: #F5F5F5" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table style="width: 60%; background: #00BB9D; border-radius: 2px;" align="left" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- skill end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- skill -->
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-left" style="text-align: left; color: #607080; font-family: 'Raleway', Arial, Sans-serif; font-size: 13.5px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M10 Subtitle 3" data-size="M10 Subtitle 3" data-max="23" data-min="5">
                                                               MARKETING
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <tr>
                                                            <td>
                                                               <table style="background: #F5F5F5" class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table style="width: 85%; background: #00BB9D; border-radius: 2px;" align="left" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- skill end -->
                                                         <tr>
                                                            <td height="25" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M10 Paragraph 1" data-size="M10 Paragraph 1" data-max="26" data-min="6">
                                                               Vivamus vulputate commodo malesud Aenean
                                                               sit amet ultrices amlas
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2r end -->
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : The Big Picture ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-11.png" data-module="Module-11" data-bgcolor="M11 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="#304050" align="center" width="750" class="margin-full ui-resizable" style="background-size: cover; background-position: center center; background-image: url(&quot;http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module11-bg01.png&quot;);" border="0" cellpadding="0" cellspacing="0" background="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module11-bg01.png" data-bgcolor="M11 Bgcolor 2" data-background="M11 Background 1">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="130" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <tr>
                                    <td>
                                       <table align="center" border="0" cellpadding="0" cellspacing="0">
                                          <!-- title -->
                                          <tbody>
                                             <tr>
                                                <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 31px; letter-spacing: 4px; word-break: break-word; font-weight: 800; padding: 17px 33px; border: 2px solid #ffffff; border-radius: 0;" data-color="M11 Title 1" data-size="M11 Title 1" data-max="41" data-min="21">
                                                   MOTIVATION
                                                </td>
                                             </tr>
                                             <!-- title end -->
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td height="130" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Pricing Table ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-12.png" data-module="Module-12" data-bgcolor="M12 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M12 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- subtitle -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M12 Subtitle 1" data-size="M12 Subtitle 1" data-max="24" data-min="5">
                                       LOREM IPSUM
                                    </td>
                                 </tr>
                                 <!-- subtitle end -->
                                 <tr>
                                    <td height="13" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M12 Title 1" data-size="M12 Title 1" data-max="32" data-min="12">
                                       Pricing Table Described
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table style="border: 1px solid #F5F5F5; border-radius: 4px; padding: 25px 15px;" width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M12 Subtitle 2" data-size="M12 Subtitle 2" data-max="24" data-min="5">
                                                               COST EFFECTIVE
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="24" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-size: 30px; line-height: 50px;" data-color="M12 Paragraph 1" data-size="M12 Paragraph 1" data-max="40" data-min="20">
                                                               <sup>€ </sup>79.<small>66</small>
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M12 Paragraph 2" data-size="M12 Paragraph 2" data-max="26" data-min="6">
                                                               Donec elit arcu rhoncus utlam lorem nec dictum
                                                               ornare metusd Sed cursus lobortis
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- button -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" style="border: 1.5px solid #607080; border-radius: 0px;" border="0" cellpadding="0" cellspacing="0" data-border-color="M12 Border 1" data-border-size="M12 Border 1">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="41" style="padding: 0 23px; text-align: center;">
                                                                                       <a href="https://example.com" style="color: #607080; letter-spacing: 0.9px; font-size: 16px; font-family: 'Nunito', Arial, Sans-serif; text-decoration: none; text-align: center; line-height: 24px; word-break: break-word;" data-color="M12 Button 1" data-size="M12 Button 1" data-max="26" data-min="6">
                                                                                       Grab Now
                                                                                       </a>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- button end -->
                                                         <tr>
                                                            <td height="8" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table style="border: 1px solid #F5F5F5; border-radius: 4px; padding: 25px 15px;" width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M12 Subtitle 3" data-size="M12 Subtitle 3" data-max="24" data-min="5">
                                                               BETTER SUPPORT
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="24" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-size: 30px; line-height: 50px;" data-color="M12 Paragraph 3" data-size="M12 Paragraph 3" data-max="40" data-min="20">
                                                               <sup>€ </sup>93.<small>49</small>
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M12 Paragraph 4" data-size="M12 Paragraph 4" data-max="26" data-min="6">
                                                               Donec elit arcu rhoncus utlam lorem nec dictum
                                                               ornare metusd Sed cursus lobortis
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- button -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" bgcolor="#00BB9D" style="border: 0px solid #999999; border-radius: 0px;" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M12 Bgcolor 3" data-border-color="M12 Border 2" data-border-size="M12 Border 2">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="43" style="padding: 0 23px; text-align: center;">
                                                                                       <a href="https://example.com" style="color: white; letter-spacing: 0.9px; font-size: 16px; font-family: 'Nunito', Arial, Sans-serif; text-decoration: none; text-align: center; line-height: 24px; word-break: break-word;" data-color="M12 Button 2" data-size="M12 Button 2" data-max="26" data-min="6">
                                                                                       Grab Now
                                                                                       </a>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- button end -->
                                                         <tr>
                                                            <td height="8" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Client ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-13.png" data-module="Module-13" data-bgcolor="M13 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="#304050" align="center" width="750" class="margin-full ui-resizable" style="background-size: cover; background-position: center center; background-image: url(&quot;http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module13-bg01.png&quot;);" border="0" cellpadding="0" cellspacing="0" background="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module13-bg01.png" data-bgcolor="M13 Bgcolor 2" data-background="M13 Background 1">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word; font-weight: 300;" data-color="M13 Title 1" data-size="M13 Title 1" data-max="32" data-min="12">
                                       What Our Clients Said
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="20" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M13 Paragraph 1" data-size="M13 Paragraph 1" data-max="26" data-min="6">
                                       Lorem ipsum dolor sit amet consectetur
                                       adipiscing elit. In dictum pretium felis
                                       sed placerat. Nullam consectetur ultrices diumas
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="25" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table style="background: white; padding: 16px; border-radius: 4px;" width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="25" style="max-width: 25px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module13-img01.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="14" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M13 Paragraph 2" data-size="M13 Paragraph 2" data-max="26" data-min="6">
                                                               <!-- paragraph -->
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 21px; word-break: break-word;" data-color="M13 Paragraph 3" data-size="M13 Paragraph 3" data-max="26" data-min="6">
                                                               Donec elit arcu rhoncus ut lorem nec dictum
                                                               ornare metus
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 14.5px; letter-spacing: 0.7px; word-break: break-word; font-weight: 700;" data-color="M13 Subtitle 1" data-size="M13 Subtitle 1" data-max="24" data-min="5">
                                                               ISRO DE ARTHER
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 14.5px; letter-spacing: 0.7px; word-break: break-word; font-weight: 500;" data-color="M13 Subtitle 2" data-size="M13 Subtitle 2" data-max="24" data-min="5">
                                                               Manager
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="80" style="max-width: 80px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module13-img02.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table style="background: white; padding: 16px; border-radius: 4px;" width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="25" style="max-width: 25px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module13-img03.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="14" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: white; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M13 Paragraph 4" data-size="M13 Paragraph 4" data-max="26" data-min="6">
                                                               <!-- paragraph -->
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 21px; word-break: break-word;" data-color="M13 Paragraph 5" data-size="M13 Paragraph 5" data-max="26" data-min="6">
                                                               Donec elit arcu rhoncus ut lorem nec dictum
                                                               ornare metus
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 14.5px; letter-spacing: 0.7px; word-break: break-word; font-weight: 700;" data-color="M13 Subtitle 3" data-size="M13 Subtitle 3" data-max="24" data-min="5">
                                                               JOHNSON LORSON
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="5" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 14.5px; letter-spacing: 0.7px; word-break: break-word; font-weight: 500;" data-color="M13 Subtitle 4" data-size="M13 Subtitle 4" data-max="24" data-min="5">
                                                               Technologist
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="80" style="max-width: 80px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module13-img04.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Pricing Image List ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-14.png" data-module="Module-14" data-bgcolor="M14 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M14 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="70" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- subtitle -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M14 Subtitle 1" data-size="M14 Subtitle 1" data-max="24" data-min="5">
                                       IMAGE &amp; LISTED
                                    </td>
                                 </tr>
                                 <!-- subtitle end -->
                                 <tr>
                                    <td height="13" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M14 Title 1" data-size="M14 Title 1" data-max="32" data-min="12">
                                       Pricing Table Listed
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table style="border: 1px solid #F5F5F5; border-radius: 4px; padding: 25px 15px;" width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M14 Subtitle 2" data-size="M14 Subtitle 2" data-max="24" data-min="5">
                                                               STARTER
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="21" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <img width="258" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module14-img01.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="20" style="font-size: 0px;">&nbsp;</td>
                                                         </tr>
                                                         <!-- list -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" style="border-radius: 0px;" border="0" cellpadding="0" cellspacing="0">
                                                                              <!-- list -->
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td width="17" style="font-size: 22px; color: #798999;">
                                                                                       •
                                                                                    </td>
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- paragraph -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M14 Paragraph 1" data-size="M14 Paragraph 1" data-max="26" data-min="6">
                                                                                                   Donec elit arcu rhoncus lorda
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- paragraph end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                                 <!-- list -->
                                                                                 <tr>
                                                                                    <td width="17" style="font-size: 22px; color: #798999;">
                                                                                       •
                                                                                    </td>
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- paragraph -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M14 Paragraph 2" data-size="M14 Paragraph 2" data-max="26" data-min="6">
                                                                                                   Lorem ipsum dolor amed
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- paragraph end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                                 <!-- list -->
                                                                                 <tr>
                                                                                    <td width="17" style="font-size: 22px; color: #798999;">
                                                                                       •
                                                                                    </td>
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- paragraph -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M14 Paragraph 3" data-size="M14 Paragraph 3" data-max="26" data-min="6">
                                                                                                   Integer scelerisque sem justo
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- paragraph end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- list end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-size: 30px; line-height: 50px;" data-color="M14 Paragraph 4" data-size="M14 Paragraph 4" data-max="40" data-min="20">
                                                               <sup>$ </sup>9.<small>52</small>
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- button -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" bgcolor="#00BB9D" style="border: 0px solid #999999; border-radius: 0px;" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M14 Bgcolor 3" data-border-color="M14 Border 1" data-border-size="M14 Border 1">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="43" style="padding: 0 23px; text-align: center;">
                                                                                       <a href="https://example.com" style="color: white; letter-spacing: 0.9px; font-size: 16px; font-family: 'Nunito', Arial, Sans-serif; text-decoration: none; text-align: center; line-height: 24px; word-break: break-word;" data-color="M14 Button 1" data-size="M14 Button 1" data-max="26" data-min="6">
                                                                                       Grab Now
                                                                                       </a>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- button end -->
                                                         <tr>
                                                            <td height="8" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table style="border: 1px solid #F5F5F5; border-radius: 4px; padding: 25px 15px;" width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- subtitle -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 1px; word-break: break-word; font-weight: 800;" data-color="M14 Subtitle 3" data-size="M14 Subtitle 3" data-max="24" data-min="5">
                                                               PRIMIUM
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="21" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- image -->
                                                         <tr>
                                                            <td>
                                                               <img width="258" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module14-img02.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="20" style="font-size: 0px;">&nbsp;</td>
                                                         </tr>
                                                         <!-- list -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" style="border-radius: 0px;" border="0" cellpadding="0" cellspacing="0">
                                                                              <!-- list -->
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td width="17" style="font-size: 22px; color: #798999;">
                                                                                       •
                                                                                    </td>
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- paragraph -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M14 Paragraph 5" data-size="M14 Paragraph 5" data-max="26" data-min="6">
                                                                                                   Donec elit arcu rhoncus lorda
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- paragraph end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                                 <!-- list -->
                                                                                 <tr>
                                                                                    <td width="17" style="font-size: 22px; color: #798999;">
                                                                                       •
                                                                                    </td>
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- paragraph -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M14 Paragraph 6" data-size="M14 Paragraph 6" data-max="26" data-min="6">
                                                                                                   Lorem ipsum dolor amed
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- paragraph end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                                 <!-- list -->
                                                                                 <tr>
                                                                                    <td width="17" style="font-size: 22px; color: #798999;">
                                                                                       •
                                                                                    </td>
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- paragraph -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M14 Paragraph 7" data-size="M14 Paragraph 7" data-max="26" data-min="6">
                                                                                                   Integer scelerisque sem justo
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- paragraph end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- list end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-size: 30px; line-height: 50px;" data-color="M14 Paragraph 8" data-size="M14 Paragraph 8" data-max="40" data-min="20">
                                                               <sup>$ </sup>14.<small>78</small>
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- button -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" bgcolor="#00BB9D" style="border: 0px solid #999999; border-radius: 0px;" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M14 Bgcolor 4" data-border-color="M14 Border 2" data-border-size="M14 Border 2">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="43" style="padding: 0 23px; text-align: center;">
                                                                                       <a href="https://example.com" style="color: white; letter-spacing: 0.9px; font-size: 16px; font-family: 'Nunito', Arial, Sans-serif; text-decoration: none; text-align: center; line-height: 24px; word-break: break-word;" data-color="M14 Button 2" data-size="M14 Button 2" data-max="26" data-min="6">
                                                                                       Grab Now
                                                                                       </a>
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- button end -->
                                                         <tr>
                                                            <td height="8" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Events ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-15.png" data-module="Module-15" data-bgcolor="M15 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M15 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M15 Title 1" data-size="M15 Title 1" data-max="32" data-min="12">
                                       Events Coming Ahead
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0" bgcolor="#304050" style="background-size: cover; background-position: center center; border-radius: 5px; background-image: url(&quot;http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module15-bg01.png&quot;);" background="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module15-bg01.png" data-bgcolor="M15 Bgcolor 3" data-background="M15 Background 1">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td height="130" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td style="padding-right: 20px;">
                                                                           <table style="background: white; width: 95px; border-radius: 3px;" align="right" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="8" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- date -->
                                                                                 <tr>
                                                                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 35px; letter-spacing: 0.7px; word-break: break-word; line-height: 37px; font-weight: 700; padding-left: 1px;" data-color="M15 Title 2" data-size="M15 Title 2" data-max="45" data-min="25">
                                                                                       27
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- date end -->
                                                                                 <tr>
                                                                                    <td height="3" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- paragraph -->
                                                                                 <tr>
                                                                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 16px; letter-spacing: 2.9px; line-height: 23px; word-break: break-word; font-weight: 700;" data-color="M15 Paragraph 1" data-size="M15 Paragraph 1" data-max="26" data-min="6">
                                                                                       APR
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- paragraph end -->
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td height="22" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M15 Subtitle 1" data-size="M15 Subtitle 1" data-max="30" data-min="10">
                                                               Upcoming Events
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M15 Paragraph 2" data-size="M15 Paragraph 2" data-max="26" data-min="6">
                                                               Vivamus vulputate commodo malesuada. Aenean
                                                               sit amet ultrices dui. Proin eget leo auctor
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- link -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left;">
                                                               <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M15 Link 1" data-size="M15 Link 1" data-max="26" data-min="6">
                                                               Read More ▷
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="50" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0" bgcolor="#304050" style="background-size: cover; background-position: center center; border-radius: 5px; background-image: url(&quot;http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module15-bg02.png&quot;);" background="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module15-bg02.png" data-bgcolor="M15 Bgcolor 4" data-background="M15 Background 2">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td height="130" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td style="padding-right: 20px;">
                                                                           <table style="background: white; width: 95px; border-radius: 3px;" align="right" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td height="8" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- date -->
                                                                                 <tr>
                                                                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 35px; letter-spacing: 0.7px; word-break: break-word; line-height: 37px; font-weight: 700; padding-left: 1px;" data-color="M15 Title 3" data-size="M15 Title 3" data-max="45" data-min="25">
                                                                                       08
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- date end -->
                                                                                 <tr>
                                                                                    <td height="3" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- paragraph -->
                                                                                 <tr>
                                                                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 16px; letter-spacing: 2.9px; line-height: 23px; word-break: break-word; font-weight: 700;" data-color="M15 Paragraph 3" data-size="M15 Paragraph 3" data-max="26" data-min="6">
                                                                                       MAY
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- paragraph end -->
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                     <tr>
                                                                        <td height="22" style="font-size:0px">&nbsp;</td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 20px; letter-spacing: 0.7px; word-break: break-word" data-color="M15 Subtitle 2" data-size="M15 Subtitle 2" data-max="30" data-min="10">
                                                               Grand Finale
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M15 Paragraph 4" data-size="M15 Paragraph 4" data-max="26" data-min="6">
                                                               Vivamus vulputate commodo malesuada. Aenean
                                                               sit amet ultrices dui. Proin eget leo auctor
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- link -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left;">
                                                               <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M15 Link 2" data-size="M15 Link 2" data-max="26" data-min="6">
                                                               Read More ▷
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Showcase ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-16.png" data-module="Module-16" data-bgcolor="M16 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M16 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M16 Title 1" data-size="M16 Title 1" data-max="32" data-min="12">
                                       The Image Showcase
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="400" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td width="200">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="200" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module16-img01.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                            <td width="200">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="200" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module16-img02.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="0" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="0" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="200" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="200" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module16-img03.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="400" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td width="200">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="200" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module16-img04.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                            <td width="200">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="200" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module16-img05.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="0" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="0" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="200" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="200" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module16-img06.png">
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Sponsors ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-17.png" data-module="Module-17" data-bgcolor="M17 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M17 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M17 Title 1" data-size="M17 Title 1" data-max="32" data-min="12">
                                       Our Sponsors
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="30" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="294" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td width="142">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="135" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module17-img01.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                            <td width="12"></td>
                                                            <td width="142">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="135" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module17-img02.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="12" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="12" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="294" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td width="142">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="135" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module17-img03.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                            <td width="12"></td>
                                                            <td width="142">
                                                               <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                  <!-- image -->
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <img width="135" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module17-img04.png">
                                                                        </td>
                                                                     </tr>
                                                                     <!-- image end -->
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="22" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M17 Paragraph 1" data-size="M17 Paragraph 1" data-max="26" data-min="6">
                                       We are noting without our Sponsors
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Customers ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-18.png" data-module="Module-18" data-bgcolor="M18 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M18 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- HEADING -->
                                 <!-- title -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M18 Title 1" data-size="M18 Title 1" data-max="32" data-min="12">
                                       Customers Ratings
                                    </td>
                                 </tr>
                                 <!-- title end -->
                                 <tr>
                                    <td height="15" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="130" style="max-width: 130px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/ui-line-2.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <!-- HEADING end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="200" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="200" style="max-width: 200px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img01.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- loves -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" style="border-radius: 0px;" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img02.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img03.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img04.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img05.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img06.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- loves end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="380" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="left" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="20" style="max-width: 20px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img07.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M18 Paragraph 1" data-size="M18 Paragraph 1" data-max="26" data-min="6">
                                                               Vivamus vulputate commodo malesuada. Aenean
                                                               sit amet ultrices dui proin eget leofam
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="11" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 19px; letter-spacing: 0.7px; word-break: break-word;" data-color="M18 Subtitle 1" data-size="M18 Subtitle 1" data-max="29" data-min="9">
                                                               COOPER BLACK
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 0.7px; word-break: break-word; font-weight: 700;" data-color="M18 Subtitle 2" data-size="M18 Subtitle 2" data-max="24" data-min="5">
                                                               THE MANAGER
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2r -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <!-- right column -->
                                                   <table width="200" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="200" style="max-width: 200px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 4px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img08.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- loves -->
                                                         <tr>
                                                            <td>
                                                               <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" style="border-radius: 0px;" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img09.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img10.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img11.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img12.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                    <td width="7"></td>
                                                                                    <!-- single love -->
                                                                                    <td width="16">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img13.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- single love end -->
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- loves end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                   <table width="1" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column -->
                                                   <table width="380" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="left" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="20" style="max-width: 20px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module18-img14.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M18 Paragraph 2" data-size="M18 Paragraph 2" data-max="26" data-min="6">
                                                               Vivamus vulputate commodo malesuada. Aenean
                                                               sit amet ultrices dui proin eget leofam
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="11" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 19px; letter-spacing: 0.7px; word-break: break-word;" data-color="M18 Subtitle 3" data-size="M18 Subtitle 3" data-max="29" data-min="9">
                                                               LOREN ZAMPHA
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="10" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- subtitle -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #506070; font-family: 'Raleway', Arial, Sans-serif; font-size: 14px; letter-spacing: 0.7px; word-break: break-word; font-weight: 700;" data-color="M18 Subtitle 4" data-size="M18 Subtitle 4" data-max="24" data-min="5">
                                                               DIRECTOR &amp; CEO
                                                            </td>
                                                         </tr>
                                                         <!-- subtitle end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2r end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Contact ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-19.png" data-module="Module-19" data-bgcolor="M19 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table style="border-radius: 0 0 6px 6px;" bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M19 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="35" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <img width="600" style="width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px; border-radius: 5px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module19-img01.png">
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <tr>
                                    <td height="20" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- image -->
                                 <tr>
                                    <td>
                                       <table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <img width="20" style="max-width: 20px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module19-img02.png">
                                                            </td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                </td>
                                                <td style="padding-left: 9px;">
                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- paragraph -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-weight: 600;" data-color="M19 Paragraph 1" data-size="M19 Paragraph 1" data-max="26" data-min="6">
                                                               Cory Lyons, Tyler Boulevard, Poland, Utah
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                      </tbody>
                                                   </table>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- image end -->
                                 <tr>
                                    <td height="9" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #00BB9D; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-weight: 500;" data-color="M19 Paragraph 2" data-size="M19 Paragraph 2" data-max="26" data-min="6">
                                       (838) 396-7039
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="20" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- paragraph -->
                                 <tr>
                                    <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M19 Paragraph 3" data-size="M19 Paragraph 3" data-max="26" data-min="6">
                                       Integer scelerisque sem justo sit amet
                                       elementum velit pulvinar suscipitm Aenean
                                       ullamcorper venenatis risus at bibendum aliquam
                                    </td>
                                 </tr>
                                 <!-- paragraph end -->
                                 <tr>
                                    <td height="40" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <!-- ====== Module : Footer ====== -->
   <table bgcolor="#F5F5F5" align="center" class="full" border="0" cellpadding="0" cellspacing="0" data-thumbnail="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/thumbnails/thumb-20.png" data-module="Module-20" data-bgcolor="M20 Bgcolor 1">
      <tbody>
         <tr>
            <td>
               <table style="border-radius: 0 0 6px 6px;" bgcolor="white" width="750" align="center" class="margin-full ui-resizable" border="0" cellpadding="0" cellspacing="0" data-bgcolor="M20 Bgcolor 2">
                  <tbody>
                     <tr>
                        <td>
                           <table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                 <tr>
                                    <td height="40" style="font-size:0px">&nbsp;</td>
                                 </tr>
                                 <!-- column x2 -->
                                 <tr>
                                    <td>
                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                             <tr>
                                                <td valign="top">
                                                   <!-- left column -->
                                                   <table width="290" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- title -->
                                                      <tbody>
                                                         <tr>
                                                            <td class="res-center" style="text-align: left; color: #405060; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" data-color="M20 Title 1" data-size="M20 Title 1" data-max="32" data-min="12">
                                                               Contacts
                                                            </td>
                                                         </tr>
                                                         <!-- title end -->
                                                         <tr>
                                                            <td height="15" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- list -->
                                                         <tr>
                                                            <td>
                                                               <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" style="border-radius: 0px;" border="0" cellpadding="0" cellspacing="0">
                                                                              <!-- list -->
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <!-- image -->
                                                                                    <td width="27">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module20-img01.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- image end -->
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- link -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left;">
                                                                                                   <a href="https://example.com" style="color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M20 Link 1" data-size="M20 Link 1" data-max="26" data-min="6">
                                                                                                   youtube.com pages
                                                                                                   </a>
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- link end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- list -->
                                                                                 <tr>
                                                                                    <!-- image -->
                                                                                    <td width="27">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module20-img02.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- image end -->
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- link -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left;">
                                                                                                   <a href="https://example.com" style="color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M20 Link 2" data-size="M20 Link 2" data-max="26" data-min="6">
                                                                                                   twitter.com twitts
                                                                                                   </a>
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- link end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                                 <tr>
                                                                                    <td height="10" style="font-size:0px">&nbsp;</td>
                                                                                 </tr>
                                                                                 <!-- list -->
                                                                                 <tr>
                                                                                    <!-- image -->
                                                                                    <td width="27">
                                                                                       <table align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td>
                                                                                                   <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                                      <tbody>
                                                                                                         <tr>
                                                                                                            <td>
                                                                                                               <img width="16" style="max-width: 16px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module20-img03.png">
                                                                                                            </td>
                                                                                                         </tr>
                                                                                                      </tbody>
                                                                                                   </table>
                                                                                                </td>
                                                                                             </tr>
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                    <!-- image end -->
                                                                                    <td>
                                                                                       <table class="full" align="center" border="0" cellpadding="0" cellspacing="0">
                                                                                          <!-- link -->
                                                                                          <tbody>
                                                                                             <tr>
                                                                                                <td class="res-left" style="text-align: left;">
                                                                                                   <a href="https://example.com" style="color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M20 Link 3" data-size="M20 Link 3" data-max="26" data-min="6">
                                                                                                   youtube.com videos
                                                                                                   </a>
                                                                                                </td>
                                                                                             </tr>
                                                                                             <!-- link end -->
                                                                                          </tbody>
                                                                                       </table>
                                                                                    </td>
                                                                                 </tr>
                                                                                 <!-- list end -->
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- list end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- left column end -->
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td>
                                                   <![endif]-->
                                                   <table width="20" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                      </tbody>
                                                   </table>
                                                   <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                <td valign="top">
                                                   <![endif]-->
                                                   <!-- right column -->
                                                   <table width="290" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                      <!-- image -->
                                                      <tbody>
                                                         <tr>
                                                            <td>
                                                               <table align="right" class="res-full" border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                     <tr>
                                                                        <td>
                                                                           <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                                              <tbody>
                                                                                 <tr>
                                                                                    <td>
                                                                                       <img width="60" style="max-width: 60px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2020/03/22/9jhlVUzudcB8NtbnMg67SvA5/StampReady/img/module20-img04.png">
                                                                                    </td>
                                                                                 </tr>
                                                                              </tbody>
                                                                           </table>
                                                                        </td>
                                                                     </tr>
                                                                  </tbody>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                         <!-- image end -->
                                                         <tr>
                                                            <td height="20" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- paragraph -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: right; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M20 Paragraph 1" data-size="M20 Paragraph 1" data-max="26" data-min="6">
                                                               All Rights Reserved @ Company
                                                            </td>
                                                         </tr>
                                                         <!-- paragraph end -->
                                                         <tr>
                                                            <td height="4" style="font-size:0px">&nbsp;</td>
                                                         </tr>
                                                         <!-- link -->
                                                         <tr>
                                                            <td class="res-center" style="text-align: right;">
                                                               <a href="https://example.com" style="color: #00bb9d; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.7px; text-decoration: none; word-break: break-word;" data-color="M20 Link 4" data-size="M20 Link 4" data-max="26" data-min="6">
                                                               Read Terms &amp; Conditions
                                                               </a>
                                                            </td>
                                                         </tr>
                                                         <!-- link end -->
                                                      </tbody>
                                                   </table>
                                                   <!-- right column end -->
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- column x2 end -->
                                 <tr>
                                    <td height="50" style="font-size:0px">&nbsp;</td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
                  <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
               </table>
            </td>
         </tr>
         <tr>
            <td height="35" style="font-size:0px">&nbsp;</td>
         </tr>
         <!-- paragraph -->
         <tr>
            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" data-color="M20 Paragraph 2" data-size="M20 Paragraph 2" data-max="26" data-min="6">
               Did we landed on a wrong place?
            </td>
         </tr>
         <!-- paragraph end -->
         <tr>
            <td height="5" style="font-size:0px">&nbsp;</td>
         </tr>
         <!-- paragraph -->
         <tr>
            <td class="res-center" style="text-align: center; color: #607080; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; font-weight: 600;" data-color="M20 Paragraph 3" data-size="M20 Paragraph 3" data-max="26" data-min="6">
               <a href="sr_unsubscribe">Unsubscribe</a>
            </td>
         </tr>
         <!-- paragraph end -->
         <tr>
            <td height="35" style="font-size:0px">&nbsp;</td>
         </tr>
      </tbody>
   </table>
</div>`;
            sendSmtpEmail.sender = {
              name: `Harshit Sharma`,
              email: `jagdeep.sharma@wes.com`,
            };
            sendSmtpEmail.to = [{ email: item.email, name: item.name }];

            sendSmtpEmail.cc = [
              {
                email: `jagdeep.sharma@westernwaves.com`,
                name: `Harshit Sharma`,
              },
            ];
            sendSmtpEmail.params = {
              parameter: `My param value`,
              subject: `New Subject`,
            };

            apiInstance.sendTransacEmail(sendSmtpEmail).then(
              function (data) {
                console.log(
                  `API called successfully. Returned data: ` +
                    JSON.stringify(data)
                );
              },
              function (error) {
                console.error(error);
              }
            );
          });
        }
      } else {
        console.log(err);
      }
    }
  );
});
router.post(`/sendbyform`, (req, res) => {
  let emp = req.body;
  const { name, subject, email, bodydata, mno } = emp;

  mysqlConnection.query(
    "insert into tbllog(name,uname,mobno,email,isactive) value('" +
      name +
      "','" +
      name +
      "','" +
      mno +
      "','" +
      email +
      "',1)",
    (err, rows, fields) => {
      if (!err) {
        sendSmtpEmail.subject = `${subject}`;
        sendSmtpEmail.htmlContent = `${bodydata}`;
        sendSmtpEmail.sender = {
          name: `Western Waves`,
          email: `market@weternwaves.in`,
        };
        sendSmtpEmail.attachment = [
          {
            url: "http://personal.psu.edu/xqz5228/jpg.jpg", // Should be publicly available and shouldn't be a local file
            name: "myAttachment.jpg",
          },
        ];
        sendSmtpEmail.to = [{ email: email, name: name }];
        sendSmtpEmail.cc = [
          { email: `market@weternwaves.in`, name: `Western Waves` },
        ];
        sendSmtpEmail.params = {
          parameter: `My param value`,
          subject: `New Subject`,
        };

        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
            console.log(
              `API called successfully. Returned data: ` + JSON.stringify(data)
            );
          },
          function (error) {
            console.error(error);
          }
        );
      } else {
        console.log(err);
      }
    }
  );
});
module.exports = router;
