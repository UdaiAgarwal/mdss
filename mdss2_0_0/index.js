const electron = require("electron")
const { app, BrowserWindow, Menu, ipcMain } = electron
const fs = require("fs")
const index = "./modules/index.html"
const ses = "./modules/ses.html"
const relations = "./modules/relations.html"

const {
    getKeys,
    displayObjectList,
} = require("./backend/Utility")

const {forwardCompletionStructural} = require("./backend/ForwardCompletion")

let data = require("./backend/Data")["data"]

// backend details
const fileLocation_LTT = "./knowledge/LibraryType.json"
const fileLocation_TST = "./knowledge/TypeSubsumption.json"
const fileLocation_STT = "./knowledge/SituationType.json"
const fileLocation_LTE = "./knowledge/LibraryTypeEffects.json"
const fileLocation_RRT = "./knowledge/RoleRelation.json"
const fileLocation_SRT = "./knowledge/SituationRelation.json"
const fileLocation_RTE = "./knowledge/RelationTypeEffects.json"

let applicationWindow

// ---------- UTILITY ----------
const createWindow = () => {
    applicationWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
}

const loadWindow = (applicationWindow, fileUrl) => {
    applicationWindow.loadFile(fileUrl)
}

const updateFile = (fileURL, jsonString) => {
    fs.writeFile(fileURL, jsonString, (err) => {
        if(err) throw err;
        console.log("Data updated")
    })
}
// ---------- MENU ----------
const menuTemplate = [
    { 
        label: "File",
        submenu: [
            { label: "Quit", role: "quit" }
        ]
    },
    {
        label: "Screens",
        submenu: [
            {
                label: "SE",
                click() { loadWindow(applicationWindow, ses)}
            },
            {
                label: "Relations",
                click() { loadWindow(applicationWindow, relations)}
            },
            {
                label: "Assessment",
                click() {loadWindow(applicationWindow, index)}
            }
        ]
    },
    {
        label: "View",
        submenu: [
            { label: "Reload", role: "reload"}
        ]
    }
]


// ON RUNNING THE APPLICATION
app.whenReady().then(function(){

    createWindow()
    
    loadWindow(applicationWindow,index)
    applicationWindow.webContents.openDevTools()

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)


})


// ON CLOSING THE APPLICATION
app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();   //FOR MAC
})


// From ses_renderer
ipcMain.on("update-LTT", (evt, data) => {
    data["LibraryType"] = data
    let jsonInput = JSON.stringify(data["LibraryType"])
    updateFile(fileLocation_LTT, jsonInput)
    evt.returnValue = "Updated"
})
ipcMain.on("update-TST", (evt, data) => {
    data["TypeSubsumption"] = data
    let jsonInput = JSON.stringify(data["TypeSubsumption"])
    updateFile(fileLocation_TST, jsonInput)
    evt.returnValue = "Updated"
})
ipcMain.on("update-STT", (evt, data) => {
    data["SituationType"] = data  
    let jsonInput = JSON.stringify(data["SituationType"])
    updateFile(fileLocation_STT, jsonInput)
    evt.returnValue = "Updated"  
})
ipcMain.on("update-LTE", (evt, data) => {
    data["LibraryTypeEffects"] = data  
    let jsonInput = JSON.stringify(data["LibraryTypeEffects"])
    updateFile(fileLocation_LTE, jsonInput)
    evt.returnValue = "Updated"  
})


// From relations_renderer
ipcMain.on("update-RRT", (evt, data) => {
    data["RoleRelation"] = data
    let jsonInput = JSON.stringify(data["RoleRelation"])
    updateFile(fileLocation_RRT, jsonInput)
    evt.returnValue = "Updated"
})
ipcMain.on("update-SRT", (evt, data) => {
    data["SituationRelation"] = data
    let jsonInput = JSON.stringify(data["SituationRelation"])
    updateFile(fileLocation_SRT, jsonInput)
    evt.returnValue = "Updated"
})
ipcMain.on("update-RTE", (evt, data) => {
    data["RelationTypeEffects"] = data
    let jsonInput = JSON.stringify(data["RelationTypeEffects"])
    updateFile(fileLocation_RTE, jsonInput)
    evt.returnValue = "Updated"
})


// Functionalities Requires from index_renderer
ipcMain.on("situation-assessment", (evt) => {
    let newStructuralElements = {SituationType: data["SituationType"], SituationRelation: data["SituationRelation"]}
    let preExistingStructuralElements = {SituationType: [], SituationRelation: []}
    let forwardExtensionStructural = {}
    let separator = "-"

    forwardExtensionStructural = forwardCompletionStructural(newStructuralElements, preExistingStructuralElements, forwardExtensionStructural, data, separator)
    let situationTypeJson = JSON.stringify(preExistingStructuralElements["SituationType"])
    let situationRelationJson = JSON.stringify(preExistingStructuralElements["SituationRelation"])
    
    updateFile(fileLocation_STT, situationTypeJson)
    updateFile(fileLocation_SRT, situationRelationJson)
    
    evt.returnValue = forwardExtensionStructural
})