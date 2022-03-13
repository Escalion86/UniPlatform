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
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import Courses from '@models/Courses'
import Lectures from '@models/Lectures'
import Chapters from '@models/Chapters'
import Tasks from '@models/Tasks'
import Answers from '@models/Answers'
import UsersCourses from '@models/UsersCourses'
import getIds from '@helpers/getIds'
import Link from 'next/link'
import Modal from '@layouts/modals/Modal'
import { modalsAtom, modalsFuncAtom } from '@state/atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import Button from '@components/Button'

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
    usersInCourse,
    page,
  } = props
  const [modals, setModals] = useRecoilState(modalsAtom)

  const setModalsFunc = useSetRecoilState(modalsFuncAtom)

  useEffect(() => {
    setModalsFunc(modalsFuncGenerator(setModals))
    // const addModal = (props) => setModals((modals) => [...modals, props])

    // setModalsFunc({
    //   addModal,
    //   confirmModal: ({
    //     title = 'Отмена изменений',
    //     text = 'Вы уверены, что хотите закрыть окно без сохранения изменений?',
    //     onConfirm,
    //   }) => {
    //     addModal({
    //       title,
    //       text,
    //       onConfirm,
    //     })
    //   },
    //   customModal: ({ title, text, onConfirm, Children }) => {
    //     addModal({
    //       title,
    //       text,
    //       onConfirm,
    //       Children,
    //     })
    //   },
    // })
  }, [])

  const [isSideOpen, setIsSideOpen] = useState(true)
  const [mode, setMode] = useState(userCourseAccess)

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [loading, setLoading] = useState()

  const router = useRouter()

  const activeLectureTasks = activeLecture
    ? tasks.filter((task) => task.lectureId === activeLecture._id)
    : []

  useEffect(() => {
    setLoading(false)
  }, [props])

  const refreshPage = (lectureId = null) => {
    if (!lectureId || typeof lectureId !== 'string')
      router.replace(router.asPath)
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

  const admins = usersInCourse.filter(
    (user) => user.statusInCourse === MODES.ADMIN
  )
  const teachers = usersInCourse.filter(
    (user) => user.statusInCourse === MODES.TEACHER
  )
  const students = usersInCourse.filter(
    (user) => user.statusInCourse === MODES.STUDENT
  )

  const UserCard = ({ user }) => (
    <li className="border-t border-gray-400 last:border-b">
      <Link href={`/user/${user._id}`}>
        <a>
          <div className="flex items-center w-full px-2 py-1 text-lg bg-white cursor-pointer gap-x-2 hover:bg-gray-200">
            <img
              className="h-12 border border-gray-400 rounded-full"
              src={user.image || '/img/users/male_gray.png'}
              alt="course icon"
              // width={48}
              // height={48}
            />
            <div>
              <div>{user.name || '[без названия]'}</div>
              <div className="text-sm">
                {/* <span>EMail:</span> */}
                <span className="ml-1">{user.email}</span>
                {/* <span className="ml-2">Лекции:</span>
                <span className="ml-1">{course.lecturesCount},</span>
                <span className="ml-2">Задания:</span>
                <span className="ml-1">{course.tasksCount}</span> */}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </li>
  )

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
          icon={course.image}
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
              {(activeLecture || page === 'general') && (
                <LectureContent
                  course={course}
                  activeChapter={activeChapter}
                  activeLecture={activeLecture}
                  tasks={activeLectureTasks}
                  answers={answers}
                  setMode={setMode}
                  mode={mode}
                  userCourseAccess={userCourseAccess}
                  user={user}
                  isSideOpen={isSideOpen}
                  refreshPage={refreshPage}
                  setIsSideOpen={setIsSideOpen}
                />
              )}
              {page === 'users' && (
                <ContentWrapper className="py-2">
                  <div className="mx-2">Администраторы:</div>
                  <ul className="w-full">
                    {admins.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </ul>
                  {teachers.length > 0 && (
                    <>
                      <div className="mx-2">Преподаватели:</div>
                      <ul className="w-full">
                        {teachers.map((user) => (
                          <UserCard key={user._id} user={user} />
                        ))}
                      </ul>
                    </>
                  )}
                  {students.length > 0 && (
                    <>
                      <div className="mx-2">Студенты:</div>
                      <ul className="w-full">
                        {students.map((user) => (
                          <UserCard key={user._id} user={user} />
                        ))}
                      </ul>
                    </>
                  )}
                  <Button
                    name="Пригласить пользователей на курс"
                    onClick={() => modalsFunc.addUserToCourse({ course })}
                  />
                </ContentWrapper>
              )}
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
        {modals.map((modalProps, index) => (
          <Modal {...modalProps} index={index} key={'modal' + index} />
        ))}
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

const arrayToObjId = (arr, idKey = '_id') => {
  const obj = {}
  arr.forEach((item) => {
    obj[item[idKey]] = item
  })
  return obj
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })
  await dbConnect()

  const { params } = context
  const { courseId, lectureId } = params

  if (!params || !courseId) {
    return {
      notFound: true,
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: `/login?CourseId=${courseId}&LectureId=${lectureId}`,
      },
    }
  }

  try {
    const course = JSON.parse(JSON.stringify(await Courses.findById(courseId)))

    if (!course) {
      return {
        notFound: true,
      }
    }

    // Прежде чем продолжить сначала проверим в какой роли в этом курсе находится пользователь
    // Найдем сначала всех пользователей которые причастны к курсу
    const usersOfCourse = JSON.parse(
      JSON.stringify(
        await UsersCourses.find({
          courseId: course._id,
        })
      )
    )

    if (!usersOfCourse) {
      return {
        notFound: true,
      }
    }

    // Теперь найдем права доступа залогиненного пользователя
    const userCourseAccess = session?.user
      ? usersOfCourse.find(
          (userCourse) => userCourse.userId === session.user._id
        )?.role
      : null

    // Если не нашли, то значит у пользователя нет доступа к курсу
    if (!userCourseAccess) {
      return {
        notFound: true,
      }
    }

    const chapters = JSON.parse(
      JSON.stringify(
        await Chapters.find({
          courseId: course._id,
        })
      )
    )

    if (!chapters) {
      return {
        notFound: true,
      }
    }

    const lectures = JSON.parse(
      JSON.stringify(
        await Lectures.find({
          chapterId: { $in: getIds(chapters) },
        })
      )
    )

    if (!lectures) {
      return {
        notFound: true,
      }
    }

    const activeLecture =
      lectureId &&
      lectureId !== 'general' &&
      lectureId !== 'users' &&
      lectures.find((lection) => lection._id === lectureId)

    const isActiveLectionIdExist = !!activeLecture?._id

    if (
      !isActiveLectionIdExist &&
      lectureId !== 'general' &&
      lectureId !== 'users'
    ) {
      return {
        notFound: true,
      }
    }

    const activeChapter = activeLecture
      ? chapters.find((chapter) => chapter._id === activeLecture.chapterId)
      : null

    const tasks = JSON.parse(
      JSON.stringify(
        await Tasks.find({
          lectureId: { $in: getIds(lectures) },
        })
      )
    )

    if (!tasks) {
      return {
        notFound: true,
      }
    }

    // Ответы в курсе будем искать в зависимости от прав пользователя. Если это просто студент, то будем искать только его ответы
    const obj = {
      taskId: { $in: getIds(tasks) },
    }
    if (
      userCourseAccess !== MODES.ADMIN &&
      userCourseAccess !== MODES.TEACHER
    ) {
      obj.userId = session.user._id
    }
    let answers = JSON.parse(JSON.stringify(await Answers.find(obj)))

    if (!answers) {
      return {
        notFound: true,
      }
    }

    // Формируем пользователей причастных к курсу, но берем только нужные поля
    const users = JSON.parse(
      JSON.stringify(
        await Users.find({ _id: { $in: getIds(usersOfCourse, 'userId') } })
      )
    )
    const usersInCourse = users.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        statusInCourse: usersOfCourse.find(
          (userCourse) => userCourse.userId === user._id
        ).role,
      }
    })

    // Добавляем к ответам данные пользователя
    answers = answers.map((answer) => {
      return {
        ...answer,
        user: usersInCourse.find((user) => user._id === answer.userId),
        teacher: answer.teacherId
          ? usersInCourse.find((user) => user._id === answer.teacherId)
          : null,
      }
    })

    // const resp = await fetchingCourseAndHisChaptersAndLecturesAndTasks(
    //   params.courseId,
    //   process.env.NEXTAUTH_SITE
    // )

    // if (!resp) {
    //   return {
    //     notFound: true,
    //   }
    // }

    // const { course, chapters, lectures, tasks } = resp

    // const activeChapter = activeLecture
    //   ? chapters.find((chapter) => chapter._id === activeLecture.chapterId)
    //   : null

    // const userId = session.user._id

    // const allUserAnswers = await fetchingAnswersByUserId(
    //   userId,
    //   process.env.NEXTAUTH_SITE
    // )

    // const userViewedLectures = await fetchingUserViewedLecturesByUserId(
    //   userId,
    //   process.env.NEXTAUTH_SITE
    // )

    // const userViewedLecturesIds = userViewedLectures.map(
    //   (item) => item.lectureId
    // )

    // const tasksIds = tasks.map((task) => task._id)

    // let courseAnswers = allUserAnswers.filter((answer) =>
    //   tasksIds.includes(answer.taskId)
    // )

    // const userRole = session?.user
    //   ? course.usersRoles.find(
    //       (userIdAndRole) => userIdAndRole.userId === session.user._id
    //     )?.role
    //   : null

    // let usersInCourse = []

    // if (userRole === MODES.TEACHER || userRole === MODES.ADMIN) {
    //   let usersInAnswers = {}
    //   courseAnswers.forEa

    //   const usersAnswers = courseAnswers.map((answer) => answer.userId)

    //   const usersIdsInCourse = [...new Set(usersAnswers)]
    //   usersInCourse = JSON.parse(
    //     JSON.stringify(
    //       await Users.find({
    //         _id: { $in: usersIdsInCourse },
    //       })
    //     )
    //   ).map((user) => {
    //     return {
    //       _id: user._id,
    //       name: user.name,
    //       email: user.email,
    //     }
    //   })
    // }

    // courseAnswers = courseAnswers.map((answer) => {
    //   const updatedAnswer = {...answer}
    //   delete updatedAnswer.UserId
    //   updatedAnswer.user =
    // })

    return {
      props: {
        course,
        chapters,
        lectures,
        tasks,
        answers,
        userViewedLecturesIds: [], // FIX Исправить
        activeLecture,
        activeChapter,
        user: session?.user ? session.user : null,
        userCourseAccess,
        usersInCourse,
        page: activeLecture ? null : lectureId,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
