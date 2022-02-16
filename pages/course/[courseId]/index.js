import LoadingSpinner from '@components/LoadingSpinner'
import {
  fetchingCourse,
  fetchingCourseAndHisChaptersAndLecturesAndTasks,
  fetchingCourses,
} from '@helpers/fetchers'
import ContentWrapper from '@layouts/content/ContentWrapper'
import CourseWrapper from '@layouts/content/CourseWrapper'
import Header from '@layouts/Header'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Course = ({ courseId }) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(courseId ? `/course/${courseId}/general` : '/404')
  }, [])

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <LoadingSpinner />
    </div>
  )
}

export default Course

export const getServerSideProps = async (context) => {
  return {
    props: {
      courseId: context.params?.courseId,
    },
  }
}
