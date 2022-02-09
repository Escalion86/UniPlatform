import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { signIn, signOut, useSession } from 'next-auth/react'

import Button from '@components/Button'

import Cabinet from '@admin/Cabinet'

import Spinner from '@admincomponents/Spinner'

import { fetchingAll } from '@helpers/fetchers'

import { DEFAULT_USER, ROLES } from '@helpers/constants'
import { setAllData } from '@state/actions'
// import { addModal, removeModal } from '@state/actions/modalsActions'
import {
  addModal,
  removeAllModals,
  removeModal,
} from '@state/actions/modalsActions'
import modalsFunctions from '@admin/modals/modalsFunctions'
import { setPage } from '@state/actions/pageActions'
import { pages, pagesGroups } from '@admin/pages'
import versionHistory from '@helpers/versionHistory'
import accessTable from '@helpers/accessTable'

const menuCfg = (pages, pagesGroups, user) => {
  return pagesGroups.reduce((totalGroups, group) => {
    const pagesItems = pages.reduce((totalPages, page) => {
      if (page.group === group.id) {
        if (page.variable && user.access[page.variable]) {
          if (user.access[page.variable].page) totalPages.push(page)
          return totalPages
        } else {
          if (user.access['other'].page) totalPages.push(page)
          return totalPages
        }
      }
      return totalPages
    }, [])
    if (pagesItems.length > 0)
      totalGroups.push({
        name: group.name,
        icon: group.icon,
        items: pagesItems,
        bottom: group.bottom,
      })
    return totalGroups
  }, [])
}

export default function Admin() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  console.log('session', session)
  console.log('status', status)

  const state = useSelector((state) => state)

  const dispatch = useDispatch()

  const { page } = state

  const loggedUser =
    !loading && session?.user
      ? state.users.find((user) => session.user._id === user._id) ??
        session.user
      : null

  const haveAccess =
    loggedUser?.role &&
    ROLES.filter((role) => role.value === loggedUser?.role).length > 0
  if (haveAccess) loggedUser.access = accessTable(loggedUser)

  const modals = !loading
    ? modalsFunctions(dispatch, state, loggedUser ?? DEFAULT_USER)
    : null

  const setPageId = (id, props = {}) => {
    pages.some((page) => {
      if (page.id === id) {
        dispatch(setPage(page))
        // setPage({ ...page, ...props })
        return true
      }
    })
  }

  useEffect(() => {
    if (!session && !loading) {
      signIn('google')
    } else if (status === 'authenticated') {
      console.log('авторизован')
      // Если авторизированы
      const fetching = async () => {
        // const result = await fetchingAll(setData)
        await fetchingAll((result) => {
          if (result) dispatch(setAllData(result))
        })

        // await dispatch(setModalsFunctions(result))
      }
      fetching()
      const role = session.user?.role
      if (role === 'deliver') setPageId(14)
      if (role === 'aerodesigner') setPageId(13)
      if (role === 'operator') setPageId(11)

      if (
        new Date(session.user?.prevActivityAt) <
        new Date(versionHistory[0].date)
      )
        modals.openVersionHistoryModal()

      // const ordersListener = Orders.watch()
    }
  }, [!!session, status])

  const pagesCourses = state.courses.map((course) => {
    return {
      id: course._id,
      group: 1,
      name: course.title,
      pageContent: CourseContent,
      // addButton: null,
      backToPageId: 1,
      variable: null,
    }
  })

  return (
    <>
      {(!state.loaded || loading) && (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      )}
      {
        // state.loaded && !loading &&
        <>
          {haveAccess ? (
            <>
              {/* {modal} */}
              {/* {confirmModal} */}
              {/* {state.modals.map((Modal, index) => (
                <Modal key={'modal' + index} />
              ))} */}
              {Object.keys(state.modals).map((key) => {
                const Modal = state.modals[key]
                return (
                  <Modal
                    key={'modal' + key}
                    onClose={() => dispatch(removeModal(key))}
                  />
                )
              })}
              {/* {state.modal} */}
              <Cabinet
                page={page}
                setPageId={setPageId}
                menuCfg={menuCfg(
                  [...pages, ...pagesCourses],
                  pagesGroups,
                  loggedUser
                )}
                loggedUser={loggedUser}
                onSignOut={signOut}
                modals={modals}
                state={state}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="flex flex-col items-center justify-center p-10 bg-gray-400 rounded-2xl w-92">
                {loggedUser?.email && (
                  <div>Вы авторизировались как {loggedUser.email}</div>
                )}
                <div>У Вас нет доступа к панели администратора</div>
                <Button
                  name="Авторизироваться под другой учетной записью"
                  className="mt-4"
                  onClick={() => signIn('google')}
                  small
                />
              </div>
            </div>
          )}
        </>
      }
    </>
  )
}

/* Retrieves pet(s) data from mongodb database */
// export async function getServerSideProps() {
// await dbConnect()

// let result = await Types.find({})
// const types = result.map((doc) => {
//   const type = doc.toObject()
//   type._id = type._id.toString()
//   return type
// })

// result = await Sets.find({})
// const sets = result.map((doc) => {
//   const set = doc.toObject()
//   set._id = set._id.toString()
//   return set
// })

// /* find all the data in our database */
// result = await Balloons.find({})
// const balloons = result.map((doc) => {
//   const baloon = doc.toObject()
//   baloon._id = baloon._id.toString()
//   return baloon
// })

// return { props: { balloons: balloons, types: types, sets: sets } }
// return { props: { db_uri: process.env.MONGODB_URI } }
// }

// export async function getInitialProps() {
//   await dbConnect()
//   let result = await Products.find({})
//   const orders = result.map((doc) => {
//     const order = doc.toObject()
//     order._id = order._id.toString()
//     return order
//   })
//   console.log(`orders`, orders)
//   return { props: {} }
// }
