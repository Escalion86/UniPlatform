import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { courseId, lectureId } = router.query

  useEffect(() => {
    if (!session && status !== 'loading') {
      signIn('google')
    } else if (status === 'authenticated') {
      if (courseId && lectureId) router.push(`/course/${courseId}/${lectureId}`)
      else router.push(`/`)
      // // Если авторизированы
      // const fetching = async () => {
      //   // const result = await fetchingAll(setData)
      //   await fetchingAll((result) => {
      //     if (result) dispatch(setAllData(result))
      //   })

      //   // await dispatch(setModalsFunctions(result))
      // }
      // fetching()
      // const role = session.user?.role
      // if (role === 'deliver') setPageId(14)
      // if (role === 'aerodesigner') setPageId(13)
      // if (role === 'operator') setPageId(11)

      // if (
      //   new Date(session.user?.prevActivityAt) <
      //   new Date(versionHistory[0].date)
      // )
      //   modals.openVersionHistoryModal()

      // // const ordersListener = Orders.watch()
    }
  }, [!!session, status])

  return (
    <div>{status === 'authenticated' ? 'Авторизован' : 'Не авторизован'}</div>
  )
}

export default Login
