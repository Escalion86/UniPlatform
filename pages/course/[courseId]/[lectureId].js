import {
  fetchingAnswersByUserId,
  fetchingChapter,
  fetchingChapters,
  fetchingChaptersByCourseId,
  fetchingCourse,
  fetchingCourseAndHisChaptersAndLecturesAndTasks,
  fetchingCourses,
  fetchingLecture,
  fetchingLectures,
  fetchingTasksByLectureId,
  fetchingUserViewedLecturesByUserId,
} from '@helpers/fetchers'
// import useWindowDimensions from '@helpers/useWindowDimensions'
import { motion } from 'framer-motion'
import { getSession } from 'next-auth/react'

import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import 'react-edit-text/dist/index.css'
import { putData } from '@helpers/CRUD'

import { useRouter } from 'next/router'
import SideBar from 'layouts/SideBar'
import Header from '@layouts/Header'
import LoadingContent from '@layouts/content/LoadingContent'
import LectureContent from '@layouts/content/LectureContent'
import CourseWrapper from '@layouts/content/CourseWrapper'
import CourseContent from '@layouts/content/CourseContent'
import ContentWrapper from '@layouts/content/ContentWrapper'
import { sendImage, sendVideo } from '@helpers/cloudinary'
import Fab from '@components/Fab'
import {
  faGraduationCap,
  faPencilAlt,
  faSmile,
} from '@fortawesome/free-solid-svg-icons'
import { MODES } from '@helpers/constants'

function CoursePage(props) {
  const {
    activeLecture,
    activeChapter,
    course,
    chapters,
    lectures,
    tasks,
    answers,
    user,
    userCourseAccess = MODES.STUDENT,
    userViewedLecturesIds,
  } = props

  const [isSideOpen, setIsSideOpen] = useState(true)
  const [mode, setMode] = useState(MODES.STUDENT)

  const [loading, setLoading] = useState()

  const router = useRouter()

  const activeLectureTasks = activeLecture
    ? tasks.filter((task) => task.lectureId === activeLecture._id)
    : []

  console.log('activeLectureTasks', activeLectureTasks)
  useEffect(() => {
    setLoading(false)
  }, [props])

  const refreshPage = (lectureId = null) => {
    if (!lectureId) router.replace(router.asPath)
    else {
      router.replace('/course/' + course._id + '/' + lectureId)
    }
  }

  const goToCourseGeneralPage = () => router.replace('/course/' + course._id)

  const fabList = [
    {
      value: MODES.ADMIN,
      icon: faPencilAlt,
      name: 'Режим редактирования',
      color: '#AA0000',
    },
    {
      value: MODES.TEACHER,
      icon: faGraduationCap,
      name: 'Режим преподавателя',
      color: '#9563ff',
    },
    {
      value: MODES.STUDENT,
      icon: faSmile,
      name: 'Режим ученика',
      color: '#2A323B',
    },
  ]

  return (
    <>
      <Head>
        <title>
          {activeLecture
            ? `Лекция №${activeLecture.index + 1} - ${activeLecture.title}`
            : `Курс ${course.title}`}
        </title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <CourseWrapper>
        {/* ----------------------------- HEADER ------------------------------- */}
        <Header
          user={user}
          title={course.title}
          titleLink={`/course/${course._id}/general`}
        />
        {/* ----------------------------- SIDEBAR ------------------------------- */}
        {loading && <LoadingContent />}
        {!loading && (
          <>
            <SideBar
              isSideOpen={isSideOpen}
              setIsSideOpen={setIsSideOpen}
              course={course}
              chapters={chapters}
              lectures={lectures}
              tasks={tasks}
              answers={answers}
              activeLecture={activeLecture}
              activeChapter={activeChapter}
              userViewedLecturesIds={userViewedLecturesIds}
              mode={mode}
              refreshPage={refreshPage}
              goToCourseGeneralPage={goToCourseGeneralPage}
              setLoading={setLoading}
            />
            {/* ----------------------------- CONTENT ------------------------------- */}
            <ContentWrapper>
              {/* {!activeLecture && (
                <CourseContent
                  course={course}
                  activeChapter={activeChapter}
                  activeLecture={activeLecture}
                  setEditMode={setEditMode}
                  editMode={editMode}
                  userCourseAccess={userCourseAccess}
                  isSideOpen={isSideOpen}
                  refreshPage={refreshPage}
                  setIsSideOpen={setIsSideOpen}
                />
              )}
              {activeLecture && ( */}
              <LectureContent
                course={course}
                activeChapter={activeChapter}
                activeLecture={activeLecture}
                tasks={activeLectureTasks}
                answers={answers}
                setMode={setMode}
                mode={mode}
                userCourseAccess={userCourseAccess}
                isSideOpen={isSideOpen}
                refreshPage={refreshPage}
                setIsSideOpen={setIsSideOpen}
              />
              {(userCourseAccess === MODES.ADMIN ||
                userCourseAccess === MODES.TEACHER) && (
                <Fab
                  show={true}
                  onClick={setMode}
                  list={fabList.filter(
                    (item) =>
                      userCourseAccess === MODES.ADMIN ||
                      item.value !== MODES.ADMIN
                  )}
                  activeValue={mode}
                />
              )}
            </ContentWrapper>
          </>
        )}
      </CourseWrapper>
    </>
  )
}

