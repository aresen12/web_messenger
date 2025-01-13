ВНИМАНИЕ pyopenssl нужен только для демонстрации работы!!!
При использовании с собственнымсертификатом удалить из файла server.py в def main в строке app.run параметр ssl_context='adhoc'

Данный проект представляет собой web версию мессенжера реализованного с помощью библиотеки `flask` и `boostrap5`.
Клиентское приложение написано на JavaScript, а сервер на языке Python. 
# Функционал
 - Ответить на сообщение 
 - удалить сообщение
 - редактировать свои сообщения и профиль
 - возможность изменять у себя фон чата 
 - отправлять сообщения по Enter или Ctrl+enter
 -  автоматически обновляет сообщения с помощью `ajax` запросов на сервер
 - хранение паролей пользователей в захешированном виде
 - для регистрации нужна лишь электронная почта
 
## Скриншоты

## Чат
![alt text](https://github.com/aresen12/web_messenger/blob/master/static/img/ScreenShots/chat.jpg?raw=true)



Создание чатов и групп с неограниченным колличеством 
![](https://github.com/aresen12/web_messenger/blob/master/static/img/ScreenShots/create_chat.jpg?raw=true)
Настройка фона и редактирование профиля

![](https://github.com/aresen12/web_messenger/blob/master/static/img/ScreenShots/menu.jpg?raw=true)



