// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import yandexCloud from '@helpers/yandexCloud'

var sha256hmac = require('js-sha256').hmac

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  var kDate = sha256hmac('AWS4' + key, dateStamp)
  var kRegion = sha256hmac(kDate, regionName)
  var kService = sha256hmac(kRegion, serviceName)
  var kSigning = sha256hmac(kService, 'aws4_request')

  return kSigning
}

const deleteFile = async (name) => {
  const key = 'pawb6iMjw3PLywqu0s9fQMjQbz6rLj6Wpgtihg1M'
  const dateStamp = '20220302'
  const regionName = 'us-east-1'
  const serviceName = 's3'

  const signKey = getSignatureKey(key, dateStamp, regionName, serviceName)
  // console.log('signKey', signKey)

  return await fetch(`https://storage.yandexcloud.net/uniplatform/` + name, {
    method: 'DELETE',
    // mode: 'cors',
    Authorization: signKey,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Type': 'text/plain',
    // },
  })
    // .then((response) => response.json())
    .then((data) => {
      console.log('data of deleted file', data)
    })
    .catch((err) => console.error('ERROR', err))
}

const sendVideo = async (video) => {
  if (typeof video === 'object') {
    console.log('-------------------------------- send video')
    const formData = new FormData()
    formData.append('file', video)
    // formData.append('props', '12345')
    // console.log('video', video)
    // formData.append(
    //   'upload_preset',
    //   folder ? CLOUDINARY_FOLDER + '_' + folder : CLOUDINARY_FOLDER
    // )
    // if (videoName) {
    //   formData.append('public_id', videoName)
    // }

    return await fetch(
      'https://storage.yandexcloud.net/uniplatform/pawb6iMjw3PLywqu0s9fQMjQbz6rLj6Wpgtihg1M',
      {
        method: 'PUT',
        body: formData,
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          // 'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        console.log('response', response)
        response.json()
      })
      .then((data) => {
        console.log('data of sended video file', data)
      })
      .catch((err) => console.error('ERROR', err))
  } else {
    console.log('Это не видео файл')
  }
}

const Test = ({ user, error, success }) => {
  // const router = useRouter()

  // const checkList = async () => {
  //   var list = await yandexCloud.GetList('courses/')
  //   console.log('list', list)
  // }

  return (
    <div className="box-border w-screen h-screen overflow-hidden">
      <input
        type="file"
        onChange={(e) => sendVideo(e.target.files[0])}
        // accept="video/mp4,video/x-m4v,video/*"
        // accept="image/jpeg,image/png"
      />
      <button onClick={() => deleteFile('deleteFile')}>Удалить</button>
    </div>
  )
}

export default Test

// export const getServerSideProps = async (context) => {

//   if (!newUser)
//     return {
//       props: {
//         user: {
//           email,
//         },
//         error:
//           'Ошибка создания пользователя. Пожалуйста обратитесь к администратору',
//       },
//     }

//   // Теперь удаляем токен
//   await EmailConfirmations.deleteOne({ email, token })

//   return {
//     props: {
//       user: {
//         email: context.query.email,
//       },
//       success: 'Почта подтверждена!',
//     },
//   }
// }
