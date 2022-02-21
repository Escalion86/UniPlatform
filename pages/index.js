// import dbConnect from '@utils/dbConnect'

import { faSmile, faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fetchingCourses } from '@helpers/fetchers'
import ContentWrapper from '@layouts/content/ContentWrapper'
import CourseWrapper from '@layouts/content/CourseWrapper'
import Header from '@layouts/Header'
import cn from 'classnames'
import { getSession, signOut } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

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

const MenuItem = ({ text, href = '#' }) => (
  <li>
    <a href={href} className="cursor-pointer hover:text-gray-600">
      {text}
    </a>
  </li>
)

const Section = ({ id }) => <section id={id} className="relative -top-24" />

const BlockContainer = ({ id, className, children }) => (
  <div
    className={cn(
      'flex flex-col items-start px-10 py-20 min-h-100 tablet:px-20 gap-y-4 tablet:gap-y-6',
      className
    )}
  >
    {id && <Section id={id} />}
    {children}
  </div>
)

const H1 = ({ className, style, children }) => (
  <h1
    className={cn('text-4xl font-bold text-center tablet:text-5xl', className)}
    style={style}
  >
    {children}
  </h1>
)

const H2 = ({ className, style, children }) => (
  <h2
    className={cn('text-xl font-bold text-center tablet:text-2xl', className)}
    style={style}
  >
    {children}
  </h2>
)

const H3 = ({ className, style, children }) => (
  <h3
    className={cn('text-3xl font-bold text-center tablet:text-4xl', className)}
    style={style}
  >
    {children}
  </h3>
)

const H4 = ({ className, style, children }) => (
  <h4
    className={cn('text-2xl font-bold text-center tablet:text-3xl', className)}
    style={style}
  >
    {children}
  </h4>
)

const P = ({ className, style, children }) => (
  <p className={cn('text-lg laptop:text-xl', className)} style={style}>
    {children}
  </p>
)

const CardBenefits = ({ icon, title, children }) => (
  <div className="flex flex-col items-center gap-y-2">
    <FontAwesomeIcon icon={icon} size="6x" />
    <div className="flex items-center laptop:h-16">
      <H4>{title}</H4>
    </div>
    {children}
  </div>
)

const Button = ({ title, className, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-40 px-2 py-1 duration-300 bg-purple-700 border border-purple-200 rounded-md tablet:w-auto hover:text-purple-700 hover:bg-purple-200 hover:border-purple-700',
      className
    )}
  >
    {title}
  </button>
)

