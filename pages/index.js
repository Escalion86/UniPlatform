// import dbConnect from '@utils/dbConnect'

import { fetchingCourses } from '@helpers/fetchers'
import ContentWrapper from '@layouts/content/ContentWrapper'
import CourseWrapper from '@layouts/content/CourseWrapper'
import Header from '@layouts/Header'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'

// import csv from '../tilda.csv'

// const csvToJsonFunc = () => {
//   csv()
// // .fromFile(csvFilePath)
// .fromStream(request.get('https://store.tilda.cc/store/export/?task=922544378201'))
// .then((jsonObj)=>{
//     console.log(jsonObj);
//     /**
//      * [
//      * 	{a:"1", b:"2", c:"3"},
//      * 	{a:"4", b:"5". c:"6"}
//      * ]
//      */
// })
//   // const json = csvToJson.formatValueByType().getJsonFromCsv('tilda.csv')
//   // console.log(`json`, js`on)
// }

const CourseCard = ({ course }) => {
  return <div className=""></div>
}

export default function Home(props) {
  const { courses, user } = props
  // const { height, width } = useWindowDimensions()
  // const { data: session, status } = useSession()
  // const loading = status === 'loading'

  // if (session) console.log(`session`, session)
  console.log('courses', courses)
  console.log('user', user)
  return (
    <>
      <Head>
        <title>Uniplatform</title>
      </Head>
      <CourseWrapper>
        <Header user={user} title="Uniplatform" />
        <ContentWrapper>
          {courses.map((course) => {
            return (
              <Link href={`/course/${course._id}`}>
                <a className="px-2 py-1 text-left border-b border-gray-300 cursor-pointer hover:bg-gray-400">
                  {course.title}
                </a>
              </Link>
            )
          })}
        </ContentWrapper>
      </CourseWrapper>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  try {
    const courses = await fetchingCourses(null, process.env.NEXTAUTH_URL)

    return {
      props: {
        courses,
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
