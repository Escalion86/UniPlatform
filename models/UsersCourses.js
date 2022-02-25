import mongoose from 'mongoose'
import usersCoursesSchema from '@schemas/usersCoursesSchema'

const UsersCoursesSchema = new mongoose.Schema(usersCoursesSchema, {
  timestamps: true,
})

export default mongoose.models.UsersCourses ||
  mongoose.model('UsersCourses', UsersCoursesSchema)
