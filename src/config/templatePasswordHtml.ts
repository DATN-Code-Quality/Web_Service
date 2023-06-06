export const templatePasswordHtml = (user, token, isActive) => {
  let url = `${process.env.DEFAULT_URL}`;

  if (isActive) {
    url += `/active-account?token=${token}`;
  } else {
    url += `/profile/change-password?token=${token}`;
  }

  const stringLink = isActive ? 'ACTIVE ACCOUNT' : 'RESET PASSWORD';
  return `<!DOCTYPE HTML
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
    <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
  
        .u-row .u-col {
          vertical-align: top;
        }
  
        .u-row .u-col-100 {
          width: 600px !important;
        }
  
      }
  
      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
  
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
  
        .u-row {
          width: 100% !important;
        }
  
        .u-col {
          width: 100% !important;
        }
  
        .u-col>div {
          margin: 0 auto;
        }
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }
  
      p {
        margin: 0;
      }
  
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
  
      * {
        line-height: inherit;
      }
  
      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }
  
      table,
      td {
        color: #000000;
      }
  
      #u_body a {
        color: #0000ee;
        text-decoration: underline;
      }
  
      @media (max-width: 480px) {
        #u_content_image_4 .v-src-width {
          width: auto !important;
        }
  
        #u_content_image_4 .v-src-max-width {
          max-width: 43% !important;
        }
  
        #u_content_text_2 .v-container-padding-padding {
          padding: 35px 15px 10px !important;
        }
  
        #u_content_text_3 .v-container-padding-padding {
          padding: 10px 15px 40px !important;
        }
      }
    </style>
  
  
  
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css">
    <!--<![endif]-->
  
  </head>
  
  <body class="clean-body u_body"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body"
      style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #c2e0f4;width:100%"
      cellpadding="0" cellspacing="0">
      <tbody>
        <tr style="vertical-align: top">
          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]-->
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #6f9de1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td
                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table id="u_content_image_4" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                          cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                      <img align="center" border="0"
                                        src="data:image/png;base64,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"
                                        alt="Logo" title="Logo"
                                        style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 30%;max-width: 174px;"
                                        width="174" class="v-src-width v-src-max-width" />
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div
                      style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                          cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:35px 55px 10px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <div style="color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 180%;"><span
                                      style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span
                                          style="line-height: 32.4px; font-size: 18px;">Hi
                                          ${user.name},</span></strong></span>
                                  </p>
                                  <p style="font-size: 14px; line-height: 180%;"> </p>
                                  <p style="line-height: 180%;"><span style="font-family: Lato, sans-serif;"><span
                                        style="font-size: 16px; line-height: 28.8px;">Click here to ${stringLink}</span></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                <div align="center">
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:57px; v-text-anchor:middle; width:269px;" arcsize="77%"  stroke="f" fillcolor="#33428d"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                  <a href=${url} target="_blank" class="v-button"
                                    style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #33428d; border-radius: 44px;-webkit-border-radius: 44px; -moz-border-radius: 44px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                    <span style="display:block;padding:20px 70px;line-height:120%;"><strong><span
                                          style="line-height: 16.8px;">${stringLink}</span></strong></span>
                                  </a>
                                  <!--[if mso]></center></v:roundrect><![endif]-->
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                          cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <div style="line-height: 170%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 170%;"><span
                                      style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">If you
                                      didn't sign in for Code Quality, you can ignore this email. </span></p>
                                  <p style="font-size: 14px; line-height: 170%;"> </p>
                                  <p style="font-size: 14px; line-height: 170%;"><span
                                      style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">Best
                                      regards,</span></p>
                                  <p style="font-size: 14px; line-height: 170%;"><span
                                      style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><strong><span
                                          style="font-size: 16px; line-height: 27.2px;">Code Quality
                                          team</span></strong></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #080f30;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #080f30;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div
                      style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--<![endif]-->
  
                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:42px 10px 15px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <div align="center">
                                  <div style="display: table; max-width:179px;">
                                    <!--[if (mso)|(IE)]><table width="179" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:179px;"><tr><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                      style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle"
                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://linkedin.com/" title="LinkedIn" target="_blank">
                                              <img
                                                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Flinkedin_174857&psig=AOvVaw2cosL31lfYHzPiOnENlf4H&ust=1685175987329000&source=images&cd=vfe&ved=2ahUKEwiS8JHyx5L_AhU4pVYBHbHTCwsQjRx6BAgAEAw"
                                                alt="LinkedIn" title="LinkedIn" width="32"
                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                      style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle"
                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://instagram.com/" title="Instagram" target="_blank">
                                              <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png?20200512141346"
                                                alt="Instagram" title="Instagram" width="32"
                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                      style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle"
                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://twitter.com/" title="Twitter" target="_blank">
                                              <img
                                                src="https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png"
                                                alt="Twitter" title="Twitter" width="32"
                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                      style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td align="left" valign="middle"
                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <a href="https://pinterest.com/" title="Pinterest" target="_blank">
                                              <img
                                                src="https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-1024.png"
                                                alt="Pinterest" title="Pinterest" width="32"
                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
  
  
                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                          cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding"
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;"
                                align="left">
  
                                <div
                                  style="color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 210%;"><span
                                      style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">You're
                                      receiving this email because you added to Code Quality Application.</span></p>
                                  <p style="font-size: 14px; line-height: 210%;"><span
                                      style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">codequality2023@gmail.com</span>
                                  </p>
                                  <p style="font-size: 14px; line-height: 210%;"><span
                                      style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">©2023
                                      CodeQuality | Ho Chi Minh City, Vietnam</span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
  
  </html>`;
};
