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
const {readFileSync, rmSync, readFile, writeFile, readdirSync, existsSync} = require('fs')
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

let existingChannelIDs = ['channel']
let existingChannelNames = []

/* HTTP (GET) Read -> /channels/*.json | Reading JSON Content */
app.get('/channels/:channelName/', (request, response) => {
    existingChannelIDs = ['channel']
    existingChannelNames = []
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
        existingChannelNames.push(channel.name)
        existingChannelIDs.push(channel.channel_id)
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
/* ########################################################## */

/* HTTP (POST) Read&Write -> /channels/*.json | Writing messages to JSON */
app.post('/channels/:channelName/newMessage',(request, response) => {
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
/* ##################################################################### */

/* HTTP (POST) Read&Write -> /channels/newChannel | Channel Creation */
app.post('/channels/newChannel', (request, response) => {
    const {newChannelName} = request.body
    if(existingChannelNames.includes(newChannelName)) {
        response.status(500).end()
        return
    }
    let newChannelID = 'channel';
    let i = 0;
    while(existingChannelIDs.includes(newChannelID)) {
        i++
        newChannelID = "channel"
        newChannelID = newChannelID + i
    }
    const channelFileName = path.join(CHANNEL_DIR, `${newChannelID}.json`)
    let data = {"name": newChannelName, "channel_id": newChannelID, "messages": []}
    writeFile(channelFileName, JSON.stringify(data, null, 2), FILE_OPTIONS, (error) => {
        if (error) {
            response.status(500).end()
        } else {
            response.redirect(`/channels/${newChannelID}`)
        }
    })
})
/* ################################################################# */

/* HTTP (POST) Remove -> /channels/:channelName/deleteChannel | Channel Deletion */
app.post('/channels/:channelName/deleteChannel', (request, response) => {
    const {currentChannel, channelName} = request.params
    const channelFileDir = path.join(CHANNEL_DIR, `${channelName}.json`)
    if (existingChannelIDs.includes(channelName)) {
        rmSync(channelFileDir)
        response.redirect('/')
    } else {
        response.status(404).end()
    }
})
/* ############################################################################# */

/* ExpressJS Listen on Port */
app.listen(port, () => {
    console.log(`Beispiel App hört zu bei http://localhost:${port}`)
})
/* ######################## */