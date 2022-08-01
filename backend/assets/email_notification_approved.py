approved_html_content = """\
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
                    <h2>We have an update regarding your application</h2>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-top: 1em; padding-left: 3em;">
                    <h4>Congratulations, Your application has been approved.</h4>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-top: 8px; padding-left: 3em;">
                    <h4>The next steps for you will be as follows:</h4>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-left: 4em;">
                    <ol>
                        <li>Your university will contact you directly with the confirmation.</li>
                        <li>Reply to the email within the deadline stating your choice of acceptance or refusal to the offer.</li>
                        <li>Pay the confirmation amount if you choose to accept.</li>
                        <li>The university will then let you know of the next steps and provide details about the contact person for further queries.</li>
                    </ol>
                </td>
            </tr>
            <tr>
                <td style="display: flex; padding-top: 8px; padding-left: 3em;">
                    <p style="font-weight: 700;">Please note:</p>
                    <p style="padding-left: 2px;">All further communication from now on should be done with the university directly. Kindly visit university details page to obtain their contact information.</p>
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

approved_plain_text="""\
We have an update regarding your application\n
Congratulations, Your application has been approved.\n
The next steps for you will be as follows:\n
\t1. Your university will contact you directly with the confirmation.\n
\t2. Reply to the email within the deadline stating your choice of acceptance or refusal to the offer.\n
\t3. Pay the confirmation amount if you choose to accept.\n
\t4. The university will then let you know of the next steps and provide details about the contact person for further queries.\n
Please note: All further communication from now on should be done with the university directly. Kindly visit university details page to obtain their contact information.

"""
