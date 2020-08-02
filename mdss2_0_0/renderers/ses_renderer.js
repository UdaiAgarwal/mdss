const electron = require("electron")
const {ipcRenderer} = electron

const LibraryTypeTableHeadings = document.querySelector("#LibraryTypeTableHeadingsContainer")
const TypeSubsumptionTableHeadings = document.querySelector("#TypeSubsumptionTableHeadingsContainer")
const SituationTypeTableHeadings = document.querySelector("#SituationTypeTableHeadingsContainer")
const LibraryTypeEffectsHeadings = document.querySelector("#LibraryTypeEffectsHeadingsContainer")

const LibraryTypeTableRecords = document.querySelector("#LibraryTypeTableRecordsContainer")
const TypeSubsumptionTableRecords = document.querySelector("#TypeSubsumptionTableRecordsContainer")
const SituationTypeTableRecords = document.querySelector("#SituationTypeTableRecordsContainer")
const LibraryTypeEffectsRecords = document.querySelector("#LibraryTypeEffectsRecordsContainer")

const addInLTTButton = document.querySelector("#addInLTTButton")
const addInTSTButton = document.querySelector("#addInTSTButton")
const addInSTTButton = document.querySelector("#addInSTTButton")
const addInLTEButton = document.querySelector("#addInLTEButton")

const saveLTTButton = document.querySelector("#saveLTTButton")
const saveTSTButton = document.querySelector("#saveTSTButton")
const saveSTTButton = document.querySelector("#saveSTTButton")
const saveLTEButton = document.querySelector("#saveLTEButton")

const { getAttributesFromGUI, getRecords, addNewRecord, showRecords } = require("../utilityFunctions")
const {getAttributes} = require("../backend/Utility")

const data = require("../backend/Data")["data"]
let {LibraryType, TypeSubsumption, SituationType, LibraryTypeEffects} = data

// ----- MAIN FUNCTION -----

// attributes of the table 
// let LibraryTypeTableAttributes = getAttributesFromGUI(LibraryTypeTableHeadings)
// let TypeSubsumptionTableAttributes = getAttributesFromGUI(TypeSubsumptionTableHeadings)
// let SituationTypeTableAttributes = getAttributesFromGUI(SituationTypeTableHeadings)
// let LibraryTypeEffectsAttributes = getAttributesFromGUI(LibraryTypeEffectsHeadings)
let LibraryTypeTableAttributes = getAttributes(LibraryType)
let TypeSubsumptionTableAttributes = getAttributes(TypeSubsumption)
let SituationTypeTableAttributes = getAttributes(SituationType)
let LibraryTypeEffectsAttributes = getAttributes(LibraryTypeEffects)



// Show records from backend
showRecords(LibraryTypeTableRecords, LibraryType, LibraryTypeTableAttributes)
showRecords(TypeSubsumptionTableRecords, TypeSubsumption, TypeSubsumptionTableAttributes)
showRecords(SituationTypeTableRecords, SituationType, SituationTypeTableAttributes)
showRecords(LibraryTypeEffectsRecords, LibraryTypeEffects, LibraryTypeEffectsAttributes)

// Add records to the table
addInLTTButton.addEventListener("click",(evt) => {
    addNewRecord(LibraryTypeTableRecords, LibraryTypeTableAttributes)    
})
addInTSTButton.addEventListener("click", (evt) => {
    addNewRecord(TypeSubsumptionTableRecords, TypeSubsumptionTableAttributes)
})
addInSTTButton.addEventListener("click", (evt) => {
    addNewRecord(SituationTypeTableRecords, SituationTypeTableAttributes)
})
addInLTEButton.addEventListener("click", (evt) => {
    addNewRecord(LibraryTypeEffectsRecords, LibraryTypeEffectsAttributes)
})


// Save records to backend
saveLTTButton.addEventListener("click", (evt) => {
    let records = getRecords(LibraryTypeTableRecords, LibraryTypeTableAttributes)
    let returnValue = ipcRenderer.sendSync("update-LTT", records)
    if(returnValue) alert("SE Updated")
})
saveTSTButton.addEventListener("click", (evt) => {
    let records = getRecords(TypeSubsumptionTableRecords, TypeSubsumptionTableAttributes)
    let returnValue = ipcRenderer.sendSync("update-TST", records)
    if(returnValue) alert("SE Updated")
})
saveSTTButton.addEventListener("click", (evt) => {
    let records = getRecords(SituationTypeTableRecords, SituationTypeTableAttributes)
    let returnValue = ipcRenderer.sendSync("update-STT", records)
    if(returnValue) alert("SE Updated")
})
saveLTEButton.addEventListener("click", (evt) => {
    let records = getRecords(LibraryTypeEffectsRecords, LibraryTypeEffectsAttributes)
    let returnValue = ipcRenderer.sendSync("update-LTE", records)
    if(returnValue) alert("SE Updated")
})