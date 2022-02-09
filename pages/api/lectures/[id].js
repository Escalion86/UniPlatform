import Lectures from '@models/Lectures'
import CRUD from '@server/CRUD'
import { deleteLectureAndHisBranch } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'DELETE') {
    return await deleteLectureAndHisBranch(query?.id, res)
  } else return await CRUD(Lectures, req, res)
}
