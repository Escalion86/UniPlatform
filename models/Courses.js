import mongoose from 'mongoose'
import coursesSchema from '@schemas/coursesSchema'

const CoursesSchema = new mongoose.Schema(coursesSchema, { timestamps: true })

export default mongoose.models.Courses ||
  mongoose.model('Courses', CoursesSchema)
