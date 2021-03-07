/*
# ExpressJS Site by Erdem Temizdemir @ SRH BSDC 2021
# app.js for serving handlesbars, scripts & stylesheets
# Requirements: NodeJS, Express, Handlebars
# Description:
# ExpressJS App for server-sided browser content delivery
# Served by ExpressJS
# Teacher: David Linner @ SRH BSDC 2021
*/

/* ExpressJS Import */
const express = require('express')
const handlebars = require('express-handlebars')
/* ################ */

/* File System */
const {readFileSync, readFile, writeFile, readdirSync, existsSync} = require('fs')
const path = require('path')
/* ########### */

/* Directories */
const CHANNEL_DIR = path.join(__dirname, 'channels')
const FILE_OPTIONS = {encoding: "utf8"}
/* ########### */

/* ExpressJS App Init */
const app = express()
const port = 3000
/* ################## */

/* ExpressJS View Engine */
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
/* ##################### */

/* ExpressJS Static */
app.use('/static',express.static('./public'))
app.use(express.urlencoded())
/* ################ */

/* Home Directory Redirect */
app.get('/', (request, response) => {
    response.redirect('/channels/channel1')
})
/* ####################### */


/* HTTP (GET) Read -> /channels/*.json */
app.get('/channels/:channelName/', (request, response) => {

    const {channelName} = request.params
    const channelFileName = path.join(CHANNEL_DIR, `${channelName}.json`)

    if(!existsSync(channelFileName)){
        response.status(404).end()
        return
    }

    let channelList = []

    const files = readdirSync(CHANNEL_DIR, FILE_OPTIONS)
        for(let file of files) {
            let currentChannel = path.join(CHANNEL_DIR, file)

            let fileData = readFileSync(currentChannel, FILE_OPTIONS)
                    const channel = JSON.parse(fileData)
                    const json_content = {"name": channel.name, "channel_id": channel.channel_id}
                    channelList.push(json_content)
                }

        readFile(
            channelFileName,
            FILE_OPTIONS,
            (error, data) => {
                if(error){
                    response.status(500).end()
                }
                const channel = JSON.parse(data)
                response.render('home', {channel, channelList})
            })
})
/* ################################### */

/* HTTP (POST) Read&Write -> /channels/*.json */
app.post('/channels/:channelName/new',(request, response) => {
    const {channelName} = request.params
    const channelFileName = path.join(CHANNEL_DIR, `${channelName}.json`)
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
                response.status(500).end()
                return
            }
            const data = JSON.parse(message)
            data.messages.unshift(content)
            writeFile(channelFileName, JSON.stringify(data, null, 2), FILE_OPTIONS, (error) => {
                if(error){
                    response.status(500).end()
                } else {
                    response.redirect(`/channels/${channelName}`)
                }
            })
        })
})
/* ########################################## */

/* ExpressJS Listen on Port */
app.listen(port, () => {
    console.log(`Beispiel App hört zu bei http://localhost:${port}`)
})
/* ######################## */