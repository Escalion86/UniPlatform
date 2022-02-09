const lecturesSchema = {
  chapterId: {
    type: String,
    required: [true, 'Укажите главу'],
    default: '',
  },
  title: {
    type: String,
    // required: [true, 'Введите название лекции. Давай включи фантазию!'],
    maxlength: [100, 'Название лекции не может превышать 100 смволов'],
    default: 'Новая лекция',
  },
  description: {
    type: String,
    maxlength: [
      6000,
      'Описание не может превышать 6000 символов. Краткость - сестра таланта!',
    ],
    default: 'Описание лекции',
  },
  index: {
    type: Number,
    default: 0,
  },
  videoUrl: {
    type: String,
    default: null,
  },
}

export default lecturesSchema
