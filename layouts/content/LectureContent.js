import Divider from '@components/Divider'
import { useEffect, useRef, useState } from 'react'

import cn from 'classnames'
import { deleteData, postData, putData } from '@helpers/CRUD'
import { deleteImage, sendVideo, deleteVideo } from '@helpers/cloudinary'
import LoadingSpinner from '@components/LoadingSpinner'

import VideoPlayer from '@components/VideoPlayer'
import fileSizeValidator from '@helpers/fileSizeValidator'
import EditableTextarea from '@components/EditableTextarea'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MODES } from '@helpers/constants'
import EditableText from '@components/EditableText'
import Task from '@components/Task'
import InputImage from '@components/InputImage'
import Button from '@components/Button'
import Link from 'next/link'
import ButtonLink from '@components/ButtonLink'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { modalsAtom, modalsFuncAtom } from '@state/atoms'
import { addScaleCorrection } from 'framer-motion'

const LectureContent = ({
  course,
  activeChapter = false,
  activeLecture = false,
  tasks = [],
  answers = [],
  setMode,
  mode,
  userCourseAccess,
  user,
  isSideOpen,
  setIsSideOpen,
  refreshPage,
}) => {
  const [modals, setModals] = useRecoilState(modalsAtom)
  const [modalsFunc, setModalsFunc] = useRecoilState(modalsFuncAtom)

  const isOpenedCourse = !activeLecture
  const videoUrl = isOpenedCourse ? course?.videoUrl : activeLecture?.videoUrl

  // const [newCourseState, setNewCourseState] = useState(course)
  // const [newChapterState, setNewChapterState] = useState(activeChapter)
  // const [newLectureState, setNewLectureState] = useState(activeLecture)
  // const description = useRef(
  //   isOpenedCourse ? course.description : activeLecture.description
  // )
  const [isVideoSending, setIsVideoSending] = useState(false)

  const hiddenFileInput = useRef(null)

  // useEffect(() => {
  //   setNewChapterState(activeChapter)
  //   setNewLectureState(activeLecture)
  // }, [activeLecture, activeChapter])

  // const updateNewCourse = (data) => {
  //   setNewCourseState({ ...newCourseState, ...data })
  // }

  // const updateNewChapter = (data) => {
  //   setNewChapterState({ ...newChapterState, ...data })
  // }

  // const updateNewLecture = (data) => {
  //   setNewLectureState({ ...newLectureState, ...data })
  // }

  // const handleChangeDescription = (evt) => {
  //   description.current = evt.target.value
  // }

  const saveChapter = async (params) => {
    await putData(`/api/chapters/${activeChapter._id}`, params)
    refreshPage()
  }

  const saveLecture = async (params) => {
    await putData(`/api/lectures/${activeLecture._id}`, params)
    refreshPage()
  }

  const saveCourse = async (params) => {
    await putData(`/api/courses/${course._id}`, params)
    refreshPage()
  }

  const selectVideoClick = (event) => {
    hiddenFileInput.current.click()
  }

  const deleteVideoFunc = async () => {
    if (isOpenedCourse && course.videoUrl) {
      const res = await deleteVideo(
        `obnimisharik_courses_dev/courses/${course._id}/video`,
        'video'
      )
      if (res.status === 200) saveCourse({ videoUrl: '' })
    }
    if (!isOpenedCourse && activeLecture.videoUrl) {
      const res = await deleteVideo(
        `obnimisharik_courses_dev/lectures/${activeLecture._id}/video`,
        'video'
      )
      if (res.status === 200) saveLecture({ videoUrl: '' })
    }
  }

  const onChangeVideo = async (newFile) => {
    if (newFile) {
      if (fileSizeValidator(newFile)) {
        setIsVideoSending(true)
        await deleteVideoFunc()
        sendVideo(
          newFile,
          (videoUrl) => {
            if (isOpenedCourse) {
              saveCourse({ videoUrl })
            } else {
              saveLecture({ videoUrl })
            }
            setIsVideoSending(false)
            // refreshPage()
          },
          activeLecture ? 'lectures' : 'courses',
          `${activeLecture ? activeLecture._id : course._id}/video`
        )
      } else {
        alert('Файл не может превышать 100Мб')
      }
    }
  }

  return (
    <div className="pb-5">
      <div className="relative group">
        <div
          className={cn(
            'flex justify-between',
            {
              'absolute top-0 left-0 z-10 w-full': videoUrl,
            },
            {
              'h-0 w-full': isSideOpen,
            }
          )}
        >
          <div className="sticky top-0 flex justify-between w-full">
            <div
              className={cn(
                'overflow-hidden duration-200 h-auto',
                isSideOpen ? 'w-0' : videoUrl ? 'w-0 group-hover:w-56' : 'w-56'
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
            {/* <div className="flex">
              {userCourseAccess === 'admin' && (
                <div
                  className={cn(
                    'duration-200 overflow-hidden ',
                    videoUrl ? 'w-0 group-hover:w-80' : 'w-80'
                  )}
                >
                  <button
                    onClick={() => {
                      if (mode !== MODES.ADMIN) {
                        setNewLectureState(activeLecture)
                        setNewChapterState(activeChapter)
                        setMode(MODES.ADMIN)
                      } else {
                        setMode(MODES.STUDENT)
                      }
                    }}
                    className={cn(
                      'w-80 h-12 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                    )}
                  >
                    {mode === MODES.ADMIN
                      ? 'Выйти из режима редактирования'
                      : 'Переключить в режим редактирования'}
                  </button>
                </div>
              )} */}
            {/* <div
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
            </div> */}
            {/* </div> */}
          </div>
        </div>

        <div
          className={cn(
            'z-0 w-full duration-300',
            videoUrl ? 'aspect-w-16 aspect-h-9' : 'h-0'
          )}
        >
          {videoUrl && <VideoPlayer src={videoUrl} />}
        </div>
      </div>
      <div className="flex flex-col px-2 tablet:px-12 desktop:w-5/6 laptop:px-20">
        {mode === MODES.ADMIN && (
          <div className="mt-2">
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={(e) => onChangeVideo(e.target.files[0])}
              style={{ display: 'none' }}
              accept="video/mp4,video/x-m4v,video/*"
              // accept="image/jpeg,image/png"
            />
            {isVideoSending ? (
              <div className="flex items-center gap-2">
                <span>
                  Пожалуйста не закрывайте окно браузера. Загружается видео...
                </span>
                <LoadingSpinner size="xs" />
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <button
                  className="px-2 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-400"
                  onClick={selectVideoClick}
                >
                  {videoUrl ? 'Загрузить другое видео' : 'Загрузить видео'}
                </button>
                {videoUrl && (
                  <button
                    className="px-2 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-400"
                    onClick={deleteVideoFunc}
                  >
                    Удалить видео
                  </button>
                )}
                <div className="text-sm text-gray-500">
                  Видео не может превышать 100Мб
                </div>
              </div>
            )}
            {isOpenedCourse && (
              <InputImage
                onChange={async (image) => {
                  if (image) {
                    await saveCourse({ image })
                  }
                }}
                onDelete={async () => {
                  await saveCourse({ image: '' })
                  refreshPage()
                }}
                label="Иконка курса"
                directory="courses"
                image={course.image}
                imageName={`${course._id}/image`}
              />
            )}
          </div>
        )}

        {/* {editMode && (
          <div className="flex mt-2 gap-x-1 flex-nowrap">
            <span className="whitespace-nowrap">Ссылка на видео: </span>
            <EditText
              className={cn(
                'w-full px-1 py-0 m-0 border-b outline-none',
                editMode ? 'border-purple-600' : 'border-transparent'
              )}
              // style={{
              //   width: '100%',
              //   margin: 0,
              //   padding: '2px 4px',
              // }}
              value={
                editMode
                  ? isOpenedCourse
                    ? newCourseState.videoUrl
                    : newLectureState.videoUrl ?? ''
                  : videoUrl ?? ''
              }
              // inline
              onChange={(videoUrl) => {
                updateNewLecture({ videoUrl })
              }}
              onSave={({ value }) => saveLecture({ videoUrl: value })}
              readonly={!editMode}
            />
          </div>
        )} */}
        <h2 className="flex py-2 text-2xl font-bold flex-nowrap gap-x-1">
          <span className="whitespace-nowrap">
            {isOpenedCourse
              ? `Курс: `
              : `Раздел №${activeChapter?.index + 1}${
                  isOpenedCourse
                    ? course.title
                    : activeChapter?.title || mode === MODES.ADMIN
                    ? ': '
                    : ''
                }`}
          </span>
          <EditableText
            textClass="font-bold"
            value={isOpenedCourse ? course.title : activeChapter?.title ?? ''}
            // onChange={(title) => {
            //   if (isOpenedCourse) {
            //     updateNewCourse({ title })
            //   } else {
            //     updateNewChapter({ title })
            //   }
            // }}
            onSave={(value) => {
              if (isOpenedCourse) {
                saveCourse({ title: value })
              } else {
                saveChapter({ title: value })
              }
            }}
            readonly={mode !== MODES.ADMIN}
            placeholder={
              isOpenedCourse ? 'Название курса... ' : 'Название раздела...'
            }
            uncontrolled
          />
        </h2>
        {/* <h3 className="py-2 text-xl font-bold">
              Лекция №{activeLecture.index + 1} - {activeLecture.title}
            </h3> */}
        {!isOpenedCourse && (
          <div
            className="flex py-2 text-xl font-bold flex-nowrap gap-x-1"
            // style={{ whiteSpace: 'nowrap' }}
          >
            <span className="whitespace-nowrap">
              Лекция №{activeLecture?.index + 1}
              {activeLecture?.title || mode === MODES.ADMIN ? ': ' : ''}
            </span>
            <EditableText
              textClass="font-bold"
              value={activeLecture?.title ?? ''}
              // onChange={(title) => {
              //   updateNewLecture({ title })
              // }}
              onSave={(title) => {
                saveLecture({ title })
              }}
              readonly={mode !== MODES.ADMIN}
              placeholder="Название лекции..."
              mode={mode}
              uncontrolled
            />
            {/* <EditText
              className={cn(
                'w-full px-1 py-0 m-0 font-bold whitespace-normal border-b outline-none',
                mode === MODES.ADMIN
                  ? 'border-purple-600 bg-white'
                  : 'border-transparent'
              )}
              value={
                mode === MODES.ADMIN
                  ? newLectureState?.title ?? ''
                  : activeLecture?.title ?? ''
              }
              // inline
              onChange={(title) => {
                updateNewLecture({ title })
              }}
              onSave={({ value }) => saveLecture({ title: value })}
              readonly={mode !== MODES.ADMIN}
            /> */}
          </div>
        )}
        <Divider light />
        {/* <div className="text-base">{activeLecture.description}</div> */}
        {mode === MODES.ADMIN ? (
          <>
            <EditableTextarea
              className="border-b border-purple-600 outline-none"
              // innerRef={this.contentEditable}
              html={
                isOpenedCourse ? course.description : activeLecture.description
              } // innerHTML of the editable div
              disabled={false} // use true to disable editing
              // onChange={handleChangeDescription} // handle innerHTML change
              // html={description.current}
              // onBlur={() => {
              //   if (isOpenedCourse) {
              //     saveCourse({ description: description.current })
              //   } else {
              //     saveLecture({ description: description.current })
              //   }
              // }}
              onSave={(description) => {
                if (isOpenedCourse) {
                  saveCourse({ description })
                } else {
                  saveLecture({ description })
                }
              }}
              placeholder={
                isOpenedCourse ? 'Описание курса...' : 'Описание лекции...'
              }
              readonly={mode !== MODES.ADMIN}
              // tagName='article' // Use a custom HTML tag (uses a div by default)
            />
            {isOpenedCourse && (
              <>
                <Divider light />
                <ButtonLink
                  name="Настройки пользователей"
                  href={`/course/${course._id}/users`}
                />
              </>
            )}
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: isOpenedCourse
                ? course.description
                : activeLecture.description,
            }}
          ></div>
        )}

        {!isOpenedCourse && (
          <>
            <Divider light />
            {tasks.length > 0 ? (
              <div className="flex flex-col gap-y-2">
                <p className="text-lg font-bold">Задания к лекции</p>
                {tasks.map((task) => {
                  return (
                    <Task
                      key={task._id}
                      task={task}
                      answers={answers.filter(
                        (answer) => answer.taskId === task._id
                      )}
                      mode={mode}
                      user={user}
                      refreshPage={refreshPage}
                      userCourseAccess={userCourseAccess}
                    />
                  )
                })}
              </div>
            ) : (
              <div>Заданий для этой лекции нет</div>
            )}
            {mode === MODES.ADMIN && (
              <div
                className={
                  'flex duration-300 gap-x-2 hover:bg-gray-400 bg-gray-200 border-gray-500 cursor-pointer items-center justify-center border rounded-lg'
                }
                onClick={(e) => {
                  e.preventDefault()
                  postData(
                    `/api/tasks`,
                    { lectureId: activeLecture._id, index: tasks.length },
                    refreshPage
                  )
                }}
              >
                <div className="w-4">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className="whitespace-nowrap">Добавить задание</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LectureContent
