const nodemailer = require('nodemailer')

const emailSend = ({ to, from = 'escalion@uniplatform.ru', subject, body }) => {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: from,
        pass: 'magister',
      },
    })

    const message = {
      from,
      to: '2562020@list.ru',
      subject: 'Тест',
      html: `
    <h3>Wow EMail sended!</h3>`,
    }

    transporter.sendMail(message, (error, info) => {
      if (error) {
        rej(err)
      } else {
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
