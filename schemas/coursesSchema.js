const coursesSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Название курса не может превышать 100 смволов'],
    default: 'Мой новый курс',
  },
  description: {
    type: String,
    maxlength: [
      600,
      'Описание не может превышать 600 символов. Краткость - сестра таланта!',
    ],
    default: 'Описание курса',
  },
  image: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
}

export default coursesSchema
