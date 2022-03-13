const emailInvitationCoursesSchema = {
  email: {
    type: String,
    required: [true, 'Укажите EMail пользователя'],
    default: '',
  },
  courseId: {
    type: String,
    required: [true, 'Укажите курс'],
    default: '',
  },
  role: {
    type: String,
    default: '',
  },
}

export default emailInvitationCoursesSchema
