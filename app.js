const express = require('express')
const handlebars = require('express-handlebars')

const {readFile, writeFile, existsSync} = require('fs')
const path = require('path')

const STYLE_DIR = path.join(__dirname, 'styles');
const CHANNEL_DIR = path.join(__dirname, 'channels');
const FILE_OPTIONS = {encoding: "utf8"}

const app = express()
const port = 3000

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.use('/static',express.static('./public'))
app.use(express.urlencoded())

app.get('/style.css', function(request, response) {
    response.sendFile(STYLE_DIR + "/" + "style.css");
});

app.get('/animate.css', function(request, response) {
    response.sendFile(STYLE_DIR + "/" + "animate.css");
});

app.get('/', (request, response) => {
    response.redirect('/channels/channel1');
})

let channelFileName = path.join(CHANNEL_DIR, `channel1.json`)
let standardChannelName = 'channel1'

app.get('/channels/:channelName/', (request, response) => {

    const {channelName} = request.params

    standardChannelName = channelName;

    channelFileName = path.join(CHANNEL_DIR, `${channelName}.json`)

    if(!existsSync(channelFileName)){
        response.status(404).end()
        return
    }

    readFile(
        channelFileName,
        FILE_OPTIONS,
        (error, data) => {
            if(error){
                response.status(500).end();
            }
            const channel = JSON.parse(data);
            response.render('home', {channel})
        })
})


app.post('/message-board/new',(request, response) => {

    const { author, message } = request.body

    const content = {
        author,
        message,
    }

    readFile(
        channelFileName,
        FILE_OPTIONS,
        (error, message) => {
            if (error) {
                response.status(500).end();
                return
            }

            const data = JSON.parse(message)
            data.messages.unshift(content)


            writeFile(channelFileName, JSON.stringify(data, null, 2), FILE_OPTIONS, (error) => {
                if(error){
                    response.status(500).end();
                } else {
                    response.redirect(`/channels/${standardChannelName}`);
                }
            })
        })
})


app.listen(port, () => {
    console.log(`Beispiel App hört zu bei http://localhost:${port}`)
})