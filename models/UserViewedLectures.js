import mongoose from 'mongoose'
import userViewedLecturesSchema from '@schemas/userViewedLecturesSchema'

const UserViewedLecturesSchema = new mongoose.Schema(userViewedLecturesSchema, {
  timestamps: true,
})

export default mongoose.models.UserViewedLectures ||
  mongoose.model('UserViewedLectures', UserViewedLecturesSchema)
