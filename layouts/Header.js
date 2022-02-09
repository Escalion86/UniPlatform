import Divider from '@components/Divider'
import Link from 'next/link'

const Header = ({ user, course }) => {
  return (
    <div
      className="flex items-center h-16 px-3 text-white bg-black"
      style={{ gridArea: 'header' }}
    >
      <img src="/img/UniPlatform.png" alt="balloon" width={40} height={40} />
      <div className="flex flex-1">
        <Divider type="vertical" />
        <Link href={`/course/${course._id}/general`}>
          <a className="hover:text-gray-300">
            <h1>{course.title}</h1>
          </a>
        </Link>
      </div>
      <div className="">
        <img
          // onClick={() => closeMenu()}
          className="border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9"
          src={
            user?.image ??
            `/img/users/${user?.gender ? user.gender : 'male'}.jpg`
          }
          alt="Avatar"
        />
      </div>
    </div>
  )
}

export default Header
