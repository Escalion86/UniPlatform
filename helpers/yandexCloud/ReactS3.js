import Signature from './Signature'
import Policy from './Policy'
import { dateISOString, xAmzDate, dateYMD, dateUTCString } from './Date'
import { throwError } from './ErrorThrower'

class S3FileUpload {
  static async uploadFile(file, config) {
    const url = `http://storage.yandexcloud.net/${config.bucketName}/${
      config.dirName ? config.dirName + '/' : ''
    }${file.name}`

    // Error Thrower :x:
    throwError(config, file)

    const fd = new FormData()
    // const key = `${config.dirName ? config.dirName + '/' : ''}${file.name}`
    // const url = `https://${config.bucketName}.s3.amazonaws.com/`;
    // fd.append('key', key)
    // fd.append('x-amz-acl', 'public-read')
    fd.append('Content-Type', file.type)
    // fd.append('x-amz-meta-uuid', '14365123651274')
    // fd.append('x-amz-server-side-encryption', 'AES256')
    fd.append(
      'X-Amz-Credential',
      `${config.accessKeyId}/${dateYMD}/${config.region}/s3/aws4_request`
    )
    // console.log('dateUTCString', dateUTCString)
    // console.log('xAmzDate', xAmzDate)
    // console.log('dateYMD', dateYMD)
    // console.log('dateYMD', dateYMD)
    // fd.append('Date', dateUTCString)
    fd.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
    fd.append('X-Amz-Date', xAmzDate)
    // fd.append('X-Amz-Date', dateYMD)
    fd.append('x-amz-meta-tag', '')
    fd.append('Policy', Policy.getPolicy(config))
    fd.append(
      'X-Amz-Signature',
      Signature.getSignature(config, xAmzDate, Policy.getPolicy(config))
    )
    fd.append('file', file)

    const params = {
      method: 'PUT',
      headers: {
        fd,
      },
      body: fd,
    }

    const data = await fetch(url, params)
    if (!data.ok) return Promise.reject(data)
    return Promise.resolve({
      bucket: config.bucketName,
      key: `${config.dirName ? config.dirName + '/' : ''}${file.name}`,
      location: `${url}${config.dirName ? config.dirName + '/' : ''}${
        file.name
      }`,
      result: data,
    })
  }
  // static async uploadFile(file, config) {
  //   const url = `http://storage.yandexcloud.net/${config.bucketName}/${
  //     config.dirName ? config.dirName + '/' : ''
  //   }${file.name}`

  //   // Error Thrower :x:
  //   throwError(config, file)

  //   const fd = new FormData()
  //   // const key = `${config.dirName ? config.dirName + '/' : ''}${file.name}`
  //   // const url = `https://${config.bucketName}.s3.amazonaws.com/`;
  //   // fd.append('key', key)
  //   fd.append('acl', 'public-read')
  //   fd.append('Content-Type', file.type)
  //   fd.append('x-amz-meta-uuid', '14365123651274')
  //   fd.append('x-amz-server-side-encryption', 'AES256')
  //   fd.append(
  //     'X-Amz-Credential',
  //     `${config.accessKeyId}/${dateYMD}/${config.region}/s3/aws4_request`
  //   )
  //   // console.log('dateUTCString', dateUTCString)
  //   // console.log('xAmzDate', xAmzDate)
  //   // console.log('dateYMD', dateYMD)
  //   // console.log('dateYMD', dateYMD)
  //   // fd.append('Date', dateUTCString)
  //   fd.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
  //   fd.append('X-Amz-Date', dateUTCString)
  //   // fd.append('X-Amz-Date', xAmzDate)
  //   // fd.append('X-Amz-Date', dateYMD)
  //   fd.append('x-amz-meta-tag', '')
  //   // fd.append('Policy', Policy.getPolicy(config))
  //   fd.append(
  //     'X-Amz-Signature',
  //     Signature.getSignature(config, xAmzDate, Policy.getPolicy(config))
  //   )
  //   fd.append('file', file)

  //   // X-Amz-Algorithm=AWS4-HMAC-SHA256
  //   // &X-Amz-Expires=<интервал времени в секундах>
  //   // &X-Amz-SignedHeaders=<список заголовков разделенный символами ";">
  //   // &X-Amz-Signature=<подпись>
  //   // &X-Amz-Date=<время в формате ISO 8601>
  //   // &X-Amz-Credential=<access-key-id>%2F<YYYYMMDD>%2Fru-central1%2Fs3%2Faws4_request

  //   const params = {
  //     method: 'PUT',
  //     headers: {
  //       fd,
  //     },
  //     body: fd,
  //   }

  //   const data = await fetch(url, params)
  //   if (!data.ok) return Promise.reject(data)
  //   return Promise.resolve({
  //     bucket: config.bucketName,
  //     key: `${config.dirName ? config.dirName + '/' : ''}${file.name}`,
  //     location: `${url}${config.dirName ? config.dirName + '/' : ''}${
  //       file.name
  //     }`,
  //     result: data,
  //   })
  // }
  static async deleteFile(fileName, config) {
    const fd = new FormData()
    // `https://cloud.yandex.ru/docs/storage/s3/api-ref/object/upload`
    const url = `http://storage.yandexcloud.net/${config.bucketName}/${
      config.dirName ? config.dirName + '/' : ''
    }${fileName}`

    // const url = `https://${config.bucketName}.s3-${config.region}.amazonaws.com/${config.dirName ? config.dirName + "/" : ""}${fileName}`;
    fd.append('Date', xAmzDate)
    fd.append('X-Amz-Date', xAmzDate)
    fd.append(
      'Authorization',
      Signature.getSignature(config, dateYMD, Policy.getPolicy(config))
    )
    fd.append('Content-Type', 'text/plain')

    const params = {
      method: 'delete',
      headers: {
        fd,
      },
    }

    const deleteResult = await fetch(url, params)
    if (!deleteResult.ok) return Promise.reject(deleteResult)
    return Promise.resolve({
      ok: deleteResult.ok,
      status: deleteResult.status,
      message: 'File Deleted',
      fileName: fileName,
    })
  }
}
const { uploadFile, deleteFile } = S3FileUpload
export { uploadFile, deleteFile }
export default S3FileUpload
