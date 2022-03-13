import mongoose from 'mongoose'
import emailInvitationCoursesSchema from '@schemas/emailInvitationCoursesSchema'

const EmailInvitationCoursesSchema = new mongoose.Schema(
  emailInvitationCoursesSchema,
  {
    timestamps: true,
  }
)

export default mongoose.models.EmailInvitationCourses ||
  mongoose.model('EmailInvitationCourses', EmailInvitationCoursesSchema)
