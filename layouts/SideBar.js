import { useEffect, useState } from 'react'
import {
  faAngleUp,
  faBug,
  faCheck,
  faEye,
  faEyeSlash,
  faPlus,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import {
  faCalendar,
  faCalendarAlt,
  faCalendarCheck,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteData, postData, putData } from '@helpers/CRUD'
import { CheckBox } from '@components/index'
import Link from 'next/link'
import { motion } from 'framer-motion'
import cn from 'classnames'
import { MODES, TASK_ICON_STATUSES } from '@helpers/constants'
import {
  lectureStatusByTasksStatusesArray,
  tasksStatuses,
} from '@helpers/status'
import { LoadingSpinner } from '@components/index'

import { DragDropContext, Droppable, Draggable } from '@react-forked/dnd'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { atom } from 'recoil'
import { toast } from 'react-toastify'

const dragingAtom = atom({
  key: 'draging', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
})

const onDragEnd = async (
  result,
  state,
  setState,
  apiDirName,
  callbackOnSuccess,
  callbackOnError
) => {
  const { destination, source } = result

  if (
    destination &&
    destination.droppableId === source.droppableId &&
    source.index !== destination.index
  ) {
    const newState = []

    for (let i = 0; i < state.length; i++) {
      if (state[i].index === source.index) {
        newState.push({
          ...state[i],
          index: destination.index,
        })
      } else if (destination.index < source.index) {
        if (
          state[i].index >= destination.index &&
          state[i].index < source.index
        ) {
          newState.push({
            ...state[i],
            index: state[i].index + 1,
          })
        } else {
          newState.push(state[i])
        }
      } else {
        if (
          state[i].index <= destination.index &&
          state[i].index > source.index
        ) {
          newState.push({
            ...state[i],
            index: state[i].index - 1,
          })
        } else {
          newState.push(state[i])
        }
      }
    }
    const itemsToChangeIndex = []
    for (let i = 0; i < newState.length; i++) {
      if (state[i].index !== newState[i].index) {
        itemsToChangeIndex.push({
          id: newState[i]._id,
          newIndex: newState[i].index,
        })
      }
    }

    setState(newState)

    if (apiDirName) {
      try {
        for (let i = 0; i < itemsToChangeIndex.length; i++) {
          const res = await putData(
            `/api/${apiDirName}/${itemsToChangeIndex[i].id}`,
            {
              index: itemsToChangeIndex[i].newIndex,
            }
          )
          if (!res) {
            callbackOnError && callbackOnError()
            setState(state)
            return
          }
        }
      } catch (e) {
        callbackOnError && callbackOnError()
        setState(state)
        return
      }
      callbackOnSuccess && callbackOnSuccess()
    }
  }
}

const Lecture = ({
  courseId,
  lecture,
  tasks,
  answers,
  mode,
  chapter,
  userViewedLecturesIds,
  activeLectureId,
  refreshPage,
}) => {
  const dragging = useRecoilValue(dragingAtom)
  const [isProcessUpdateVisible, setIsProcessUpdateVisible] = useState(false)
  const tasksOfLecture = tasks.filter((task) => task.lectureId === lecture._id)
  const lectureHaveTasks = !!tasksOfLecture.length
  const tasksOfLectureIds = lectureHaveTasks
    ? tasksOfLecture.map((task) => task._id)
    : []

  const tasksStatusesArray = tasksStatuses(tasksOfLecture, answers)
  const status =
    mode === MODES.STUDENT
      ? lectureStatusByTasksStatusesArray(tasksStatusesArray)
      : null

  const deleteLecture = async () => {
    await deleteData(`/api/lectures/${lecture._id}`)
    refreshPage()
  }

  const updateLecture = async (props) => {
    await putData(`/api/lectures/${lecture._id}`, props, () => {
      // setIsProcessUpdateVisible(false)
      refreshPage()
    })
  }

  const toggleVisible = async () => {
    setIsProcessUpdateVisible(true)
    await updateLecture({ visible: !lecture.visible })
  }

  useEffect(() => setIsProcessUpdateVisible(false), [lecture.visible])

  const tasksWithStatusSendedCount = tasksStatusesArray.filter(
    (status) => status === 'sended'
  ).length

  return (
    <div>
      <Draggable
        draggableId={lecture._id}
        index={lecture.index}
        type={'LECTURE_OF_CHAPTER_' + chapter.index}
        isDragDisabled={false}
        // shouldRespectForceTouch={false}
      >
        {(providedLecture, snapshot) => (
          <div
            ref={providedLecture.innerRef}
            {...providedLecture.draggableProps}
            {...providedLecture.dragHandleProps}
          >
            <Link
              key={'lecture' + lecture.index}
              href={`/course/${courseId}/${lecture._id}`}
            >
              <a
                // onClick={() => setClicked(true)}
                // animate={clicked ? { backgroundColor: 'green' } : {}}
                className={cn(
                  'px-4 py-2 flex gap-x-3 duration-300 items-center transition-colors cursor-pointer',
                  { 'bg-gray-300': activeLectureId === lecture._id },
                  { 'hover:bg-gray-400': !dragging }
                )}
              >
                {mode === MODES.STUDENT && (
                  <CheckBox
                    checked={userViewedLecturesIds.includes(lecture._id)}
                  />
                )}
                {mode === MODES.ADMIN &&
                  (isProcessUpdateVisible ? (
                    <div
                      className={'w-7 h-7 flex items-center rounded-full -mx-1'}
                    >
                      <LoadingSpinner size="xs" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'w-7 h-7 flex items-center rounded-full p-1 -mx-1 border-opacity-0 hover:border-opacity-100 border hover:scale-125 duration-300',
                        lecture.visible ? 'text-success' : 'text-danger',
                        lecture.visible ? 'border-success' : 'border-danger'
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleVisible()
                      }}
                    >
                      <FontAwesomeIcon
                        icon={lecture.visible ? faEye : faEyeSlash}
                      />
                    </div>
                  ))}
                <span className="flex-1">{`${lecture.index + 1}. ${
                  lecture.title
                }`}</span>
                {mode === MODES.TEACHER && (
                  <div
                    className={cn(
                      'flex p-1 justify-center items-center -ml-1.5 border-2 rounded-full min-w-6 h-6 w-6',
                      // TASK_ICON_STATUSES['sended'].color,
                      tasksWithStatusSendedCount === 0
                        ? 'border-success text-success'
                        : cn(
                            TASK_ICON_STATUSES['sended'].border,
                            TASK_ICON_STATUSES['sended'].color
                          )
                    )}
                  >
                    {tasksWithStatusSendedCount > 0 ? (
                      tasksWithStatusSendedCount > 99 ? (
                        '>99'
                      ) : (
                        tasksWithStatusSendedCount
                      )
                    ) : (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </div>
                )}
                {mode !== MODES.TEACHER && lectureHaveTasks && (
                  <div
                    className={cn('relative flex items-center justify-center', {
                      'text-secondary': status === 'sended',
                      'text-success': status === 'confirmed',
                      'text-danger': status === 'declined',
                    })}
                    style={{ width: 20 }}
                  >
                    <div
                      className="absolute text-xs font-bold"
                      style={{ top: 4 }}
                    >
                      {tasksOfLectureIds.length}
                    </div>
                    <FontAwesomeIcon className="-mt-0.5" icon={faCalendar} />
                  </div>
                )}
                {mode === MODES.ADMIN && (
                  <div
                    className={
                      ' border-transparent border hover:border-danger p-1.5 -ml-1 -my-1 -mr-2 rounded-full relative duration-300 hover:scale-125 flex items-center w-8 h-8 justify-center text-danger'
                    }
                    style={{ width: 20 }}
                    onClick={(e) => {
                      e.preventDefault()
                      deleteLecture()
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                )}
              </a>
            </Link>
          </div>
        )}
      </Draggable>
    </div>
  )
}

const Lectures = ({
  activeLectureId,
  lectures,
  tasks,
  answers,
  userViewedLecturesIds,
  mode,
  refreshPage,
  chapter,
}) => {
  const [lecturesState, setLecturesState] = useState(lectures)
  const [dragging, setDragging] = useRecoilState(dragingAtom)

  // useEffect(() => {
  //   // setLecturesState(lectures)
  //   if (chapter.index === 0) console.log(lectures)
  // }, [lectures])

  // useEffect(() => {
  //   if (chapter.index === 0) console.log('lecturesState', lecturesState)
  // }, [lecturesState])

  const courseId = chapter.courseId

  const droppableType = 'LECTURE_OF_CHAPTER_' + chapter.index

  return (
    <div className="w-full">
      <DragDropContext
        onDragEnd={(result) => {
          setDragging(null)
          onDragEnd(
            result,
            lecturesState,
            setLecturesState,
            'lectures',
            () => toast.success('Лекция перемещена'),
            () => toast.error('Ошибка перемещения лекции')
          )
        }}
        onDragStart={(res) => setDragging(res.type)}
      >
        <Droppable droppableId="lectures" type={droppableType}>
          {(providedLecture) => (
            <div
              ref={providedLecture.innerRef}
              {...providedLecture.droppableProps}
              className={cn('duration-500', {
                'bg-green-200': dragging === droppableType,
              })}
            >
              {lecturesState
                .sort((a, b) => (a.index < b.index ? -1 : 1))
                .map((lecture) => (
                  <Lecture
                    key={lecture._id}
                    courseId={courseId}
                    lecture={lecture}
                    tasks={tasks}
                    answers={answers}
                    mode={mode}
                    chapter={chapter}
                    userViewedLecturesIds={userViewedLecturesIds}
                    activeLectureId={activeLectureId}
                    refreshPage={refreshPage}
                  />
                ))}
              {providedLecture.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {mode === MODES.ADMIN && (
        <div
          className={
            'flex duration-300 gap-x-2 hover:bg-gray-200 cursor-pointer items-center justify-center border rounded-lg'
          }
          onClick={(e) => {
            e.preventDefault()
            postData(
              `/api/lectures`,
              { chapterId: chapter._id, index: lecturesState.length },
              (newLecture) => {
                refreshPage(newLecture._id)
              }
            )
          }}
        >
          <div className="w-4">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="whitespace-nowrap">Добавить лекцию</div>
        </div>
      )}
    </div>
  )
}

const Chapter = ({
  chapter,
  lectures,
  tasks,
  answers,
  mode,
  deleteChapter,
  refreshPage,
  userViewedLecturesIds,
  activeLectureId,
  activeChapterId,
}) => {
  const [opened, setOpened] = useState(chapter._id === activeChapterId)
  const dragging = useRecoilValue(dragingAtom)

  const chapterLectures = lectures.filter(
    (lecture) =>
      lecture.chapterId === chapter._id &&
      (mode === MODES.ADMIN || lecture.visible)
  )
  // .sort((a, b) => (a.index < b.index ? -1 : 1))

  if (chapterLectures.length === 0 && mode !== MODES.ADMIN) return <div></div>

  return (
    <Draggable draggableId={chapter._id} index={chapter.index} type="CHAPTER">
      {(providedChapter, snapshot) => (
        <div ref={providedChapter.innerRef} {...providedChapter.draggableProps}>
          <div
            onClick={() => setOpened((state) => !state)}
            className={cn(
              'flex items-center px-4 py-3 cursor-pointer',
              activeChapterId === chapter._id ? 'bg-gray-300' : 'bg-gray-200',
              { 'hover:bg-gray-400': !dragging }
            )}
            style={{ borderTop: '1px solid #d1d7dc' }}
            {...providedChapter.dragHandleProps}
          >
            <div className="flex-1">
              <div className="font-bold">{`Раздел ${chapter.index + 1}${
                chapter.title ? `: ${chapter.title}` : ''
              }`}</div>
              <div className="text-sm">{chapterLectures.length} лекции</div>
            </div>
            <motion.div animate={{ rotate: opened ? -180 : 0 }} className="w-3">
              <FontAwesomeIcon icon={faAngleUp} />
            </motion.div>
            {mode === MODES.ADMIN && (
              <div
                className={
                  'border-transparent border hover:border-danger p-1.5 -my-1 -mr-2 ml-2 rounded-full relative duration-300 hover:scale-125 flex items-center w-8 h-8 justify-center text-danger'
                }
                style={{ width: 20 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  deleteChapter(chapter._id)
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            )}
          </div>
          <motion.ul
            animate={{ height: opened ? 'auto' : 0 }}
            initial={{ height: 0 }}
            className="flex flex-col overflow-clip"
          >
            <Lectures
              lectures={chapterLectures}
              tasks={tasks}
              answers={answers}
              chapter={chapter}
              activeLectureId={activeLectureId}
              userViewedLecturesIds={userViewedLecturesIds}
              mode={mode}
              refreshPage={refreshPage}
            />
          </motion.ul>
        </div>
      )}
    </Draggable>
  )
}

const Chapters = ({
  courseId,
  activeLectureId,
  activeChapterId,
  chapters,
  lectures,
  tasks,
  answers,
  userViewedLecturesIds,
  mode = MODES.STUDENT,
  refreshPage,
  goToCurseGeneralPage,
  setLoading,
}) => {
  const [chaptersState, setChaptersState] = useState(chapters)
  const [dragging, setDragging] = useRecoilState(dragingAtom)

  const deleteChapter = async (id) => {
    setLoading(true)
    await deleteData(`/api/chapters/${id}`)
    if (id === activeChapterId) {
      if (chapters.length <= 1) {
        goToCurseGeneralPage()
      } else {
        const existingChapter = chapters.find((chapter) => chapter._id !== id)
        const existingLecture = lectures.find(
          (lecture) => existingChapter._id === lecture.chapterId
        )
        if (existingLecture) refreshPage(existingLecture._id)
        else goToCurseGeneralPage()
      }
    } else {
      refreshPage()
    }
  }

  // useEffect(() => {
  //   setChaptersState(chapters)
  // }, [chapters])

  // const filteredChapters = chapters.filter((chapter) => {
  //   const chapterLectures = lectures.filter(
  //     (lecture) =>
  //       lecture.chapterId === chapter._id &&
  //       (mode === MODES.ADMIN || lecture.visible)
  //   )
  //   return chapterLectures.length > 0
  // })

  // const chaptersLectures = {}

  // chapters
  //   .sort((a, b) => (a.index < b.index ? -1 : 1))
  //   .forEach((chapter) => {
  //     chaptersLectures[chapter._id] = []
  //     lectures.forEach((lecture) => {
  //       if (
  //         lecture.chapterId === chapter._id &&
  //         (mode === MODES.ADMIN || lecture.visible)
  //       ) {
  //         chaptersLectures[chapter._id].push(lecture)
  //       }
  //     })
  //   })

  return (
    <>
      <DragDropContext
        onDragEnd={async (result) => {
          setDragging(null)
          onDragEnd(
            result,
            chaptersState,
            setChaptersState,
            'chapters',
            () => toast.success('Глава перемещена'),
            () => toast.error('Ошибка перемещения главы')
          )
        }}
        // onDragEnd(
        //   result,
        //   chaptersState,
        //   setChaptersState,
        //   'chapters',

        //   () => {
        //     const notify = toast('глава перемещена')
        //   }
        //   // refreshPage
        // )

        onDragStart={(res) => setDragging(res.type)}
      >
        <Droppable droppableId="chapters" type="CHAPTER">
          {(providedChapter, snapshot) => (
            <div
              ref={providedChapter.innerRef}
              {...providedChapter.droppableProps}
            >
              {chaptersState
                .sort((a, b) => (a.index < b.index ? -1 : 1))
                .map((chapter) => (
                  <Chapter
                    key={chapter._id}
                    chapter={chapter}
                    lectures={lectures}
                    tasks={tasks}
                    answers={answers}
                    mode={mode}
                    refreshPage={refreshPage}
                    userViewedLecturesIds={userViewedLecturesIds}
                    activeLectureId={activeLectureId}
                    activeChapterId={activeChapterId}
                    deleteChapter={deleteChapter}
                  />
                ))}
              {providedChapter.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {mode === MODES.ADMIN && (
        <div
          className={
            'flex h-12 duration-300 gap-x-2 bg-gray-200 hover:bg-gray-400 cursor-pointer items-center justify-center border rounded-lg'
          }
          onClick={(e) => {
            e.preventDefault()
            setLoading(true)
            postData(
              `/api/chapters`,
              { courseId, index: chaptersState.length },
              ({ chapter, lecture }) => {
                refreshPage(lecture._id)
              }
            )
          }}
        >
          <div className="w-4">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="font-bold whitespace-nowrap">Добавить раздел</div>
        </div>
      )}
    </>
  )
}

const SideBar = ({
  isSideOpen,
  setIsSideOpen,
  course,
  chapters,
  lectures,
  tasks,
  answers,
  activeLecture,
  activeChapter,
  userViewedLecturesIds,
  mode = MODES.VIEWER,
  refreshPage,
  goToCourseGeneralPage,
  setLoading,
}) => {
  const [winReady, setwinReady] = useState(false)
  useEffect(() => {
    setwinReady(true)
  }, [])
  return (
    <motion.div
      animate={
        isSideOpen ? { width: mode === MODES.ADMIN ? 350 : 300 } : { width: 0 }
      }
      className="flex justify-end h-full max-h-full overflow-y-auto bg-bg"
      style={{ gridArea: 'sidebar' }}
    >
      <div
        className="w-full border-gray-300 border-r-1"
        style={{ minWidth: 300 }}
      >
        <div className="flex items-center px-4 py-2">
          <div className="flex-1 font-bold">Оглавление</div>
          <button
            onClick={() => setIsSideOpen(false)}
            className="p-2 cursor-pointer w-7"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {winReady ? (
          <Chapters
            courseId={course._id}
            chapters={chapters}
            lectures={lectures}
            tasks={tasks}
            answers={answers}
            activeLectureId={activeLecture?._id}
            activeChapterId={activeChapter?._id}
            userViewedLecturesIds={userViewedLecturesIds}
            mode={mode}
            refreshPage={refreshPage}
            goToCourseGeneralPage={goToCourseGeneralPage}
            setLoading={setLoading}
          />
        ) : null}
      </div>
    </motion.div>
  )
}

export default SideBar

// export const getServerSideProps = async (context) => {
//   resetServerContext()
//   return {
//     props: {},
//   }
// }
