import UserViewedLectures from '@models/UserViewedLectures'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(UserViewedLectures, req, res, { userId: req.query.id })
}
