const emailSend = ({
  To,
  From = 'obnimisharik@uniplatform.ru',
  Subject,
  Body,
}) => {
  window.Email.send({
    // Host: process.env.EMAIL_HOST,
    // Username: process.env.EMAIL_USERNAME,
    // Password: process.env.EMAIL_PASSWORD,
    SecureToken: '1be74cb1-ef29-4f2c-a058-5be756dafc3b',
    To,
    From,
    Subject,
    Body,
  }).then((message) => console.log(message))
}

export default emailSend
