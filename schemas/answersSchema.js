const answersSchema = {
  taskId: {
    type: String,
    required: [true, 'Укажите задание'],
    default: '',
  },
  userId: {
    type: String,
    required: [true, 'Укажите пользователя выполнивешго задание'],
    default: '',
  },
  teacherId: {
    type: String,
    default: '',
  },
  teacherComment: {
    type: String,
    default: '',
  },
  answer: {
    type: String,
    maxlength: [
      2000,
      'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    ],
    default: '',
  },
  index: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'text', // file, url
  },
}

export default answersSchema
