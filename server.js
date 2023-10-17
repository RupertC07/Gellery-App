const bodyParser = require('body-parser')
const express = require('express')

const path = require('path')

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs')



const PORT = 3001

const views = require('./routes/views_routes')


app.use(views)


app.listen(PORT, ()=> {

    console.log("LISTENING TO PORT " + PORT)
})