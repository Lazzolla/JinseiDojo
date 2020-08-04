// const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'jinseidojolaplata@gmail.com',
//         pass: 'Ueshiba1'
//     }
// })

// function executeQuery() {
                                                               
//     const mailOptions = {
//         from: 'jinseidojolaplata@gmail.com',
//         to: `santiagolaza@gmail.com`,
//         subject: 'Primera Prueba',
//         html: `
//          <body class="bg-light">
//            <div class="container-fluid">
        
//            <h1 class="text-center text-nowrap ">Hola Santiago Laza!</h1>
//            <br>
//            <h4 class="text-center text-secundary">Mengue Fulanito se registro en nuestra pagina y necesitamos que validez sus datos</h4>
//             <br>
//            <form>
//           <div class="form-group">
//             <hr>
//           <label class="h3 custom-control-label" for="customRadioInline1">¿Eres el instructor de Mengue Fulanito?</label> 
//           <input type="radio" id="customRadioInline1" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline1">Si</label>
//           <input type="radio" id="customRadioInline2" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline2">No</label>
//             <br>
//             <hr>
//             <br>
//           <label class="h3 custom-control-label" for="customRadioInline1">¿Eres el instructor de Mengue Fulanito?</label> 
//           <input type="radio" id="customRadioInline1" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline1">Si</label>
//           <input type="radio" id="customRadioInline2" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline2">No</label>
//             <br>
//             <hr>
//             <br>
//           <label class="h3 custom-control-label" for="customRadioInline1">¿Eres el instructor de Mengue Fulanito?</label> 
//           <input type="radio" id="customRadioInline1" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline1">Si</label>
//           <input type="radio" id="customRadioInline2" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline2">No</label>
//             <br>
//             <hr>
//             <br>
//           <label class="h3 custom-control-label" for="customRadioInline1">¿Eres el instructor de Mengue Fulanito?</label> 
//           <input type="radio" id="customRadioInline1" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline1">Si</label>
//           <input type="radio" id="customRadioInline2" name="instructor" class="custom-control-input">
//           <label class="h3 custom-control-label" for="customRadioInline2">No</label>
//           </div>
//              <br>
//              <hr>
//              <br>
//          <a class="btn btn-primary btn-lg" href="https://bootstrapemail.com">Large button</a>    
//          <button type="submit" class="btn btn-primary btn-lg">Validar</button>
//         </form>
//         </div>
//          </body>`
//     }
//     transporter.sendMail(mailOptions, function (err, info) {
//         if(err) {
//             console.log(err)
//         } else {
//             console.log(info)
//         }
//     })
// }

// executeQuery()