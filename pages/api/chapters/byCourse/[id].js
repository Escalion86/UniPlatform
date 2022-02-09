import Chapters from '@models/Chapters'
import CRUD from '@server/CRUD'
import { deleteCourseAndHisBranch } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'DELETE') {
    return await deleteCourseAndHisBranch(query?.id, res, true)
  } else return await CRUD(Chapters, req, res, { courseId: req.query.id })
}
