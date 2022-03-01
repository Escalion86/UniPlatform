import { MODES } from '@helpers/constants'
import Courses from '@models/Courses'
import UsersCourses from '@models/UsersCourses'
import CRUD from '@server/CRUD'
import { deleteCourseAndHisBranch } from '@server/massCRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()

  if (method === 'DELETE') {
    return await deleteCourseAndHisBranch(query?.id, res)
  }
  if (method === 'POST') {
    // Если создаем курс, то id это id пользователя создавшего курс
    if (!query?.id) {
      return res?.status(400).json({ success: false })
    }
    const course = await Courses.create(body)
    const userCourse = await UsersCourses.create({
      courseId: course._id,
      userId: query.id,
      status: MODES.ADMIN,
    })
    return res
      ?.status(200)
      .json({ success: true, data: { course, userCourse } })
  } else {
    return await CRUD(Courses, req, res)
  }
}
