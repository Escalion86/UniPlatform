import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SvgWave from 'svg/SvgWave'
import SvgLogin from 'svg/SvgLogin'
import SvgAvatar from 'svg/SvgAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPassport, faUser } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'

// import UndrawGraduation from 'public/img/login/undraw_graduation.svg'
// import Image from 'next/image'

const Input = ({
  className = '',
  name,
  icon,
  type = 'text',
  onChange,
  value,
  hidden,
}) => {
  const [focused, setFocused] = useState(false)
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <div
      className={cn(
        'my-3 py-3 duration-300 overflow-hidden max-h-15',
        className,
        {
          'max-h-0 my-0 py-0': hidden,
        }
      )}
    >
      <div className={'grid'} style={{ gridTemplateColumns: '7% 93%' }}>
        <div
          className={cn(
            'relative w-4 flex justify-center duration-300 items-center mx-auto',
            focused || value ? 'text-general' : 'text-gray-400'
          )}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="relative h-11">
          <h5
            className={cn(
              'absolute top-1/2 left-3 -translate-y-1/2 text-lg duration-300',
              { 'text-sm -top-0.5': focused || value },
              focused || value ? 'text-general' : 'text-gray-400'
            )}
          >
            {name}
          </h5>
          <input
            className="absolute w-full h-full top-0 left-0 border-none outline-none bg-transparent py-0.5 px-1 text-lg text-gray-600"
            type={type}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="relative h-0.5 flex justify-center">
        <div className="w-full h-full bg-gray-300" />
        <div
          className={cn(
            'absolute h-full bg-general duration-400',
            focused || value ? 'w-full' : 'w-0'
          )}
        />
      </div>
    </div>
  )
}

const Login = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { courseId, lectureId } = router.query
  const [isRegistrationProcess, setIsRegistrationProcess] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [error, setError] = useState(null)

  console.log('email', email)
  console.log('password', password)
  console.log('passwordRepeat', passwordRepeat)

  useEffect(() => {
    if (!session && status !== 'loading') {
      // signIn('google')
    } else if (status === 'authenticated') {
      if (courseId && lectureId) router.push(`/course/${courseId}/${lectureId}`)
      else router.push(`/`)
    }
  }, [!!session, status])

  return (
    <div className="box-border w-screen h-screen overflow-hidden">
      {/* <Wave /> */}
      {/* <Image src="/public/img/login/wave.svg" width={174} height={84} /> */}
      <SvgWave className="fixed top-0 left-0 hidden w-auto h-full laptop:block -z-10" />
      <div className="grid w-full h-full grid-cols-1 px-2 bg-transparent laptop:grid-cols-2 gap-7">
        <div className="items-center hidden text-center laptop:flex">
          <SvgLogin className="w-124" />
        </div>
        <div className="flex items-center justify-center text-center laptop:justify-start">
          <form className="w-90">
            <div className="flex justify-center w-full">
              <SvgAvatar className="w-24" />
            </div>
            <h2 className="my-4 text-4xl text-gray-900 uppercase">
              Добро пожаловать
            </h2>
            <div className="h-8 overflow-hidden text-gray-800">
              <p
                className={cn('text-xl duration-300', {
                  'opacity-0 -mt-8': !isRegistrationProcess,
                })}
              >
                Регистрация
              </p>
              <p
                className={cn('text-xl duration-300', {
                  'opacity-0 mt-8': isRegistrationProcess,
                })}
              >
                Авторизация
              </p>
            </div>
            <Input
              className="mt-0"
              type="text"
              name="E-Mail"
              icon={faUser}
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
            <Input
              className="mb-2"
              type="text"
              name="Пароль"
              icon={faLock}
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
            <Input
              className="mb-2"
              type="text"
              name="Повтор пароля"
              icon={faLock}
              onChange={(event) => setPasswordRepeat(event.target.value)}
              value={passwordRepeat}
              hidden={!isRegistrationProcess}
            />
            <div className="flex justify-between">
              <a
                onClick={() => setIsRegistrationProcess((state) => !state)}
                className="block text-sm text-right duration-300 cursor-pointer hover:text-general"
              >
                {isRegistrationProcess ? 'Авторизация' : 'Регистрация'}
              </a>
              <a className="block text-sm text-right duration-300 cursor-pointer hover:text-general">
                Забыли пароль?
              </a>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                if (isRegistrationProcess && password !== passwordConfirm) {
                  return setError('Пароли не совпадают')
                }
                signIn('credentials', {
                  redirect: false,
                  username: email,
                  password,
                })
              }}
              // style={{
              //   backgroundImage:
              //     'linear-gradient(to right, #32be8f, #38d39f, #32be8f)',
              // }}
              className="block w-full h-12 mt-4 text-white uppercase duration-300 bg-gray-500 border-0 outline-none hover:bg-general rounded-3xl"
            >
              {isRegistrationProcess
                ? 'Зарегистрироваться'
                : 'Авторизироваться'}
            </button>
            <div className="my-5 text-lg text-gray-700">Или</div>
            <button
              onClick={(e) => {
                e.preventDefault()
                signIn('google')
              }}
              // style={{
              //   backgroundImage:
              //     'linear-gradient(to right, #32be8f, #38d39f, #32be8f)',
              // }}
              className="flex items-center w-full h-12 px-4 text-lg text-black duration-300 border-2 border-gray-500 outline-none hover:border-general rounded-3xl"
            >
              <img src="/img/google.png" />
              <span className="flex-1">Google</span>
            </button>
          </form>
        </div>
      </div>
      {/* <div className="grid w-full h-full grid-cols-2 px-2 bg-transparent gap-7">
        <div style={{ fill: 'red' }}> */}
      {/* <img
            src="/img/login/undraw_graduation.svg"
            className="bg-transparent"
          /> */}
      {/* <UndrawGraduation /> */}
      {/* </div>
      </div> */}

      {/* <div>{status === 'authenticated' ? 'Авторизован' : 'Не авторизован'}</div> */}
    </div>
  )
}

export default Login
