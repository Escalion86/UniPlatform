const chaptersSchema = {
  courseId: {
    type: String,
    required: [true, 'Укажите курс'],
    default: '',
  },
  title: {
    type: String,
    // required: [true, 'Введите название главы. Давай включи фантазию!'],
    maxlength: [100, 'Название главы не может превышать 100 смволов'],
    default: 'Новый раздел',
  },
  description: {
    type: String,
    maxlength: [
      600,
      'Описание не может превышать 600 символов. Краткость - сестра таланта!',
    ],
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  index: {
    type: Number,
    default: 0,
  },
}

export default chaptersSchema
