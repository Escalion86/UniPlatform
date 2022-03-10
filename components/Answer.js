import { useState, useEffect } from 'react'

import cn from 'classnames'
import { MODES, TASK_ICON_STATUSES } from '@helpers/constants'
import ComboBox from './ComboBox'
import { putData } from '@helpers/CRUD'
import { LoadingSpinner } from '.'
import EditableTextarea from './EditableTextarea'
import Button from './Button'

const Answer = ({ answer, mode, refreshPage, user }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState(answer.status)
  const [commentEdit, setCommentEdit] = useState(false)

  const saveAnswerComment = async (teacherComment) => {
    await putData(`/api/answers/${answer._id}`, {
      teacherComment,
      teacherId: user._id,
    })
    setCommentEdit(false)
    refreshPage()
  }

  const isUserATeacher =
    mode === MODES.TEACHER &&
    (!answer.teacherId || answer.teacher._id === user._id)

  useEffect(() => {
    if (status !== answer.status) setStatus(answer.status)
    setIsUpdating(false)
  }, [answer.status])
  return (
    <div
      className={cn(
        'px-2 py-1 ml-2  bg-gray-200 border-l-4',
        TASK_ICON_STATUSES[answer.status].border
      )}
    >
      <div>
        <span className="font-bold">
          {mode === MODES.STUDENT
            ? 'Мой ответ'
            : `Ответ студента${
                answer.user?.name ? ' ' + answer.user.name : ''
              }`}
          :
        </span>
        <div
          dangerouslySetInnerHTML={{
            __html: answer.answer,
          }}
        />
      </div>
      <div className="flex items-center gap-x-2">
        <span className="font-bold">Статус:</span>

        {isUserATeacher ? (
          <ComboBox
            items={[
              { value: 'sended', name: 'Отправлен на проверку' },
              { value: 'confirmed', name: 'Принят' },
              { value: 'declined', name: 'Отклонен' },
            ]}
            onChange={async (status) => {
              setIsUpdating(true)
              setStatus(status)
              await putData(`/api/answers/${answer._id}`, {
                status,
                teacherId: user._id,
              })
              // setTaskDescription(description)
              refreshPage()
            }}
            disabled={isUpdating}
          />
        ) : (
          <span className="italic">
            {TASK_ICON_STATUSES[answer.status].name}
          </span>
        )}
        {isUpdating && <LoadingSpinner size="xxs" />}
      </div>
      <EditableTextarea
        className="outline-none"
        title={
          answer.teacherComment && answer.teacher?.name
            ? `Комментарий преподавателя ${answer.teacher.name}:`
            : null
        }
        // innerRef={this.contentEditable}
        html={answer.teacherComment} // innerHTML of the editable div
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
        onSave={saveAnswerComment}
        btnSaveName="Сохранить комментарий"
        readonly={!commentEdit}
        placeholder="Комментарий...."
        disableUndo
        // tagName='article' // Use a custom HTML tag (uses a div by default)
      />
      {!commentEdit && isUserATeacher && (
        <Button
          name={
            answer.teacherComment
              ? 'Редактировать комментарий'
              : 'Оставить комментарий'
          }
          onClick={() => setCommentEdit(true)}
        />
      )}
    </div>
  )
}

export default Answer
