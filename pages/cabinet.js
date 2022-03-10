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
import { postData, putData } from '@helpers/CRUD'

import { useRouter } from 'next/router'
import SideBar from 'layouts/SideBar'
import Header from '@layouts/Header'
import LoadingContent from '@layouts/content/LoadingContent'
import LectureContent from '@layouts/content/LectureContent'
import CourseWrapper from '@layouts/content/CourseWrapper'
import CourseContent from '@layouts/content/CourseContent'
import ContentWrapper from '@layouts/content/ContentWrapper'
import { sendImage, sendVideo } from '@helpers/cloudinary'
import Link from 'next/link'
import { H2, H3 } from '@components/tags'
import UsersCourses from '@models/UsersCourses'
import dbConnect from '@utils/dbConnect'
import Courses from '@models/Courses'
import { MODES } from '@helpers/constants'
import Chapters from '@models/Chapters'
import Lectures from '@models/Lectures'
import Tasks from '@models/Tasks'
import Answers from '@models/Answers'
import getIds from '@helpers/getIds'

const CourseCard = ({
  course,
  className,
  chaptersCount,
  lecturesCount,
  tasksCount,
}) => {
  return (
    <li className="border-t border-gray-400 last:border-b">
      <Link href={`/course/${course._id}`}>
        <a>
          <div
            className={cn(
              'flex text-lg items-center gap-x-2 px-2 cursor-pointer py-1  w-full bg-white hover:bg-gray-200',
              className
            )}
          >
            <img
              className="h-12 border border-gray-400 rounded-full"
              src={course.image || '/img/UniPlatform.png'}
              alt="course icon"
              // width={48}
              // height={48}
            />
            <div>
              <div>{course.title || '[без названия]'}</div>
              <div className="text-sm">
                <span>Разделы:</span>
                <span className="ml-1">{course.chaptersCount},</span>
                <span className="ml-2">Лекции:</span>
                <span className="ml-1">{course.lecturesCount},</span>
                <span className="ml-2">Задания:</span>
                <span className="ml-1">{course.tasksCount}</span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </li>
  )
}

function CabinetPage({
  courses,
  chapters,
  lectures,
  tasks,
  answers,
  user,
  coursesRole,
}) {
  // const { courses, user, userCourses } = props

  const router = useRouter()

  const coursesWithMoreInfo = courses.map((course) => {
    const chaptersOfCourse = chapters.filter(
      (chapter) => chapter.courseId === course._id
    )
    const chaptersOfCourseIds = getIds(chaptersOfCourse)
    const lecturesOfCourse = lectures.filter((lecture) =>
      chaptersOfCourseIds.includes(lecture.chapterId)
    )
    const lecturesOfCourseIds = getIds(lecturesOfCourse)
    const tasksOfCourse = tasks.filter((task) =>
      lecturesOfCourseIds.includes(task.lectureId)
    )
    return {
      ...course,
      chaptersCount: chaptersOfCourseIds.length,
      lecturesCount: lecturesOfCourse.length,
      tasksCount: tasksOfCourse.length,
    }
  })

  const accessCourses = coursesWithMoreInfo.filter(
    (course) => coursesRole[course._id] !== 'admin'
  )
  const adminCourses = coursesWithMoreInfo.filter(
    (course) => coursesRole[course._id] === 'admin'
  )

  return (
    <>
      <Head>
        <title>Кабинет</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <CourseWrapper>
        {/* ----------------------------- HEADER ------------------------------- */}
        <Header user={user} title="Кабинет" titleLink={`/cabinet`} />
        <ContentWrapper>
          <H2>Доступные курсы</H2>
          <div className="w-full px-2">
            {accessCourses.length > 0 ? (
              <ul className="w-full px-2">
                {accessCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    chaptersCount={course.chaptersCount}
                    lecturesCount={course.lecturesCount}
                    tasksCount={course.tasksCount}
                  />
                ))}
              </ul>
            ) : (
              <div>Нет доступных курсов</div>
            )}
          </div>
          <H2>Мои курсы</H2>
          <div className="w-full">
            {adminCourses.length > 0 ? (
              <ul className="w-full">
                {adminCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </ul>
            ) : (
              <div>Нет курсов созданных мною</div>
            )}
          </div>
          <button
            onClick={() => {
              postData(`/api/courses/${user._id}`, {}, (data) => {
                console.log('data', data)

                router.push(`./course/${data.course._id}/general`)
              })
            }}
            className="w-40 px-2 py-1 text-white duration-300 bg-purple-700 border border-purple-200 rounded-md tablet:w-auto hover:text-purple-700 hover:bg-white hover:border-purple-700"
          >
            Создать свой курс
          </button>
        </ContentWrapper>
      </CourseWrapper>
    </>
  )
}

export default CabinetPage

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

  if (!session) {
    return {
      redirect: {
        destination: `/login`,
      },
    }
  }

  try {
    await dbConnect()

    // Получаем список Id курсов доступных для пользователя

    const userCourses = await UsersCourses.find({ userId: session.user._id })

    const coursesIds = getIds(userCourses, 'courseId')

    const courses = JSON.parse(
      JSON.stringify(
        await Courses.find({
          _id: { $in: coursesIds },
        })
      )
    )
    const coursesRole = {}
    userCourses.forEach((userCourse) => {
      coursesRole[userCourse.courseId] = userCourse.role
    })

    const chapters = JSON.parse(
      JSON.stringify(
        await Chapters.find({
          courseId: { $in: coursesIds },
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

    const answers = JSON.parse(
      JSON.stringify(await Answers.find({ taskId: { $in: getIds(tasks) } }))
    )

    if (!answers) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        courses,
        coursesRole,
        chapters,
        lectures,
        tasks,
        answers,
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        courses: [],
        coursesRole: {},
        chapters: [],
        lectures: [],
        tasks: [],
        answers: [],
        user: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }
}
