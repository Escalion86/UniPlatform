export async function fetchingAll(setState = () => {}) {
  console.log('Запущен fetchingAll')
  const urls = ['/api/admin']
  const result = await Promise.all(
    urls.map(async (url) => {
      const resp = await fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)
      return resp
    })
  )
  setState(result[0])
  return result[0]
}

export async function fetchingCourses(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingCourses')
  const resp = await fetch(`${domen}/api/courses`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingCourse(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingCourse')
  const resp = await fetch(`${domen}/api/courses/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingCourseAndHisChaptersAndLecturesAndTasks(
  courseId,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingCourseAndHisChaptersAndLectures')
  const course = await fetchingCourse(courseId, null, domen)
  const chapters = await fetchingChaptersByCourseId(courseId, null, domen)
  const lectures = await fetchingLectures(null, domen)
  const tasks = await fetchingTasks(null, domen)

  const courseChaptersIds = chapters.map((chapter) => chapter._id)

  const courseLectures = lectures.filter((lecture) =>
    courseChaptersIds.includes(lecture.chapterId)
  )

  const courseLecturesIds = courseLectures.map((lecture) => lecture._id)

  const courseTasks = tasks.filter((task) =>
    courseLecturesIds.includes(task.lectureId)
  )

  return {
    course,
    chapters,
    lectures: courseLectures,
    tasks: courseTasks,
  }
}

export async function fetchingChapters(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingChapters')
  const resp = await fetch(`${domen}/api/chapters`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingChapter(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingChapter')
  const resp = await fetch(`${domen}/api/chapters/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingChaptersByCourseId(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingChapterByCourseId')
  const resp = await fetch(`${domen}/api/chapters/byCourse/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingLectures(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingLectures')
  const resp = await fetch(`${domen}/api/lectures`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingLecturesByChapterId(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingLectureByChapterId')
  const resp = await fetch(`${domen}/api/lectures/byChapter/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingTasks(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingTasks')
  const resp = await fetch(`${domen}/api/tasks`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingTask(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingTask')
  const resp = await fetch(`${domen}/api/tasks/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingTasksByLectureId(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingTasksByLectureId')
  const resp = await fetch(`${domen}/api/tasks/byLecture/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingAnswers(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingAnswers')
  const resp = await fetch(`${domen}/api/answers`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingAnswer(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingAnswer')
  const resp = await fetch(`${domen}/api/answers/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingAnswersByTaskId(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingAnswersByTaskId')
  const resp = await fetch(`${domen}/api/answers/byTask/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingAnswersByUserId(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingAnswersByUserId')
  const resp = await fetch(`${domen}/api/answers/byUser/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingUserViewedLecturesByUserId(
  id,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingUserViewedLecturesByUserId')
  const resp = await fetch(`${domen}/api/userviewedlectures/byUser/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingUserViewedLectures(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingUserViewedLectures')
  const resp = await fetch(`${domen}/api/userviewedlectures`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingUsers(
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingUsers')
  const resp = await fetch(`${domen}/api/users`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}

export async function fetchingUserByEmail(
  email,
  updateData = null,
  domen = process.env.NEXTAUTH_SITE
) {
  console.log('Запущен fetchingUserByEmail')
  const resp = await fetch(`${domen}/api/users/byEmail/${email}`)
    .then((res) => res.json())
    .then((json) => json.data)
  updateData && updateData(resp)
  return resp
}
