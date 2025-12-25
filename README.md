Данный проект представляет собой web версию мессенжера реализованного с помощью библиотеки `flask`, `flask_socketio`  и `boostrap5`.
Клиентское приложение написано на JavaScript, а сервер на языке Python. 
# Функционал
 - Закрепление сообщений
 - Ответить на сообщение 
 - удалить сообщение
 - пересылать сообщения
 - редактировать свои сообщения и профиль
 - возможность изменять у себя фон чата
 - отправлять сообщения по Enter или Ctrl+enter
 -  автоматически обновляет сообщения с помощью `fkask-socketio`
 - хранение паролей пользователей в захешированном виде
 - закрепление чатов
 
## Инструкция по запуску
создать файл в директории python_modules с ключами(keys.py) 
api_key = "", bot_key = "" код от тг бота 
и room_name, jwt(они будут потом удалены из кода в следующих версиях)  
- pip install -r requirements.txt
- python server.py
- puthon -m python_modules.tg_bot.bot.py

## Скриншоты

## Чат
![alt text](https://github.com/aresen12/web_messenger/blob/master/static/img/ScreenShots/chat.jpg?raw=true)



Создание чатов и групп с неограниченным колличеством 
![](https://github.com/aresen12/web_messenger/blob/master/static/img/ScreenShots/create_chat.jpg?raw=true)
Настройка фона и редактирование профиля

![](https://github.com/aresen12/web_messenger/blob/master/static/img/ScreenShots/menu.jpg?raw=true)



