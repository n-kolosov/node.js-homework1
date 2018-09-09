'use strict'

const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')

const ROOT = path.join(__dirname, 'files')

http.createServer((req, res) => {
  const filePath = url.parse(req.url).pathname

  switch (req.method) {
    case 'GET':
      if (req.url === '/') {
        res.end('Please enter the filename in adress line')
      } else {
        sendFile(filePath, res)
      };
  };
}).listen(3000)

function sendFile (filePath, res) {
  // отдачу файлов следует переделать "правильно", через потоки, с нормальной обработкой ошибок
  fs.readFile(ROOT + filePath, (err, content) => {
    if (err) {
      res.statusCode = 404
      res.end('404 - Not found')
    } else {
      res.setHeader('Content-Type', checkExtention(filePath))
      res.end(content)
    }
  })
};

function checkExtention (filePath) {
  switch (path.extname(filePath)) {
    case '.txt':
      return 'text/plain;charset=utf-8'
    default:
      return 'text/html;charset=utf-8'
  }
};

/*
Алгоритм работы сервера:
1. Сервер получает get-запрос, в URL которого название запрашиваемого файла
2. Сервер проверяет, есть ли такой файл в директории files
3. Если файл есть, то сервер возвращает 200 статус и передаёт файл
4. Если файла нет, то сервер возвращает 404 статус и отображает сообщение "Файл %FILENAME% не найден"

TO DO:
1. Переписать с использованием async/await
2. Сделать метод, обрабатывающий отправку файлов POST-запросом
3. Сделать метод, обрабатывающий удаление файлов DELETE-запросом
4. Сделать веб-форму, позволяющую увидеть все файлы, загрузить новые и удалить существующие
*/
