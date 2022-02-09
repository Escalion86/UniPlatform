import Courses from '@models/Courses'
import CRUD from '@server/CRUD'
import { deleteCourseAndHisBranch } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'DELETE') {
    return await deleteCourseAndHisBranch(query?.id, res)
  } else return await CRUD(Courses, req, res)
}
