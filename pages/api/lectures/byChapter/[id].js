import Lectures from '@models/Lectures'
import CRUD from '@server/CRUD'
import { deleteChapterAndHisBranch } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'DELETE') {
    return await deleteChapterAndHisBranch(query?.id, res, true)
  } else return await CRUD(Lectures, req, res, { chapterId: req.query.id })
}