export default CoursePage

// export const getStaticPaths = async () => {
//   console.log('getStaticPaths fetching...')
//   const courses = await fetchingCourses(null, 'http://localhost:3000')
//   const chapters = await fetchingChapters(null, 'http://localhost:3000')
//   const lectures = await fetchingLectures(null, 'http://localhost:3000')

//   let paths = []
//   courses.forEach((course) => {
//     const courseChapters = chapters.filter(
//       (chapter) => chapter.courseId === course._id
//     )
//     courseChapters.forEach((chapter) => {
//       const chapterLectures = lectures.filter(
//         (lecture) => lecture.chapterId === chapter._id
//       )
//       chapterLectures.forEach((lecture) =>
//         paths.push(`/course/${course._id}/${lecture._id}`)
//       )
//     })
//   })

//   console.log('paths', paths)

//   return {
//     paths,
//     fallback: true,
//   }
// }

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  const { params } = context
  if (!params) {
    return {
      notFound: true,
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: `/login?CourseId=${params.courseId}&LectureId=${params.lectureId}`,
      },
    }
  }

  try {
    const resp = await fetchingCourseAndHisChaptersAndLecturesAndTasks(
      params.courseId,
      process.env.NEXTAUTH_SITE
    )

    if (!resp) {
      return {
        notFound: true,
      }
    }

    const { course, chapters, lectures, tasks } = resp

    const activeLectureId = params.lectureId

    const activeLecture =
      activeLectureId &&
      activeLectureId !== 'general' &&
      lectures.find((lection) => lection._id === activeLectureId)

    const isActiveLectionIdExist = !!activeLecture

    if (!isActiveLectionIdExist && activeLectureId !== 'general') {
      return {
        notFound: true,
      }
    }

    const activeChapter = activeLecture
      ? chapters.find((chapter) => chapter._id === activeLecture.chapterId)
      : null

    const userId = session.user._id

    const allUserAnswers = await fetchingAnswersByUserId(
      userId,
      process.env.NEXTAUTH_SITE
    )

    const userViewedLectures = await fetchingUserViewedLecturesByUserId(
      userId,
      process.env.NEXTAUTH_SITE
    )

    const userViewedLecturesIds = userViewedLectures.map(
      (item) => item.lectureId
    )

    const tasksIds = tasks.map((task) => task._id)

    const courseAnswers = allUserAnswers.filter((answer) =>
      tasksIds.includes(answer.taskId)
    )

    const userRole = session?.user
      ? course.usersRoles.find(
          (userIdAndRole) => userIdAndRole.userId === session.user._id
        )?.role
      : null

    return {
      props: {
        course,
        chapters,
        lectures,
        tasks,
        answers: courseAnswers,
        userViewedLecturesIds,
        activeLecture,
        activeChapter,
        user: session?.user ? session.user : null,
        userCourseAccess: userRole ?? MODES.STUDENT,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
