import emailSend from '@helpers/emailSend'
import EmailConfirmations from '@models/EmailConfirmations'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import { v4 as uuid } from 'uuid'

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()
  if (method === 'POST') {
    try {
      const newEmailConfirmation = await EmailConfirmations.create({
        email: body.email,
        password: body.password,
        token: uuid(),
      })
      if (!newEmailConfirmation) {
        return res?.status(400).json({ success: false })
      }

      const urlToConfirm = `${process.env.NEXTAUTH_SITE}/emailconfirm?email=${newEmailConfirmation.email}&token=${newEmailConfirmation.token}`

      emailSend(
        newEmailConfirmation.email,
        'Подтверждение регистрации на UniPlatform.ru',
        `
        <h3><a href="${urlToConfirm}">Кликните по мне для завершения регистрации</a></h3>
      `
      )

      return res
        ?.status(201)
        .json({ success: true, data: newEmailConfirmation })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  if (method === 'GET') {
    console.log('query', query)
    const { email, token } = query
    if (!email)
      return res
        ?.status(400)
        .json({ success: false, error: 'Отсутствует email' })
    if (!token)
      return res
        ?.status(400)
        .json({ success: false, error: 'Отсутствует токен' })
    try {
      const data = await EmailConfirmations.findOne({ email, token })
      if (!data) {
        return res
          ?.status(400)
          .json({ success: false, error: 'Нет данных по токену' })
      }
      const newUser = await Users.create({
        email,
        password: data.password,
        name: '',
      })
      if (!newUser)
        return res
          ?.status(400)
          .json({ success: false, error: 'Не удалось создать пользователя' })

      return res?.status(201).json({ success: true, data: newUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
}
