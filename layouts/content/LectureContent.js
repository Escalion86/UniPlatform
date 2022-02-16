import Divider from '@components/Divider'
import { useEffect, useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import cn from 'classnames'
import { EditText } from 'react-edit-text'
// import ReactPlayer from 'react-player'
import { putData } from '@helpers/CRUD'
import { deleteImage, sendVideo } from '@helpers/cloudinary'
import LoadingSpinner from '@components/LoadingSpinner'
// import { Transformation, Video } from 'cloudinary-react'
import VideoPlayer from '@components/VideoPlayer'

const LectureContent = ({
  course,
  activeChapter = false,
  activeLecture = false,
  setEditMode,
  editMode,
  userCourseAccess,
  isSideOpen,
  setIsSideOpen,
  refreshPage,
}) => {
  const isOpenedCourse = !activeLecture
  const videoUrl = isOpenedCourse ? course?.videoUrl : activeLecture?.videoUrl

  const [newCourseState, setNewCourseState] = useState(course)
  const [newChapterState, setNewChapterState] = useState(activeChapter)
  const [newLectureState, setNewLectureState] = useState(activeLecture)
  const description = useRef(
    isOpenedCourse ? course.description : activeLecture.description
  )
  const [isVideoSending, setIsVideoSending] = useState(false)

  const hiddenFileInput = useRef(null)

  useEffect(() => {
    setNewChapterState(activeChapter)
    setNewLectureState(activeLecture)
  }, [activeLecture, activeChapter])

  const [pause, setPause] = useState(false)

  const updateNewCourse = (data) => {
    setNewCourseState({ ...newCourseState, ...data })
  }

  const updateNewChapter = (data) => {
    setNewChapterState({ ...newChapterState, ...data })
  }

  const updateNewLecture = (data) => {
    setNewLectureState({ ...newLectureState, ...data })
  }

  const handleChangeDescription = (evt) => {
    description.current = evt.target.value
  }

  const handleBlur = () => {
    console.log(description.current)
  }

  const saveContent = async () => {
    await putData(`/api/chapters/${newChapterState._id}`, newChapterState)
    await putData(`/api/lectures/${newLectureState._id}`, newLectureState)
    refreshPage()
  }

  const saveChapter = async (params) => {
    await putData(`/api/chapters/${newChapterState._id}`, params)
    refreshPage()
  }

  const saveLecture = async (params) => {
    await putData(`/api/lectures/${newLectureState._id}`, params)
    refreshPage()
  }

  const saveCourse = async (params) => {
    await putData(`/api/courses/${course._id}`, params)
    refreshPage()
  }

  const selectVideoClick = (event) => {
    hiddenFileInput.current.click()
  }

  const deleteVideo = async () => {
    if (isOpenedCourse && course.videoUrl)
      await deleteImage(
        `obnimisharik_courses_dev/courses/${course._id}/video`,
        'video'
      )
    if (!isOpenedCourse && activeLecture.videoUrl)
      await deleteImage(
        `obnimisharik_courses_dev/lectures/${activeLecture._id}/video`,
        'video'
      )
  }

  const onChangeFile = async (newFile) => {
    if (newFile) {
      setIsVideoSending(true)
      await deleteVideo()
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
    }
  }

  return (
    <>
      <div className="relative group">
        <div
          className={cn(
            'flex justify-between',
            {
              'absolute top-0 left-0 z-10 w-full': videoUrl,
            },
            {
              'h-0 w-full': userCourseAccess !== 'admin' && isSideOpen,
            }
          )}
        >
          <div className="sticky top-0 flex justify-between w-full h-20">
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
            <div className="flex">
              {userCourseAccess === 'admin' && (
                <div
                  className={cn(
                    'duration-200 overflow-hidden ',
                    videoUrl ? 'w-0 group-hover:w-80' : 'w-80'
                  )}
                >
                  <button
                    onClick={() => {
                      if (!editMode) {
                        setNewLectureState(activeLecture)
                        setNewChapterState(activeChapter)
                        setEditMode(true)
                      } else {
                        setEditMode(false)
                      }
                    }}
                    className={cn(
                      'w-80 h-12 p-2 text-white bg-black border border-gray-200 bg-opacity-90 hover:bg-gray-600'
                    )}
                  >
                    {editMode
                      ? 'Выйти из режима редактирования'
                      : 'Переключить в режим редактирования'}
                  </button>
                </div>
              )}
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
            </div>
          </div>
        </div>

        <div
          className={cn(
            'z-0 w-full duration-300',
            videoUrl ? 'aspect-w-16 aspect-h-9' : 'h-0'
          )}
        >
          {videoUrl && (
            <VideoPlayer src={videoUrl} />
            // <video
            //   controlsList="nodownload noremoteplayback"
            //   controls
            //   // publicId={`obnimisharik_courses_dev/${
            //   //   isOpenedCourse
            //   //     ? `courses/${course._id}`
            //   //     : `lectures/${activeLecture._id}`
            //   // }/video`}
            //   // width="400"
            // >
            //   <source
            //     src={
            //       isOpenedCourse ? course?.videoUrl : activeLecture?.videoUrl
            //     }
            //     // type="video/mp4"
            //   />
            // </video>
            // <ReactPlayer
            //   width="100%"
            //   height="100%"
            //   url={
            //     (isOpenedCourse ? course.videoUrl : activeLecture.videoUrl) +
            //     '?modestbranding=1&;showinfo=0&;autohide=1&;rel=0'
            //   }
            //   playing={!pause}
            //   config={{
            //     youtube: {
            //       playerVars: {
            //         controls: 0,
            //         autoplay: 0,
            //         modestbranding: 1,
            //         rel: 0,
            //         disablekb: 1,
            //         showinfo: 0,
            //         iv_load_policy: 3,
            //         fs: 0,
            //         cc_load_policy: 0,
            //       },
            //     },
            //     vimeo: {
            //       autoplay: true,
            //     },
            //     // facebook: {
            //     //   appId: '12345',
            //     // },
            //   }}
            //   onDuration={(duration) => console.log('duration', duration)}
            // />
          )}
        </div>
      </div>
      <div className="flex flex-col px-2 tablet:px-12 desktop:w-5/6 laptop:px-20">
        {editMode && (
          <div className="mt-2">
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={(e) => onChangeFile(e.target.files[0])}
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
              <div className="flex gap-x-2">
                <button
                  className="px-2 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-400"
                  onClick={selectVideoClick}
                >
                  {videoUrl ? 'Загрузить другое видео' : 'Загрузить видео'}
                </button>
                {videoUrl && (
                  <button
                    className="px-2 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-400"
                    onClick={deleteVideo}
                  >
                    Удалить видео
                  </button>
                )}
              </div>
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
              ? `Курс - `
              : `Раздел №${activeChapter?.index + 1} - `}
          </span>
          <EditText
            className={cn(
              'w-full px-1 py-0 m-0 font-bold whitespace-normal border-b outline-none',
              editMode ? 'border-purple-600' : 'border-transparent'
            )}
            value={
              editMode
                ? isOpenedCourse
                  ? newCourseState.title
                  : newChapterState?.title ?? ''
                : isOpenedCourse
                ? course.title
                : activeChapter?.title ?? ''
            }
            // inline
            onChange={(title) => {
              if (isOpenedCourse) {
                updateNewCourse({ title })
              } else {
                updateNewChapter({ title })
              }
            }}
            onSave={({ value }) => {
              if (isOpenedCourse) {
                saveCourse({ title: value })
              } else {
                saveChapter({ title: value })
              }
            }}
            readonly={!editMode}
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
              Лекция №{activeLecture?.index + 1} -
            </span>

            <EditText
              className={cn(
                'w-full px-1 py-0 m-0 font-bold whitespace-normal border-b outline-none',
                editMode ? 'border-purple-600' : 'border-transparent'
              )}
              value={
                editMode
                  ? newLectureState?.title ?? ''
                  : activeLecture?.title ?? ''
              }
              // inline
              onChange={(title) => {
                updateNewLecture({ title })
              }}
              onSave={({ value }) => saveLecture({ title: value })}
              readonly={!editMode}
            />
          </div>
        )}
        <Divider light />
        {/* <div className="text-base">{activeLecture.description}</div> */}
        {editMode ? (
          <ContentEditable
            className="border-b border-purple-600 outline-none"
            // innerRef={this.contentEditable}
            html={
              isOpenedCourse ? course.description : activeLecture.description
            } // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onChange={handleChangeDescription} // handle innerHTML change
            // html={description.current}
            onBlur={() => {
              if (isOpenedCourse) {
                saveCourse({ description: description.current })
              } else {
                saveLecture({ description: description.current })
              }
            }}
            // tagName='article' // Use a custom HTML tag (uses a div by default)
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: isOpenedCourse
                ? course.description
                : activeLecture.description,
            }}
          ></div>
        )}
      </div>
    </>
  )
}

export default LectureContent
