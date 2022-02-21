const nodemailer = require('nodemailer')

const emailSend = (to, subject, html) => {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const message = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    }

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log('error', error)
        rej(error)
      } else {
        console.log('info', info)
        res(info)
      }
    })
  })
  //   // window.Email.send({
  //   //   // Host: process.env.EMAIL_HOST,
  //   //   // Username: process.env.EMAIL_USERNAME,
  //   //   // Password: process.env.EMAIL_PASSWORD,
  //   //   SecureToken: '1be74cb1-ef29-4f2c-a058-5be756dafc3b',
  //   //   To,
  //   //   From,
  //   //   Subject,
  //   //   Body,
  //   // }).then((message) => console.log(message))
}

export default emailSend
