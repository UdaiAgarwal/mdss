const electron = require("electron")
const {ipcRenderer} = electron

const RoleRelationTableHeadings = document.querySelector("#RoleRelationTableHeadingsContainer")
const SituationRelationTableHeadings = document.querySelector("#SituationRelationTableHeadingsContainer")
const RelationTypeEffectsHeadings = document.querySelector("#RelationTypeEffectsHeadingsContainer")

const RoleRelationTableRecords = document.querySelector("#RoleRelationTableRecordsContainer")
const SituationRelationTableRecords = document.querySelector("#SituationRelationTableRecordsContainer")
const RelationTypeEffectsRecords = document.querySelector("#RelationTypeEffectsRecordsContainer")

const addInRRTButton = document.querySelector("#addInRRTButton")
const addInSRTButton = document.querySelector("#addInSRTButton")
const addInRTEButton = document.querySelector("#addInRTEButton")

const saveRRTButton = document.querySelector("#saveRRTButton")
const saveSRTButton = document.querySelector("#saveSRTButton")
const saveRTEButton = document.querySelector("#saveRTEButton")

const { getAttributesFromGUI, getRecords, addNewRecord, showRecords } = require("../utilityFunctions")
const {getAttributes} = require("../backend/Utility")

const data = require("../backend/Data")["data"]
let {RoleRelation, SituationRelation, RelationTypeEffects} = data

// ----- MAIN FUNCTION -----

// attributes of the table 
// let RoleRelationTableAttributes = getAttributesFromGUI(RoleRelationTableHeadings)
// let SituationRelationTableAttributes = getAttributesFromGUI(SituationRelationTableHeadings)
// let RelationTypeEffectsAttributes = getAttributesFromGUI(RelationTypeEffectsHeadings)
let RoleRelationTableAttributes = getAttributes(RoleRelation)
let SituationRelationTableAttributes = getAttributes(SituationRelation)
let RelationTypeEffectsAttributes = getAttributes(RelationTypeEffects)

// Show records from backend
showRecords(RoleRelationTableRecords, RoleRelation, RoleRelationTableAttributes)
showRecords(SituationRelationTableRecords, SituationRelation, SituationRelationTableAttributes)
showRecords(RelationTypeEffectsRecords, RelationTypeEffects, RelationTypeEffectsAttributes)

// Add records to the table
addInRRTButton.addEventListener("click",(evt) => {
    addNewRecord(RoleRelationTableRecords, RoleRelationTableAttributes)    
})
addInSRTButton.addEventListener("click", (evt) => {
    addNewRecord(SituationRelationTableRecords, SituationRelationTableAttributes)
})
addInRTEButton.addEventListener("click", (evt) => {
    addNewRecord(RelationTypeEffectsRecords, RelationTypeEffectsAttributes)
})


// Save records to backend
saveRRTButton.addEventListener("click", (evt) => {
    let records = getRecords(RoleRelationTableRecords, RoleRelationTableAttributes)
    let returnValue = ipcRenderer.sendSync("update-RRT", records)
    if(returnValue) alert("Relations Updated")
})
saveSRTButton.addEventListener("click", (evt) => {
    let records = getRecords(SituationRelationTableRecords, SituationRelationTableAttributes)
    let returnValue = ipcRenderer.sendSync("update-SRT", records)
    if(returnValue) alert("Relations Updated")
})
saveRTEButton.addEventListener("click", (evt) => {
    let records = getRecords(RelationTypeEffectsRecords, RelationTypeEffectsAttributes)
    let returnValue = ipcRenderer.sendSync("update-RTE", records)
    if(returnValue) alert("Relations Updated")
})





// let returnedValue = ipcRenderer.sendSync("test", RoleRelationTableAttributes)
// console.log(returnedValue)