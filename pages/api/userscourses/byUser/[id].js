import UsersCourses from '@models/UsersCourses'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(UsersCourses, req, res, { userId: req.query.id })
}
