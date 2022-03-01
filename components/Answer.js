import { useState, useEffect } from 'react'

import cn from 'classnames'
import { MODES, TASK_ICON_STATUSES } from '@helpers/constants'
import ComboBox from './ComboBox'
import { putData } from '@helpers/CRUD'
import { LoadingSpinner } from '.'

const Answer = ({ answer, mode, refreshPage }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState(answer.status)

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

        {mode === MODES.STUDENT && (
          <span className="italic">
            {TASK_ICON_STATUSES[answer.status].name}
          </span>
        )}
        {mode === MODES.TEACHER && (
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
              })
              // setTaskDescription(description)
              refreshPage()
            }}
            disabled={isUpdating}
          />
        )}
        {isUpdating && <LoadingSpinner size="xxs" />}
      </div>
    </div>
  )
}

export default Answer
