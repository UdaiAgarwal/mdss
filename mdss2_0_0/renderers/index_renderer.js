const electron = require("electron")
const {ipcRenderer} = electron
const {getKeys, getAttributes} = require("../backend/Utility")

const ResultsContainer = document.querySelector("#Results")

const SituationAssessmentButton = document.querySelector("#SituationAssessmentButton")
const DiagnosisButton = document.querySelector("#DiagnosisButton")

SituationAssessmentButton.addEventListener("click", (evt) => {
    let returnValue = ipcRenderer.sendSync("situation-assessment")
    console.log(returnValue)
    ResultsContainer.innerHTML = ""
    // --------------- HEADER FOR RESULTS PROCESSES ------------- //
    let processHeader = document.createElement("div")
    processHeader.setAttribute("class", "process-header")
    
    let processTypeHeader = document.createElement("div")
    processTypeHeader.setAttribute("class", "process-type-header")
    processTypeHeader.appendChild(document.createTextNode("ProcessType"))

    let rolesHeader = document.createElement("div")
    rolesHeader.setAttribute("class", "roles-header")
    rolesHeader.appendChild(document.createTextNode("Roles"))


    processHeader.appendChild(processTypeHeader)
    processHeader.appendChild(rolesHeader)


    // ---------------- LIST OF PROCESES -------------------- //

    let processesListContainer = document.createElement("div")
    processesListContainer.setAttribute("class", "processes-list-container")
    
    let processTypes = getKeys(returnValue)
    processTypes.forEach(pt => {
        let processesList = returnValue[pt]
        let Roles = getAttributes(processesList)
        processesList.forEach(p => {
            let processRowContainer = document.createElement("div")
            processRowContainer.setAttribute("class", "process-row-container")

            let processTypeContainer = document.createElement("div")
            processTypeContainer.setAttribute("class", "process-type-container")
            processTypeContainer.appendChild(document.createTextNode(pt))

            let processRolesContainer = document.createElement("div")
            processRolesContainer.setAttribute("class", "process-roles-container")


            Roles.forEach(role => {
                let processRoleContainer = document.createElement("div")
                processRoleContainer.setAttribute("class", "process-role")
                processRoleContainer.appendChild(document.createTextNode(p[role]))
                processRolesContainer.appendChild(processRoleContainer)
            })

            processRowContainer.appendChild(processTypeContainer)
            processRowContainer.appendChild(processRolesContainer)

            processesListContainer.appendChild(processRowContainer)

        })

    })

  // BUTTON TO RETURN TO THE FUNCTIONALITY BUTTONS
  let returnContainer = document.createElement("div")
  returnContainer.setAttribute("class", "return-button-container")
  let returnButton = document.createElement("button")
  returnButton.setAttribute("id", "returnButton")
  returnButton.appendChild(document.createTextNode("Return"))

  returnContainer.appendChild(returnButton)

  returnButton.addEventListener("click", (evt) => {
    evt.preventDefault()
    ResultsContainer.innerHTML = ""
  })


  ResultsContainer.appendChild(processHeader)
  ResultsContainer.appendChild(processesListContainer)
  ResultsContainer.appendChild(returnContainer)

})

