import { useState } from 'react'
import {
  faAngleUp,
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
import { deleteData, postData } from '@helpers/CRUD'
import { CheckBox } from '@components/index'
import Link from 'next/link'
import { motion } from 'framer-motion'
import cn from 'classnames'

const Lectures = ({
  courseId,
  activeLectureId,
  lectures,
  tasks,
  answers,
  userViewedLecturesIds,
  editMode,
  refreshPage,
  chapter,
}) => {
  return (
    <div className="w-full">
      {lectures.map((lecture) => {
        const tasksOfLecture = tasks.filter(
          (task) => task.lectureId === lecture._id
        )
        const lectureHaveTasks = !!tasksOfLecture.length
        const tasksOfLectureIds = lectureHaveTasks
          ? tasksOfLecture.map((task) => task._id)
          : []
        const answersOfLecture = lectureHaveTasks
          ? answers.filter((answer) =>
              tasksOfLectureIds.includes(answer.taskId)
            )
          : []
        // const confirmedTasks = tasksOfLecture.filter((task) =>
        //   answersOfLecture.find(
        //     (answer) => answer.taskId === task._id && answer.status === 'confirmed'
        //   )
        // )

        const tasksStatusesArray = tasksOfLecture.map((task) => {
          if (
            answersOfLecture.find(
              (answer) =>
                answer.taskId === task._id && answer.status === 'confirmed'
            )
          )
            return 'confirmed'
          if (
            answersOfLecture.find(
              (answer) =>
                answer.taskId === task._id && answer.status === 'sended'
            )
          )
            return 'sended'
          if (
            answersOfLecture.find(
              (answer) =>
                answer.taskId === task._id && answer.status === 'declined'
            )
          )
            return 'declined'
        })

        const deleteLecture = async (id) => {
          await deleteData(`/api/lectures/${id}`)
          refreshPage()
        }

        return (
          // <div key={'lecture' + lecture.index} className="block">
          <Link
            key={'lecture' + lecture.index}
            href={`/course/${courseId}/${lecture._id}`}
          >
            <a
              // onClick={() => setClicked(true)}
              // animate={clicked ? { backgroundColor: 'green' } : {}}
              className={cn(
                'px-4 py-2 flex gap-x-3 duration-300 items-center transition-colors cursor-pointer hover:bg-gray-400',
                { 'bg-gray-300': activeLectureId === lecture._id }
              )}
            >
              <CheckBox checked={userViewedLecturesIds.includes(lecture._id)} />
              <span className="flex-1">{`${lecture.index + 1}. ${
                lecture.title
              }`}</span>
              {lectureHaveTasks && (
                <div
                  className={cn('relative flex items-center justify-center', {
                    'text-secondary':
                      !editMode &&
                      lectureHaveTasks &&
                      tasksStatusesArray.includes('sended') &&
                      !tasksStatusesArray.includes('declined'),
                    'text-success':
                      !editMode &&
                      lectureHaveTasks &&
                      tasksStatusesArray.every(
                        (status) => status === 'confirmed'
                      ),
                    'text-danger':
                      !editMode &&
                      lectureHaveTasks &&
                      tasksStatusesArray.includes('declined'),
                  })}
                  style={{ width: 20 }}
                >
                  <div
                    className="absolute text-xs font-bold"
                    style={{ top: 5 }}
                  >
                    {tasksOfLectureIds.length}
                  </div>
                  <FontAwesomeIcon icon={faCalendar} />
                </div>
              )}
              {editMode && (
                <div
                  className={
                    ' border-transparent border hover:border-danger p-1.5 -ml-1 -my-1 -mr-2 rounded-full relative duration-300 hover:scale-125 flex items-center w-8 h-8 justify-center text-danger'
                  }
                  style={{ width: 20 }}
                  onClick={(e) => {
                    e.preventDefault()
                    deleteLecture(lecture._id)
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              )}
            </a>
          </Link>
          // </div>
        )
      })}
      {editMode && (
        <div
          className={
            'flex duration-300 gap-x-2 hover:bg-gray-200 cursor-pointer items-center justify-center border rounded-lg'
          }
          onClick={(e) => {
            e.preventDefault()
            postData(
              `/api/lectures`,
              { chapterId: chapter._id, index: lectures.length },
              (newLecture) => {
                refreshPage(newLecture._id)
              }
            )
          }}
        >
          <div className="w-4">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="whitespace-nowrap">???????????????? ????????????</div>
        </div>
      )}
    </div>
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
  editMode = false,
  refreshPage,
  goToCurseGeneralPage,
  setLoading,
}) => {
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

  return (
    <>
      {chapters
        .sort((a, b) => a.index < b.index)
        .map((chapter) => {
          const [opened, setOpened] = useState(false)

          const chapterLectures = lectures
            .filter((lecture) => lecture.chapterId === chapter._id)
            .sort((a, b) => a.index < b.index)

          return (
            <div key={'chapter' + chapter.index}>
              <div
                onClick={() => setOpened((state) => !state)}
                className={cn(
                  'flex items-center p-4 cursor-pointer hover:bg-gray-400',
                  activeChapterId === chapter._id
                    ? 'bg-gray-300'
                    : 'bg-gray-200'
                )}
                style={{ borderTop: '1px solid #d1d7dc' }}
              >
                <div className="flex-1">
                  <div className="font-bold">{`???????????? ${chapter.index + 1}: ${
                    chapter.title
                  }`}</div>
                  <div className="text-sm">{chapterLectures.length} ????????????</div>
                </div>
                <motion.div
                  animate={{ rotate: opened ? -180 : 0 }}
                  className="w-3"
                >
                  <FontAwesomeIcon icon={faAngleUp} />
                </motion.div>
                {editMode && (
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
                className="flex flex-col overflow-y-hidden"
              >
                <Lectures
                  lectures={chapterLectures}
                  tasks={tasks}
                  answers={answers}
                  courseId={courseId}
                  chapter={chapter}
                  activeLectureId={activeLectureId}
                  userViewedLecturesIds={userViewedLecturesIds}
                  editMode={editMode}
                  refreshPage={refreshPage}
                />
              </motion.ul>
            </div>
          )
        })}
      {editMode && (
        <div
          className={
            'flex h-12 duration-300 gap-x-2 bg-gray-200 hover:bg-gray-400 cursor-pointer items-center justify-center border rounded-lg'
          }
          onClick={(e) => {
            e.preventDefault()
            setLoading(true)
            postData(
              `/api/chapters`,
              { courseId, index: chapters.length },
              ({ chapter, lecture }) => {
                refreshPage(lecture._id)
              }
            )
          }}
        >
          <div className="w-4">
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="font-bold whitespace-nowrap">???????????????? ????????????</div>
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
  editMode,
  refreshPage,
  goToCourseGeneralPage,
  setLoading,
}) => {
  return (
    <motion.div
      animate={isSideOpen ? { width: 300 } : { width: 0 }}
      className="flex justify-end overflow-y-auto bg-bg"
      style={{ gridArea: 'sidebar' }}
    >
      <div
        className="overflow-y-auto border-gray-300 border-r-1"
        style={{ minWidth: 300 }}
      >
        <div className="flex items-center px-4 py-2">
          <div className="flex-1 font-bold">????????????????????</div>
          <button
            onClick={() => setIsSideOpen(false)}
            className="p-2 cursor-pointer w-7"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <Chapters
          courseId={course._id}
          chapters={chapters}
          lectures={lectures}
          tasks={tasks}
          answers={answers}
          activeLectureId={activeLecture?._id}
          activeChapterId={activeChapter?._id}
          userViewedLecturesIds={userViewedLecturesIds}
          editMode={editMode}
          refreshPage={refreshPage}
          goToCourseGeneralPage={goToCourseGeneralPage}
          setLoading={setLoading}
        />
      </div>
    </motion.div>
  )
}

export default SideBar
