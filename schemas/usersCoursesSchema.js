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
  status: {
    type: String,
    default: '',
  },
}

export default usersCoursesSchema
