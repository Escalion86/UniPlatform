const startedDate = +new Date() + 864e5

export const dateISOString = new Date(startedDate).toISOString() // 2022-03-08T04:41:14.269Z
export const xAmzDate = dateISOString // 20220308T044154007Z
  .split('-')
  .join('')
  .split(':')
  .join('')
  .split('.')
  .join('')
export const dateYMD = dateISOString.split('T')[0].split('-').join('') // 20220308
export const dateUTCString = new Date(startedDate).toUTCString() // Tue, 08 Mar 2022 04:41:45 GMT
