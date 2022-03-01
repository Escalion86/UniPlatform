const tasksSchema = {
  lectureId: {
    type: String,
    required: [true, 'Укажите лекцию'],
    default: '',
  },
  title: {
    type: String,
    maxlength: [100, 'Название задания не может превышать 100 смволов'],
    default: 'Название задания',
  },
  description: {
    type: String,
    maxlength: [
      600,
      'Описание не может превышать 600 символов. Краткость - сестра таланта!',
    ],
    default: 'Описание задания',
  },
  index: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'text', // file, url
  },
  autoConfirm: {
    type: Boolean,
    default: false,
  },
}

export default tasksSchema
