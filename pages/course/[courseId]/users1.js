import LoadingSpinner from '@components/LoadingSpinner'
import { MODES } from '@helpers/constants'
import {
  fetchingCourse,
  fetchingCourseAndHisChaptersAndLecturesAndTasks,
  fetchingCourses,
} from '@helpers/fetchers'
import getIds from '@helpers/getIds'
import ContentWrapper from '@layouts/content/ContentWrapper'
import CourseWrapper from '@layouts/content/CourseWrapper'
import Header from '@layouts/Header'
import Courses from '@models/Courses'
import Users from '@models/Users'
import UsersCourses from '@models/UsersCourses'
import dbConnect from '@utils/dbConnect'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Course = ({ course, user, userCourseAccess, usersInCourse }) => {
  // useEffect(() => {
  //   router.replace(courseId ? `/course/${courseId}/general` : '/404')
  // }, [])

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {/* <LoadingSpinner /> */}
      {usersInCourse.map((user) => (
        <div>{user.name}</div>
      ))}
    </div>
  )
}

export default Course

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })
  await dbConnect()

  const { params } = context
  const { courseId } = params

  if (!params || !courseId) {
    return {
      notFound: true,
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: `/login?CourseId=${courseId}/general`,
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
    // Если он не админ, то также не имеет права находиться тут
    if (userCourseAccess !== MODES.ADMIN) {
      return {
        redirect: {
          destination: `/course/${context.params?.courseId}/general`,
        },
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
        statusInCourse: usersOfCourse.find(
          (userCourse) => userCourse.userId === user._id
        ).role,
      }
    })

    console.log('usersInCourse', usersInCourse)

    return {
      props: {
        course,
        user: session?.user ? session.user : null,
        userCourseAccess,
        usersInCourse,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
