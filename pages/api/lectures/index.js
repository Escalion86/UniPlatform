import Lectures from '@models/Lectures'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Lectures, req, res)
}
