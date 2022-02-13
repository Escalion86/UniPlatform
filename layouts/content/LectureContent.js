import Divider from '@components/Divider'
import { useEffect, useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import cn from 'classnames'
import { EditText } from 'react-edit-text'
import ReactPlayer from 'react-player'
import { putData } from '@helpers/CRUD'
import Vimeo from '@u-wave/react-vimeo'

const LectureContent = ({
  activeChapter,
  activeLecture,
  setEditMode,
  editMode,
  userCourseAccess,
  isSideOpen,
  setIsSideOpen,
  refreshPage,
}) => {
  const [newChapterState, setNewChapterState] = useState(activeChapter)
  const [newLectureState, setNewLectureState] = useState(activeLecture)
  const description = useRef(activeLecture.description)

  const [pause, setPause] = useState(false)

  const updateNewChapter = (data) => {
    setNewChapterState({ ...newChapterState, ...data })
  }

  const updateNewLecture = (data) => {
    setNewLectureState({ ...newLectureState, ...data })
  }

  const handleChangeLecture = (evt) => {
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

  const removeTitle = () => {
    // var node = document.getElementsByClassName(
    //   'ytp-chrome-top ytp-show-cards-title'
    // )
    // if (node.parentNode) {
    //   node.parentNode.removeChild(node)
    // }

    var node = document.getElementById('widget2')
    console.log('node.children', node.children)
    // if (node.parentNode) {
    //   node.parentNode.removeChild(node)
    // }
  }

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            'flex justify-between',
            {
              'absolute top-0 left-0 z-10 w-full h-full group':
                activeLecture?.videoUrl,
            },
            {
              'h-0 w-full': userCourseAccess !== 'admin' && isSideOpen,
            },
            { 'bg-black': pause },
            { 'delay-1000': !pause }
          )}
        >
          <div className="sticky top-0 flex justify-between w-full h-20">
            <div
              className={cn(
                'overflow-hidden duration-200 h-auto',
                isSideOpen
                  ? 'w-0'
                  : activeLecture?.videoUrl
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
                    // editMode
                    //   ? 'w-0'
                    //   :
                    activeLecture?.videoUrl ? 'w-0 group-hover:w-80' : 'w-80'
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
            activeLecture?.videoUrl ? 'aspect-w-16 aspect-h-9' : 'h-0'
          )}
        >
          {activeLecture?.videoUrl && (
            // <iframe
            //   src="https://www.youtube.com/embed/E7wJTI-1dvQ"
            //   frameBorder="0"
            //   allow="autoplay; encrypted-media"
            //   allowFullScreen
            //   title="video"
            // />
            <ReactPlayer
              width="100%"
              height="100%"
              url={
                activeLecture?.videoUrl +
                '?modestbranding=1&;showinfo=0&;autohide=1&;rel=0'
              }
              playing={!pause}
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                    disablekb: 1,
                    showinfo: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    cc_load_policy: 0,
                  },
                },
                vimeo: {
                  autoplay: true,
                },
                // facebook: {
                //   appId: '12345',
                // },
              }}
              onDuration={(duration) => console.log('duration', duration)}
            />
            // <Vimeo
            //   responsive={true}
            //   // width="100%"
            //   // height="100%"
            //   // style={{ width: '100%', height: '100%' }}
            //   paused={pause}
            //   // className="w-full h-full"
            //   video="672870407"
            //   autoplay
            // />
          )}
        </div>
      </div>
      <div className="px-2 tablet:px-12 desktop:w-5/6 laptop:px-20">
        <button onClick={() => setPause((state) => !state)}>Pause</button>
        <button onClick={removeTitle}>Удалить заголовок видео</button>
        {editMode && (
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
                  ? newLectureState.videoUrl ?? ''
                  : activeLecture?.videoUrl ?? ''
              }
              // inline
              onChange={(videoUrl) => {
                updateNewLecture({ videoUrl })
              }}
              onSave={({ value }) => saveLecture({ videoUrl: value })}
              readonly={!editMode}
            />
          </div>
        )}
        <h2 className="flex py-2 text-2xl font-bold flex-nowrap gap-x-1">
          <span className="whitespace-nowrap">
            Раздел №{activeChapter?.index + 1} -
          </span>
          <EditText
            className={cn(
              'w-full px-1 py-0 m-0 font-bold whitespace-normal border-b outline-none',
              editMode ? 'border-purple-600' : 'border-transparent'
            )}
            value={
              editMode
                ? newChapterState.title ?? ''
                : activeChapter?.title ?? ''
            }
            // inline
            onChange={(title) => updateNewChapter({ title })}
            onSave={({ value }) => saveChapter({ title: value })}
            readonly={!editMode}
          />
        </h2>
        {/* <h3 className="py-2 text-xl font-bold">
              Лекция №{activeLecture.index + 1} - {activeLecture.title}
            </h3> */}
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
                ? newLectureState.title ?? ''
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
        <Divider light />
        {/* <div className="text-base">{activeLecture.description}</div> */}
        {editMode ? (
          <ContentEditable
            className="border-b border-purple-600 outline-none"
            // innerRef={this.contentEditable}
            html={activeLecture.description} // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onChange={handleChangeLecture} // handle innerHTML change
            // html={description.current}
            onBlur={() => {
              console.log('text', description.current)
              saveLecture({ description: description.current })
            }}
            // tagName='article' // Use a custom HTML tag (uses a div by default)
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: activeLecture.description }}
          ></div>
        )}
      </div>
    </>
  )
}

export default LectureContent
