import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SvgWave from 'svg/SvgWave'
import SvgLogin from 'svg/SvgLogin'
import SvgAvatar from 'svg/SvgAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPassport, faUser } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'
import emailValidator from '@helpers/emailValidator'
import SvgEmailConfirm from 'svg/SvgEmailConfirm'
import SvgMailBox from 'svg/SvgMailBox'
import { postData } from '@helpers/CRUD'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.js'
import passwordValidator from '@helpers/passwordValidator'

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
  error = false,
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
            error
              ? 'text-red-600'
              : focused || value
              ? 'text-general'
              : 'text-gray-400'
          )}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="relative h-11">
          <h5
            className={cn(
              'absolute top-1/2 left-3 -translate-y-1/2 text-lg duration-300',
              { 'text-sm -top-0.5': focused || value },
              error
                ? focused
                  ? 'text-red-600'
                  : 'text-red-400'
                : focused || value
                ? 'text-general'
                : 'text-gray-400'
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
        <div
          className={cn(
            'duration-400 w-full h-full',
            error ? 'bg-red-400' : 'bg-gray-300'
          )}
        />
        <div
          className={cn(
            'absolute h-full duration-400',
            error ? 'bg-red-600' : 'bg-general',
            focused || value ? 'w-full' : 'w-0'
          )}
        />
      </div>
    </div>
  )
}

const fullConfig = resolveConfig(tailwindConfig)
const generalColor = fullConfig.theme.colors.general

const Login = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { courseId, lectureId } = router.query
  const [isRegistrationProcess, setIsRegistrationProcess] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [errors, setErrors] = useState({})
  const [needToCheckMail, setNeedToCheckMail] = useState(false)

  const clearErrors = () => {
    if (Object.keys(errors).length > 0) setErrors({})
  }

  const updateErrors = (key, error) => {
    if (errors[key] !== error) setErrors({ ...errors, [key]: error })
  }

  console.log('errors', errors)
  console.log('session', session)

  useEffect(() => {
    if (!session && status !== 'loading') {
      // signIn('google')
    } else if (status === 'authenticated') {
      if (courseId && lectureId) router.push(`/course/${courseId}/${lectureId}`)
      else router.push(`/courses`)
    }
  }, [!!session, status])

  console.log('generalColor', generalColor)

  return (
    <div className="box-border w-screen h-screen overflow-hidden">
      {/* <Wave /> */}
      {/* <Image src="/public/img/login/wave.svg" width={174} height={84} /> */}
      <SvgWave
        color={generalColor}
        className="fixed top-0 left-0 hidden w-auto h-full laptop:block -z-10"
      />
      <div className="grid w-full h-full grid-cols-1 px-2 bg-transparent laptop:grid-cols-2 gap-7">
        <div className="items-center hidden text-center laptop:flex">
          <SvgLogin color={generalColor} className="w-124" />
        </div>
        <div className="flex items-center justify-center text-center laptop:justify-start">
          <form className="w-90">
            <div className="flex justify-center w-full">
              <SvgAvatar color={generalColor} className="w-24" />
            </div>
            <h2 className="my-4 text-4xl text-gray-900 uppercase">
              Добро пожаловать
            </h2>
            <div className="h-8 overflow-hidden text-2xl text-gray-800">
              <p
                className={cn('duration-300', {
                  'opacity-0 -mt-8': !isRegistrationProcess,
                })}
              >
                Регистрация
              </p>
              <p
                className={cn('duration-300', {
                  'opacity-0 mt-8': isRegistrationProcess,
                })}
              >
                Авторизация
              </p>
            </div>
            {needToCheckMail ? (
              <div className="flex flex-col items-center mt-6">
                <SvgMailBox color={generalColor} className="w-60" />
                <p className="mt-4">
                  Проверьте почту!
                  <br />
                  Вам было отправлено письмо для завершения регистрации
                </p>
              </div>
            ) : (
              <>
                <Input
                  className="mt-0"
                  type="text"
                  name="E-Mail"
                  icon={faUser}
                  onChange={(event) => {
                    updateErrors('email', null)
                    setEmail(event.target.value)
                  }}
                  value={email}
                  error={errors.email}
                />
                <Input
                  className="mb-2"
                  type="password"
                  name="Пароль"
                  icon={faLock}
                  onChange={(event) => {
                    updateErrors('password', null)
                    setPassword(event.target.value)
                  }}
                  value={password}
                  error={errors.password}
                />
                <Input
                  className="mb-2"
                  type="password"
                  name="Повтор пароля"
                  icon={faLock}
                  onChange={(event) => {
                    updateErrors('password', null)
                    setPasswordRepeat(event.target.value)
                  }}
                  value={passwordRepeat}
                  hidden={!isRegistrationProcess}
                  error={errors.password}
                />
                <div className="flex justify-between">
                  <a
                    onClick={() => {
                      clearErrors()
                      setIsRegistrationProcess((state) => !state)
                    }}
                    className="block text-sm text-right duration-300 cursor-pointer hover:text-general"
                  >
                    {isRegistrationProcess ? 'Авторизация' : 'Регистрация'}
                  </a>
                  <a className="block text-sm text-right duration-300 cursor-pointer hover:text-general">
                    Забыли пароль?
                  </a>
                </div>
                {Object.values(errors).length > 0 && (
                  <ul className="mt-4 ml-5 text-left text-red-600 list-disc">
                    {Object.values(errors).map(
                      (error, index) =>
                        error && <li key={'error' + index}>{error}</li>
                    )}
                  </ul>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    const newErrors = {}

                    if (email === '') {
                      newErrors.email = 'Укажите Email'
                    } else if (!emailValidator(email)) {
                      newErrors.email = 'Email указан не верно'
                    }

                    if (password === '') {
                      newErrors.password = 'Введите пароль'
                    } else if (isRegistrationProcess) {
                      if (!passwordValidator(password)) {
                        newErrors.password =
                          'Пароль должен содержать строчные и заглавные буквы, а также минимум одну цифру'
                      } else if (password !== passwordRepeat) {
                        newErrors.password = 'Пароли не совпадают'
                      }
                    }

                    if (Object.keys(newErrors).length > 0) {
                      return setErrors(newErrors)
                    } else {
                      clearErrors()
                    }

                    if (isRegistrationProcess) {
                      // Если это регистрация
                      postData(
                        `/api/emailconfirm`,
                        { email, password },
                        (res) => {
                          if (res.error === 'User already registered') {
                            console.log('!!!')
                            setErrors({
                              email:
                                'Пользователь с таким Email уже зарегистрирован',
                            })
                            setPassword('')
                            setPasswordRepeat('')
                          } else {
                            console.log('!!!!!!!')
                            setNeedToCheckMail(true)
                          }
                        }
                      )
                    } else {
                      // Если это авторизация
                      signIn('credentials', {
                        redirect: false,
                        username: email.toLowerCase(),
                        password,
                      }).then((res) => {
                        if (res.error === 'CredentialsSignin') {
                          setPassword('')
                          setErrors({ password: 'Логин или пароль не верны' })
                        }
                      })
                    }
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
                  className="flex items-center w-full h-12 px-4 text-lg text-black duration-300 bg-white border-2 border-gray-500 outline-none group hover:border-general rounded-3xl"
                >
                  <img
                    className="group-hover:animate-spin"
                    src="/img/google.png"
                  />
                  <span className="flex-1">Google</span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
