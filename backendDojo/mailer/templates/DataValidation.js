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
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.REFRESH_TOKEN,
        accessToken: accessToken
    }
})


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'jinseidojolaplata@gmail.com',
//         pass: 'Ueshiba1'
//     }
// })


module.exports = function validationUserDataEmail(user, mail) {
    const {
        id,
        name,
        lastName,
        dojo,
        instructor,
        isInstructor,
        rank
    } = user
    const validateInstructor = isInstructor === true
        ? `¿${name} ${lastName} es instructor? <input type="radio" name="isInstructor" value="true" checked />Si<span><input type="radio" name="isInstructor" value="false" />No</span>`
        : ``
    const mailOptions = {
        from: 'jinseidojolaplata@gmail.com',
        to: `${mail}`,
        subject: 'Confirmación de datos de usuario',
        html: `<body> 
        <h1>Hola ${instructor}!</h1>
        <h1>${name} ${lastName} se registró en nuestra página y necesitamos que valides sus datos</h1>
        <h1>
        <form action="https://jinseidojo.com/api/email/confirmuser" method="POST">
        ¿Eres el instructor de ${name} ${lastName}? <input type="radio" name="instructor" value="true" checked />Si<span><input type="radio" name="instructor" value="false" />No</span><br>
        ¿${name} ${lastName} entrena en ${dojo}? <input type="radio" name="dojo" value="true" checked />Si<span><input type="radio" name="dojo" value="false" />No</span><br>
        ¿${name} ${lastName} es ${rank}? <input type="radio" name="rank" value="true" checked />Si<span><input type="radio" name="rank" value="false" />No</span><br>
        ${validateInstructor}<br>
        <input type="hidden" name="id" value=${id} />
        <input type="hidden" name="practiceDojo" value=${dojo} />
        <input type="hidden" name="rankLevel" value=${rank} />
        <input type="hidden" name="name" value=${name} />
        <input type="hidden" name="lastName" value=${lastName} />
        <button type="submit" onclick="cerrar()">Validar</button>
        </form>
    </h1>
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