import Divider from '@components/Divider'
import { useState } from 'react'
import ContentEditable from 'react-contenteditable'
import cn from 'classnames'
import { EditText } from 'react-edit-text'

const CourseContent = ({
  course,
  activeChapter,
  activeLecture,
  setEditMode,
  editMode,
  userCourseAccess,
  isSideOpen,
  setIsSideOpen,
  refreshPage,
}) => {
  const [newCourseState, setNewCourseState] = useState(course)

  const updateNewCourse = (data) =>
    setNewCourseState({ ...newCourseState, ...data })

  const handleChangeCourse = (evt) => {
    console.log(evt.target.value)
  }

  const saveContent = async () => {
    await putData(`/api/courses/${newCourseState._id}`, newCourseState)
    refreshPage()
  }

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            'flex justify-between',
            {
              'absolute top-0 left-0 z-10 w-full h-full group':
                course?.videoUrl,
            },
            {
              'h-0 w-full': userCourseAccess !== 'admin' && isSideOpen,
            }
          )}
        >
          <div
            className={cn(
              'overflow-hidden duration-200 h-auto',
              isSideOpen
                ? 'w-0'
                : course?.videoUrl
                ? 'w-0 group-hover:w-56'
                : 'w-56'
            )}
          >
            <button
              onClick={() => setIsSideOpen(true)}
              className={cn(
                'w-56 h-12 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
              )}
            >
              Оглавление
            </button>
          </div>
          <div className="flex">
            {userCourseAccess === 'admin' && (
              <div
                className={cn(
                  'duration-200 overflow-hidden ',
                  editMode
                    ? 'w-0'
                    : course?.videoUrl
                    ? 'w-0 group-hover:w-80'
                    : 'w-80'
                )}
              >
                <button
                  onClick={() => {
                    setNewCourseState(course)
                    setEditMode(true)
                  }}
                  className={cn(
                    'w-80 h-12 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                  )}
                >
                  Переключить в режим редактирования
                </button>
              </div>
            )}
            <div
              className={cn('duration-200 overflow-hidden w-0', {
                'w-40': editMode,
              })}
            >
              <button
                onClick={() => {
                  saveContent()
                  setEditMode((state) => !state)
                }}
                className={cn(
                  'w-40 h-12 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                )}
              >
                Сохранить
              </button>
            </div>
            <div
              className={cn('duration-200 overflow-hidden w-0', {
                'w-40': editMode,
              })}
            >
              <button
                onClick={() => setEditMode((state) => !state)}
                className={cn(
                  'w-40 h-12 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                )}
              >
                Не сохранять
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'z-0 w-full duration-300 pointer-events-none',
            course?.videoUrl ? 'aspect-w-16 aspect-h-9' : 'h-0'
          )}
        >
          {course?.videoUrl && (
            <ReactPlayer
              width="100%"
              height="100%"
              url={course?.videoUrl}
              config={{
                youtube: {
                  playerVars: {
                    controls: 1,
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                    disablekb: 1,
                  },
                },
                // facebook: {
                //   appId: '12345',
                // },
              }}
              onDuration={(duration) => console.log('duration', duration)}
            />
          )}
        </div>
      </div>

      <div className="px-2">
        {editMode && (
          <div className="flex mt-2 gap-x-1 flex-nowrap">
            <span className="whitespace-nowrap">Ссылка на видео: </span>
            <EditText
              style={{
                width: '100%',
                margin: 0,
                padding: '2px 4px',
              }}
              value={
                editMode
                  ? newCourseState.videoUrl ?? ''
                  : course?.videoUrl ?? ''
              }
              // inline
              onChange={(videoUrl) => {
                updateNewCourse({ videoUrl })
              }}
              readonly={!editMode}
            />
          </div>
        )}
        <h2 className="flex py-2 text-2xl font-bold flex-nowrap gap-x-1">
          <EditText
            style={{
              width: '100%',
              whiteSpace: 'normal',
              margin: 0,
              padding: '0 4px',
              fontWeight: 'bold',
            }}
            value={editMode ? newCourseState.title ?? '' : course?.title ?? ''}
            // inline
            onChange={(title) => updateNewCourse({ title })}
            readonly={!editMode}
          />
        </h2>
        <Divider light />
        {/* <div className="text-base">{activeLecture.description}</div> */}
        <ContentEditable
          disabled={!editMode}
          // innerRef={this.contentEditable}
          html={course?.description} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onChange={handleChangeCourse} // handle innerHTML change
          // tagName='article' // Use a custom HTML tag (uses a div by default)
        />
      </div>
    </>
  )
}

export default CourseContent
