'use strict'

const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const util = require('util')
const readFile = util.promisify(fs.readFile)

const ROOT = path.join(__dirname, 'files')

http.createServer(async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        if (req.url === '/') {
          res.end('Please enter the filename')
        } else {
          const filePath = url.parse(req.url).pathname
          await sendFile(filePath, res)
        }
      } catch (e) {
        console.error(e)
        res.statusCode = 404
        res.end('404 - Not found')
      }
  }
}).listen(3000)

async function sendFile (filePath, res) {
  // отдачу файлов следует переделать "правильно", через потоки, с нормальной обработкой ошибок
  const content = await readFile(ROOT + filePath)
  res.setHeader('Content-Type', checkExtension(filePath))
  res.end(content)
};

function checkExtension (filePath) {
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
