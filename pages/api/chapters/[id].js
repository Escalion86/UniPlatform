import Chapters from '@models/Chapters'
import CRUD from '@server/CRUD'
import { deleteChapterAndHisBranch } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'DELETE') {
    return await deleteChapterAndHisBranch(query?.id, res)
  } else return await CRUD(Chapters, req, res)
}
