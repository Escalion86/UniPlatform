const usersCoursesSchema = {
  userId: {
    type: String,
    required: [true, 'Укажите пользователя'],
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

export default usersCoursesSchema
