import { useState } from 'react'
import {
  faAngleUp,
  faCheck,
  faCheckCircle,
  faCircle,
  faClock,
  faTimes,
  faTimesCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '.'
import Answer from './Answer'
import EditableText from './EditableText'
import EditableTextarea from './EditableTextarea'

import { MODES, TASK_ICON_STATUSES } from '@helpers/constants'
import { postData, deleteData, putData } from '@helpers/CRUD'

import cn from 'classnames'

const Task = ({
  task,
  user,
  answers,
  mode = MODES.STUDENT,
  refreshPage,
  userCourseAccess = MODES.STUDENT,
}) => {
  const [opened, setOpened] = useState(false)
  const [newAnswer, setNewAnswer] = useState(false)
  const [taskTitle, setTaskTitle] = useState(task.title)
  const [taskDescription, setTaskDescription] = useState(task.description)
  const [isAddNewAnswerProcess, setIsAddNewAnswerProcess] = useState(false)
  const [isDeleteProcess, setIsDeleteProcess] = useState(false)

  const sendNewAnswer = async (answer) => {
    setIsAddNewAnswerProcess(true)
    await postData(`/api/answers`, {
      taskId: task._id,
      userId: user._id,
      answer,
      status: 'sended',
    })
    setNewAnswer(false)

    refreshPage()
    setIsAddNewAnswerProcess(false)
  }

  // const saveTask = async () => {
  //   setIsSaveProcess(true)
  //   await putData(`/api/tasks/${task._id}`, {
  //     title: taskTitle,
  //     description: taskDescription,
  //   })

  //   refreshPage()
  //   setIsSaveProcess(false)
  // }

  const deleteTask = async () => {
    setIsDeleteProcess(true)
    await deleteData(`/api/tasks/${task._id}`)

    refreshPage()
  }

  const answersOfTask = answers.filter((answer) => {
    if (answer.taskId !== task._id) return false
    if (mode === MODES.STUDENT) return answer.user._id === user._id
    return true
  })

  const answersOfTaskStatuses = answersOfTask.map((answer) => answer.status)
  const taskStatus =
    answersOfTaskStatuses.length === 0
      ? 'none'
      : answersOfTaskStatuses.includes('sended')
      ? 'sended'
      : answersOfTaskStatuses.every((status) => status === 'confirmed')
      ? 'confirmed'
      : !answersOfTaskStatuses.includes('sended') &&
        answersOfTaskStatuses.includes('declined')
      ? 'declined'
      : 'none'

  const answersWithStatusSendedCount = answersOfTaskStatuses.filter(
    (status) => status === 'sended'
  ).length

  return (
    <div
      className={cn(
        'px-2 py-1 bg-gray-200 border-l-4'
        // , {
        //   'border-secondary': taskStatus === 'sended',
        //   'border-success': taskStatus === 'confirmed',
        //   'border-danger': taskStatus === 'declined',
        //   'border-gray-400': taskStatus === 'none',
        // }
      )}
    >
      {isDeleteProcess ? (
        <div className="flex items-center gap-2 font-bold">
          <span className="whitespace-nowrap">Задание №{task.index + 1}:</span>
          <span className="text-red-700 whitespace-nowrap">Удаление...</span>
          <LoadingSpinner size="xs" />
        </div>
      ) : (
        <>
          <div
            className="flex items-center justify-between h-8 cursor-pointer"
            onClick={() => {
              if (mode !== MODES.ADMIN) setOpened((state) => !state)
            }}
          >
            <div className="flex items-center flex-1 font-bold">
              {mode === MODES.TEACHER && (
                <div
                  className={cn(
                    'flex p-1 justify-center items-center -ml-1.5 mr-2 border-2 rounded-full min-w-8 h-8 w-8',
                    // TASK_ICON_STATUSES['sended'].color,
                    answersWithStatusSendedCount === 0
                      ? 'border-success text-success'
                      : cn(
                          TASK_ICON_STATUSES['sended'].border,
                          TASK_ICON_STATUSES['sended'].color
                        )
                  )}
                >
                  {answersWithStatusSendedCount > 0 ? (
                    answersWithStatusSendedCount > 99 ? (
                      '>99'
                    ) : (
                      answersWithStatusSendedCount
                    )
                  ) : (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                </div>
              )}
              {mode === MODES.STUDENT && (
                <div>
                  <div
                    className={cn(
                      'flex items-center w-6 h-6 justify-center mr-2',
                      TASK_ICON_STATUSES[taskStatus].color
                    )}
                  >
                    <FontAwesomeIcon
                      icon={TASK_ICON_STATUSES[taskStatus].icon}
                    />
                  </div>
                </div>
              )}
              <span className="whitespace-nowrap">
                Задание №{task.index + 1}
                {task.title ? ':' : ''}
              </span>
              <EditableText
                textClass="font-bold"
                style={{ lineHeight: 1.7 }}
                value={task.title}
                // onChange={(title) => setTaskTitle(title)}
                onSave={async (title) => {
                  await putData(`/api/tasks/${task._id}`, {
                    title,
                  })
                  // setTaskDescription(description)
                  refreshPage()
                }}
                readonly={mode !== MODES.ADMIN}
                // mode={mode}
                placeholder="Заголовок (можно оставить пустым)"
              />
            </div>

            <div
              className="flex items-center justify-center w-6"
              onClick={() => {
                if (mode === MODES.ADMIN) setOpened((state) => !state)
              }}
            >
              <motion.div
                animate={{ rotate: opened ? -180 : 0 }}
                className="w-3"
              >
                <FontAwesomeIcon icon={faAngleUp} />
              </motion.div>
            </div>
            {mode === MODES.ADMIN && (
              <div
                className={
                  'border-transparent border hover:border-danger p-1 -mr-1 ml-1 rounded-full relative duration-300 hover:scale-125 flex items-center w-7 h-7 justify-center text-danger'
                }
                style={{ width: 20 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  deleteTask()
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            )}
          </div>
          <motion.div
            animate={{ height: opened ? 'auto' : 0 }}
            initial={{ height: 0 }}
            className="overflow-y-hidden"
          >
            <EditableTextarea
              // className="bg-white border-b border-purple-600 outline-none"
              // innerRef={this.contentEditable}
              html={task.description}
              onSave={async (description) => {
                await putData(`/api/tasks/${task._id}`, {
                  description,
                })
                // setTaskDescription(description)
                refreshPage()
              }}
              placeholder="Описание задания..."
              // onChange={(e) => setTaskDescription(e.target.value)}
              // onBlur={() => {
              //   if (isOpenedCourse) {
              //     saveCourse({ description: description.current })
              //   } else {
              //     saveLecture({ description: description.current })
              //   }
              // }}
              readonly={mode !== MODES.ADMIN}
            />
            {/* <div className="flex justify-between py-1">
          {!isSaveProcess && !isDeleteProcess && (
            <>
              <Button
                onClick={deleteTask}
                className="bg-red-700"
                name="Удалить задание"
              />
              <Button
                onClick={saveTask}
                className="bg-blue-700"
                name="Сохранить задание"
              />
            </>
          )}
          {isSaveProcess && (
            <div className="flex items-center gap-2">
              <span>Сохранение...</span>
              <LoadingSpinner size="xs" />
            </div>
          )}
          {isDeleteProcess && (
            <div className="flex items-center gap-2">
              <span>Удаление...</span>
              <LoadingSpinner size="xs" />
            </div>
          )}
        </div> */}
            {/* {task.description} */}
            {/* <Divider /> */}

            {answersOfTask.length > 0 && (
              <div className="flex flex-col gap-y-3">
                {answersOfTask.map((answer) => (
                  <Answer
                    key={answer._id}
                    answer={answer}
                    mode={mode}
                    refreshPage={refreshPage}
                  />
                ))}
              </div>
            )}
            {mode === MODES.STUDENT &&
              !newAnswer &&
              (taskStatus === 'declined' || taskStatus === 'none') && (
                <button
                  onClick={() => setNewAnswer(true)}
                  className={cn(
                    'w-56 h-10 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                  )}
                >
                  Ответить на задание
                </button>
              )}
            {mode === MODES.STUDENT && newAnswer && (
              <>
                <EditableTextarea
                  className="outline-none"
                  // innerRef={this.contentEditable}
                  // html={null} // innerHTML of the editable div
                  disabled={false} // use true to disable editing
                  // onChange={(e) => setNewAnswer(e.target.value)} // handle innerHTML change
                  // html={description.current}
                  // onBlur={() => {
                  //   if (isOpenedCourse) {
                  //     saveCourse({ description: description.current })
                  //   } else {
                  //     saveLecture({ description: description.current })
                  //   }
                  // }}
                  onSave={sendNewAnswer}
                  btnSaveName="Отправить ответ"
                  readonly={false}
                  placeholder="Ответ..."
                  disableUndo
                  // tagName='article' // Use a custom HTML tag (uses a div by default)
                />
                {/* <div className="flex justify-end w-full pt-2 pb-1">
                  <button
                    onClick={sendNewAnswer}
                    className={cn(
                      'w-56 h-10 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                    )}
                  >
                    Отправить ответ
                  </button>
                </div> */}
              </>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}

export default Task
