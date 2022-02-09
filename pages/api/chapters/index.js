import Chapters from '@models/Chapters'
import CRUD from '@server/CRUD'
import { createChapterAndHisLecture } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'POST') {
    return await createChapterAndHisLecture(req, res)
  } else return await CRUD(Chapters, req, res)
}
