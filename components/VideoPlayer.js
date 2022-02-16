import { useEffect, useRef } from 'react'
// import YouTubeToHtml5 from '@thelevicole/youtube-to-html5-loader/src/YouTubeToHtml5'

const VideoPlayer = ({ src }) => {
  const videoRef = useRef()
  const previousUrl = useRef(src)

  useEffect(() => {
    if (previousUrl.current === src) {
      return
    }

    if (videoRef.current) {
      videoRef.current.load()
    }

    previousUrl.current = src
  }, [src])

  // const text = new YouTubeToHtml5()

  return (
    <video ref={videoRef} controlsList="nodownload noremoteplayback" controls>
      <source src={src} />
    </video>
    // <video
    //   class="youtube-video"
    //   data-yt="https://youtube.com/watch?v=ScMzIvxBSi4"
    // ></video>
  )
}

export default VideoPlayer
