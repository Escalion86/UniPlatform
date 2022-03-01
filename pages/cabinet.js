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

const CourseCard = ({ course }) => {
  return <div className="bg-white"></div>
}

function CabinetPage({ courses, user, coursesStatus }) {
  // const { courses, user, userCourses } = props

  const router = useRouter()

  console.log('userCourses', coursesStatus)
  console.log('courses', courses)
  const accessCourses = courses.filter(
    (course) => coursesStatus[course._id] !== 'admin'
  )
  const adminCourses = courses.filter(
    (course) => coursesStatus[course._id] === 'admin'
  )

  console.log('accessCourses', accessCourses)

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
                  <li
                    key={course._id}
                    className="w-full my-1 hover:bg-gray-200"
                  >
                    <Link href={`/course/${course._id}`}>
                      <a>{course.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div>Нет доступных курсов</div>
            )}
          </div>
          <H2>Мои курсы</H2>
          <div className="w-full px-2">
            {adminCourses.length > 0 ? (
              <ul className="w-full">
                {adminCourses.map((course) => (
                  <li
                    key={course._id}
                    className="w-full my-1 hover:bg-gray-200"
                  >
                    <Link href={`/course/${course._id}`}>
                      <a>{course.title}</a>
                    </Link>
                  </li>
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
    console.log('session.user._id', session.user._id)
    const userCourses = await UsersCourses.find({ userId: session.user._id })
    console.log('userCourses', userCourses)
    const coursesIds = userCourses.map((userCourse) => userCourse.courseId)
    console.log('coursesIds', coursesIds)
    const courses = await Courses.find({
      _id: { $in: coursesIds },
    })
    const coursesStatus = {}
    userCourses.forEach((userCourse) => {
      coursesStatus[userCourse.courseId] = userCourse.status
    })

    return {
      props: {
        courses: JSON.parse(JSON.stringify(courses)),
        coursesStatus,
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        courses: [],
        coursesStatus: {},
        user: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }
}
