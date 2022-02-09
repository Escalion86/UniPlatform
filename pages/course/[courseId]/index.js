import LoadingSpinner from '@components/LoadingSpinner'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Course = ({ courseId }) => {
  const router = useRouter()

  useEffect(() => router.replace('/course/' + courseId + '/general'), [])

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <LoadingSpinner size="lg" text="Загрузка..." />
    </div>
  )
}

export default Course

export const getServerSideProps = async (context) => {
  // const session = await getSession({ req: context.req })

  const { params } = context
  if (!params) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      courseId: params.courseId,
    },
  }
}
