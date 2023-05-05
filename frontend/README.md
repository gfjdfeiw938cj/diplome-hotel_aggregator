# Cайт-агрегатор просмотра и бронирования гостиниц Frontend

## Функционал:
* Регистрация/авторизация пользователя. 
* API пользователя
* API администратора
* публичный API
* чат консультанта

## Стек технологий:
* React
* Redux
* React Router
* Node.js
* WebSocket
* webpack
* date-fns -https://date-fns.org/
* react-paginate - https://www.npmjs.com/package/react-paginate
* react-calendar - https://www.npmjs.com/package/react-calendar

# Первичная установка
1. Скачать проект с гитхаба https://github.com/gfjdfeiw938cj/diplome-hotel_aggregator.git
2. Обновить фаил .env
3. Установить докер(десктоп версию под Win or Mac)
3. запустить локальный файл docker compose  `docker-compose up --build `


# Переменных окружения
1. Указать url server
*Пример*:  REACT_APP_URL_SERVER=http://localhost:3000/api/
2. Папка publick сервера
*Пример*: REACT_APP_URL_STATIC=http://localhost:3000/public/images/
3. Указать Websoket url
*Пример*: REACT_APP_URL_WEBSOKET=http://localhost:3000/


