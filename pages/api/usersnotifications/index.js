import UsersNotifications from '@models/UsersNotifications'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(UsersNotifications, req, res)
}
