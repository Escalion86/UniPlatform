import emailSend from '@helpers/emailSend'

export default async function handler(req, res) {
  const { query, method, body } = req
  console.log('query', query)
  // return emailSend('2562020@list.ru', 'escalion@uniplatform.ru')
}
