# Cайт-агрегатор просмотра и бронирования гостиниц Backend

## Функционал:
* Регистрация/авторизация пользователя. 
* API пользователя
* API администратора
* публичный API
* чат консультанта

## Стек технологий:
* Node.js
* WebSocket
* webpack
* Nest.js
* MongoDB
* bcrypt - https://www.npmjs.com/package/bcrypt
* date-fns-tz - https://www.npmjs.com/package/date-fns-tz
* socket.io - https://www.npmjs.com/package/socket.io


# Первичная установка
1. Скачать проект с гитхаба https://github.com/gfjdfeiw938cj/diplome-hotel_aggregator.git
2. Обновить фаил .env
3. Установить докер(десктоп версию под Win or Mac)
3. запустить локальный файл docker compose  `docker-compose up --build `

# Переменных окружения
1. Указать url mongodb
*Пример*: MY_CONFIG_MONGODB_URL = 'mongodb://127.0.0.1:27017//'
2. Указать salt для хэшированя паролей, рекомендуемое значение 10
*Пример*:SALT = 10
3. Указать url backend 
*Пример*:URL_FRONTEND='http://localhost:3004'

# Администратор сайта
При инициализации бд создаеться администратор сайта для бд 'test'   
Для изменения бд docker-entrypoint-initdb.d/mongo-init.js изменить db = conn.getDB('Название бд');   
Логин: admin@mail.ru   
Пароль: admin   



