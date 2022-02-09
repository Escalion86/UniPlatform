import Courses from '@models/Courses'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Courses, req, res)
}
