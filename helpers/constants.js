import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import isDevMode from './isDevMode'

export const DEFAULT_USER = {
  name: 'Гость',
  email: '',
  phone: null,
  whatsapp: null,
  viber: null,
  telegram: null,
  vk: null,
  instagram: null,
  birthday: null,
  gender: null,
  image: null,
  role: 'client',
  subRoles: [],
}

export const DEFAULT_COURSE = {
  title: '',
  description: '',
  image: '',
  adminUsersId: [],
}

export const DEFAULT_CHAPTER = {
  courseId: '',
  title: '',
  description: '',
  image: '',
}

export const DEFAULT_LECTURE = {
  chapterId: '',
  title: '',
  description: '',
}

export const GENDERS = [
  { value: 'male', name: 'Мужчина', color: 'blue-400', icon: faMars },
  { value: 'famale', name: 'Женщина', color: 'red-400', icon: faVenus },
]

export const CLOUDINARY_FOLDER = isDevMode
  ? 'obnimisharik_courses_dev'
  : 'obnimisharik_courses'

export const MODES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
})
