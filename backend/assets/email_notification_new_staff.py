body_html_content = """\
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>UAccess</title>
    <body>
        <table style="width:100%;">
            <tr>
                <td style="background-color: rgb(43 83 109); display: flex; justify-content: center;">
                    <img src="https://uaccess-profile-pictures.s3.amazonaws.com/uaccess-logo.jpeg" alt="logo" style="height:auto;display:block;">
                </td>
            </tr>
            <tr>
                <td style="background-color: rgb(225, 229, 233); display: flex; padding-left: 2em; padding-top: 2em;">
                    <h2>Welcome to UAccess Platform</h2>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-top: 1em; padding-left: 3em;">
                    <h4>Below are your temporaty Login Credentials:</h4>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-top: 1em; padding-left: 4em;">
                    <ui>
                        <li>Email : eAddress</li>
                        <li>Password : password</li>
                    </ui>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-top: 8px; padding-left: 3em;">
                    <a style="height: 40px;
                    background-color: rgb(43 83 109);
                    color: white;
                    border-radius: 4px;
                    padding-top: 16px;
                    padding-right: 8px;
                    padding-left: 8px;
                    /* padding: 8px; */
                    cursor: pointer;
                    text-decoration: none;" href="https://uaccess-ui.herokuapp.com/login">Sign into your account</a>
                </td>
            </tr>
            <tr>
                <td style="background-color: rgb(225, 229, 233); display: flex; justify-content: end; padding: 3em 2em; margin-top: 8px;">
                    Copyright UAccess
                </td>
            </tr>
        </table>
    </body>
    <style>
        table, td, div, h1, p {font-family: 'Times New Roman', Times, serif, sans-serif;}
    </style>
</head>
</html>"""

body_plain_content = """\
Welcome to UAccess Platform\n
Below are your temporaty Login Credentials:\n
The next steps for you will be as follows:\n
\t- Email : $(emailAddress)\n
\t- Password : $(password)\n
"""
