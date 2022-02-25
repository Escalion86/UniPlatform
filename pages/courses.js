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

function CoursePage(props) {
  const { courses, user } = props

  const router = useRouter()

  return (
    <>
      <Head>
        <title>Мои курсы</title>
        {/* <meta name="description" content={activeLecture.description} /> */}
      </Head>
      <CourseWrapper>
        {/* ----------------------------- HEADER ------------------------------- */}
        <Header user={user} title="Мои курсы" titleLink={`/courses`} />
        <ContentWrapper>
          <ul className="w-full px-2">
            {courses.map((course) => (
              <li key={course._id} className="w-full my-1 hover:bg-gray-200">
                <Link href={`/course/${course._id}`}>
                  <a>{course.title}</a>
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              postData(
                `/api/courses`,
                { usersRoles: [{ userId: user._id, role: 'admin' }] },
                (course) => {
                  console.log('course', course)
                  router.push(`./course/${course._id}/general`)
                }
              )
            }}
            className="w-40 px-2 py-1 text-white duration-300 bg-purple-700 border border-purple-200 rounded-md tablet:w-auto hover:text-purple-700 hover:bg-white hover:border-purple-700"
          >
            Создать новый курс
          </button>
        </ContentWrapper>
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

  if (!session) {
    return {
      redirect: {
        destination: `/login`,
      },
    }
  }

  try {
    const courses = await fetchingCourses(process.env.NEXTAUTH_SITE)
    return {
      props: {
        courses,
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        courses: null,
        user: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }
}
