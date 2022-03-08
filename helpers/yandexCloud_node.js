// Подключаем модуль
const EasyYandexS3 = require('easy-yandex-s3')

// Инициализация
const yandexCloud_node = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YANDEX_CLOUD_API_KEY,
    secretAccessKey: process.env.YANDEX_CLOUD_API_SECRET,
  },
  Bucket: 'uniplatform', // например, "my-storage",
  debug: process.env.NODE_ENV === 'development', // Дебаг в консоли, потом можете удалить в релизе
})

export default yandexCloud_node
