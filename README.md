# Реализация сервиса сокращения URL
Данный проект представляет собой простой веб-сервис для сокращения URL-адресов. 
Он позволяет создавать короткие ссылки для оригинальных URL и осуществлять переадресацию по сокращённым URL.

# Основные функции
Создание короткого URL: при GET-запросе к /create?url=оригинальный_URL возвращается сокращённый URL.
Переадресация: при обращении к сокращённому URL происходит перенаправление на оригинальный URL.