export default function Home(props) {
  const { courses, user } = props

  const router = useRouter()
  // const { height, width } = useWindowDimensions()
  // const { data: session, status } = useSession()
  // const loading = status === 'loading'

  // if (session) console.log(`session`, session)
  console.log('courses', courses)
  console.log('user', user)
  return (
    <>
      <Head>
        <title>UniPlatform</title>
      </Head>
      {/* <CourseWrapper>
        <Header user={user} title="Uniplatform" />
        <ContentWrapper>
          {courses.map((course) => {
            return (
              <Link key={course._id} href={`/course/${course._id}`}>
                <a className="px-2 py-1 text-left border-b border-gray-300 cursor-pointer hover:bg-gray-400">
                  {course.title}
                </a>
              </Link>
            )
          })}
        </ContentWrapper>
      </CourseWrapper> */}
      <div className="w-full bg-white">
        <div className="fixed top-0 flex flex-col items-center justify-between w-full h-24 shadow-md">
          <Header user={user} />
          <ul className="flex items-center justify-center w-full h-8 text-lg duration-300 bg-white gap-x-4 opacity-80 hover:opacity-100">
            <MenuItem text="О нас" href="#about" />
            <MenuItem text="Преимущества" href="#benefits" />
            <MenuItem text="Тарифы" href="#tarifs" />
            <MenuItem text="Контакты" href="#contacts" />
          </ul>
        </div>
        <div
          className="flex flex-col items-center justify-center h-screen px-10 text-white tablet:px-20 gap-y-4"
          style={{
            backgroundImage: `url("/img/bg1.jpg")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top 48px right',
            backgroundSize: 'cover',
          }}
        >
          <H1
            style={{ textShadow: '1px 1px 2px black' }}
            // style={{ fontSize: '6vw', lineHeight: '5vw' }}
          >
            Платформа для создания курсов
          </H1>
          <H2 className="font-thin" style={{ textShadow: '1px 1px 2px black' }}>
            Уроки, задания, проверка заданий и отчетность, все это и многое
            другое
          </H2>
          {!user ?? (
            <Button
              className="mt-8"
              title="Зарегистрироваться и создать свой курс"
              onClick={() => router.push('./login')}
            />
          )}
        </div>
        <BlockContainer id="about" className="bg-white">
          <div className="grid gap-4 tablet:gap-6 laptop:grid-cols-2">
            <div className="flex flex-col items-start gap-y-4 tablet:gap-y-6">
              <H3>О нас</H3>
              <P>
                Мы новая компания, которая предоставляет всем желающим создать
                свой собственный курс и удобно организовать его для своих
                клиентов. Наши приоритеты - это качество и быстрая обратная
                связь. Мы находимся в постоянном контакте с нашими клиентами и
                стремимся делать продукт лучше
              </P>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-8">
              <img
                className="object-cover w-full h-full aspect-1"
                src="/img/other/1.jpg"
                alt="some stuff"
              />
              <img
                className="object-cover w-full h-full aspect-1"
                src="/img/other/2.jpg"
                alt="some stuff"
              />
              <img
                className="object-cover w-full h-full aspect-1"
                src="/img/other/3.jpg"
                alt="some stuff"
              />
              <img
                className="object-cover w-full h-full aspect-1"
                src="/img/other/4.jpg"
                alt="some stuff"
              />
            </div>
          </div>
        </BlockContainer>
        <BlockContainer id="benefits" className="bg-gray-200">
          <H3>Наши преимущества</H3>
          <div className="grid laptop:grid-cols-3 gap-x-6">
            <CardBenefits icon={faSmile} title="Создание курсов - это Легко">
              <div className="flex flex-col items-start w-full">
                <P>Структура максимально проста:</P>
                <div className="text-lg laptop:text-xl">
                  <ul className="list-decimal">
                    <li>Создаете описание курса</li>
                    <li>Добавляем лекции</li>
                    <li>По необходимости добавляем задания</li>
                    <li>ГОТОВО!</li>
                  </ul>
                </div>
              </div>
            </CardBenefits>
            <CardBenefits icon={faThumbsUp} title="Доступность">
              <P>
                Наши услуги стоят от 0 руб! Крайне доступные цены (подробнее
                тарифы)
              </P>
            </CardBenefits>
            <CardBenefits icon={faThumbsUp} title="Обратная связь">
              <P>
                Оперативно отвечаем на Ваши вопросы и вносим улучшения для
                максимального комфорта как преподавателей, так и учеников
              </P>
            </CardBenefits>
          </div>
        </BlockContainer>
        <BlockContainer className="text-white bg-black">
          <H3>Есть знания, но не знаете как ими поделиться?</H3>
          <P>
            Просто зарегистрируйтесь в системе и начните заполнять курс своими
            знаниями. Не беспокойтесь если у Вас в голове "каша", система
            позволит менять местами блоки и структурировать Ваши знания
          </P>
        </BlockContainer>
        <BlockContainer id="tarifs" className="bg-gray-200">
          <H3>Тарифы</H3>
        </BlockContainer>
        <BlockContainer id="contacts" className="bg-gray-200">
          <H3>Контакты</H3>
        </BlockContainer>
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })
  console.log('session', session)
  try {
    const courses = await fetchingCourses(null, process.env.NEXTAUTH_SITE)
    console.log('courses', courses)
    return {
      props: {
        courses,
        user: session?.user ? session.user : null,
      },
    }
  } catch {
    return {
      props: {
        courses: null,
        user: session?.user ? session.user : null,
      },
      // notFound: true,
    }
  }
}
