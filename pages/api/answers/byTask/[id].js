import Answers from '@models/Answers'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Answers, req, res, { taskId: req.query.id })
}
