const express = require('express')
const fs = require("fs");

const app = express()
const parser = express.json()

app.use(express.static(__dirname))

const dataPath = __dirname + '/dataset.json'


app.get('/api/data', (req, res) => {
    const content = fs.readFileSync(dataPath, 'utf8') //cчит файл в строку
    const data = JSON.parse(content) //парсинг в обьект
    res.send(data)
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
