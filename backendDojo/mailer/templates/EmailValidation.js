const nodemailer = require('nodemailer'),
    { google } = require("googleapis"),
    OAuth2 = google.auth.OAuth2,
    config = require('../../config/googleAPIS')


const oauth2Client = new OAuth2(
    config.CLIENT_ID, // ClientID
    config.CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
)

oauth2Client.setCredentials({
    refresh_token: config.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'jinseidojolaplata@gmail.com',
        clientId: '787893340382-k48fhsn92bspf53dleu2fp6jvvlp2fcv.apps.googleusercontent.com',
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.REFRESH_TOKEN,
        accessToken: accessToken
    }
})

module.exports = function EmailValidation(userData, emailValidationCode) {
    const {
        name,
        lastName,
        mail
    } = userData

    const mailOptions = {
        from: 'jinseidojolaplata@gmail.com',
        to: `${mail}`,
        subject: 'Validación de Correo',
        html: `<body>
        <h1>Hola ${name} ${lastName}!</h1>
        <h2>Copiá el código a continuación y pegalo en la página de Jinsei Dojo para completar el registro</h2>
        <h1>${emailValidationCode}</h1>
</body>`
    }
    smtpTransport.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}