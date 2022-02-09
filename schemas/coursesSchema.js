const coursesSchema = {
  title: {
    type: String,
    required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Название курса не может превышать 100 смволов'],
    default: '',
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
  videoUrl: {
    type: String,
    default: '',
  },
  usersRoles: {
    type: Array,
    of: Map,
    default: [],
  },
}

export default coursesSchema
