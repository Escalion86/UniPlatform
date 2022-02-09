const userViewedLecturesSchema = {
  userId: {
    type: String,
    required: [true, 'Укажите пользователя'],
    default: '',
  },
  lectureId: {
    type: String,
    required: [true, 'Укажите лекцию'],
    default: '',
  },
}

export default userViewedLecturesSchema
