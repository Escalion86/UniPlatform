import Divider from '@components/Divider'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const Header = ({ user, title = '', titleLink = '/' }) => {
  return (
    <div
      className="flex items-center h-16 px-3 text-white bg-black"
      style={{ gridArea: 'header' }}
    >
      <Link href="/">
        <a>
          <img
            src="/img/UniPlatform.png"
            alt="balloon"
            width={40}
            height={40}
          />
        </a>
      </Link>
      <div className="flex flex-1">
        <Divider type="vertical" />
        <Link href={titleLink}>
          <a className="hover:text-gray-300">
            <h1>{title}</h1>
          </a>
        </Link>
      </div>
      {user ? (
        // <div>
        //   <img
        //     // onClick={() => closeMenu()}
        //     className="border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9"
        //     src={
        //       user?.image ??
        //       `/img/users/${user?.gender ? user.gender : 'male'}.jpg`
        //     }
        //     alt="Avatar"
        //   />
        // </div>
        <div className="z-10 flex items-start justify-end h-full px-2">
          <div className="relative flex flex-col items-end group mt-2.5">
            <img
              // onClick={() => closeMenu()}
              className="border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9"
              src={
                user?.image ??
                `/img/users/${user?.gender ? user.gender : 'male'}.jpg`
              }
              alt="Avatar"
            />
            <div className="h-0 overflow-hidden duration-300 scale-0 translate-x-1/2 -translate-y-1/2 group-hover:h-auto group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-100 top-12">
              <Link href="/courses">
                <a>
                  <div className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white">
                    Мои курсы
                  </div>
                </a>
              </Link>

              <div
                onClick={signOut}
                className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white"
              >
                Выйти из учетной записи
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Link href="/login">
            <a className="hover:text-gray-300">Авторизоваться</a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
