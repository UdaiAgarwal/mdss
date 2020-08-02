const fs = require("fs")
let processesFile = "./processes.json"
let processes = require(processesFile)


function createObject(object){

    // ------ OBJECT CONTAINER ------
    let objectContainer = document.createElement("div")
    objectContainer.setAttribute("class", "object-container")

    // ------ HEADING (KEY)------
    let objectHeadingContainer = document.createElement("div")
    objectHeadingContainer.setAttribute("class", "object-heading-container")

    let objectHeadingInput = document.createElement("input")
    objectHeadingInput.setAttribute("class", "object-heading-input")
    objectHeadingInput.setAttribute("placeholder", "Relation")

    objectHeadingInput.setAttribute("value", Object.keys(object)[0])
    objectHeadingContainer.appendChild(objectHeadingInput)

    objectHeadingInput.addEventListener("change", (evt) => {
        evt.preventDefault()
        objectHeadingInput.value = evt.target.value
    })


    // ------ ADD NEW VALUE -----
    let newValueInputContainer = document.createElement("div")
    newValueInputContainer.setAttribute("class", "new-value-input-container")

    let objectValueListContainer = document.createElement("div")
    objectValueListContainer.setAttribute("class", "object-value-list-container")

    let newValueInput = document.createElement("input")
    newValueInput.setAttribute("class", "new-value-input")
    newValueInput.setAttribute("placeholder", "Enter New Value")

    newValueInputContainer.appendChild(newValueInput)

    newValueInput.addEventListener("change", (evt) => {
        evt.preventDefault()
        newValueInput.value = evt.target.value
    })

    newValueInput.addEventListener("keypress", (evt) => {
        let keyCode = evt.keyCode || evt.which
        if(keyCode === 13){
            let valueContainer = document.createElement("div")
            valueContainer.setAttribute("class", "value-container")

            let valueInput = document.createElement("input")
            valueInput.setAttribute("class", "value-input")
            valueInput.setAttribute("placeholder", "Role")

            valueInput.setAttribute("value", newValueInput.value)
    
            valueInput.addEventListener("change", (evt) => {
                evt.preventDefault()
                valueInput.value = evt.target.value
            })

            // ------ DELETE ONE VALUE ------
            let deleteValueButton = document.createElement("button")
            deleteValueButton.setAttribute("class", "delete-value-button")

            deleteValueButton.appendChild(document.createTextNode("Del"))

            deleteValueButton.addEventListener("click", (evt) => {
                evt.preventDefault()

                valueContainer.remove()

            })            
            valueContainer.appendChild(valueInput)
            valueContainer.appendChild(deleteValueButton)

            objectValueListContainer.appendChild(valueContainer)
            newValueInput.value = ""


        }

    })

    // ------ EXISTING VALUE ------
    object[Object.keys(object)[0]].forEach(value => {
        let valueContainer = document.createElement("div")
        valueContainer.setAttribute("class", "value-container")

        let valueInput = document.createElement("input")
        valueInput.setAttribute("class", "value-input")
        valueInput.setAttribute("placeholder", "Role")

        valueInput.setAttribute("value", value)

        valueInput.addEventListener("change", (evt) => {
            evt.preventDefault()
            valueInput.value = evt.target.value
        })

        // ------ DELETE ONE VALUE ------
        let deleteValueButton = document.createElement("button")
        deleteValueButton.setAttribute("class", "delete-value-button")

        deleteValueButton.appendChild(document.createTextNode("Del"))

        deleteValueButton.addEventListener("click", (evt) => {
            evt.preventDefault()

            valueContainer.remove()

        })

        valueContainer.appendChild(valueInput)
        valueContainer.appendChild(deleteValueButton)

        objectValueListContainer.appendChild(valueContainer)

    })


    // ------ DELETE BUTTON FOR COMPLETE OBJECT ------

    let deleteButtonContainer = document.createElement("div")
    deleteButtonContainer.setAttribute("class", "delete-object-button-container")

    let deleteButton = document.createElement("button")
    deleteButton.setAttribute("class", "delete-object-button")

    deleteButton.appendChild(document.createTextNode("Del Object"))
        
    deleteButton.addEventListener("click", (evt) => {
        evt.preventDefault()

        objectContainer.remove()
        

    })
    deleteButtonContainer.appendChild(deleteButton)


    objectContainer.appendChild(objectHeadingContainer)
    objectContainer.appendChild(newValueInputContainer)
    objectContainer.appendChild(objectValueListContainer)
    objectContainer.appendChild(deleteButtonContainer)

    return objectContainer
    
}


function createObjectList(objectList){
    let objectListContainer = document.createElement("div")
    objectListContainer.setAttribute("class", "object-list-container")
    
    objectList.forEach(object => {
        let objectContainer = createObject(object)

        objectListContainer.appendChild(objectContainer)
    })

    return objectListContainer
}


function createSection(heading, objectList){
    let mainContainer = document.createElement("div")
    mainContainer.setAttribute("class", "process-section")

    let headingContainer = document.createElement("div")
    headingContainer.setAttribute("class", "section-heading")
    headingContainer.appendChild(document.createTextNode(heading))
    
    // ------ OBJECT LIST FROM A SECTION ------

    let objectListContainer = createObjectList(objectList)


    // ------ ADDING NEW BLANK OBJECT ------

    let newObjectButtonDiv = document.createElement("div")
    newObjectButtonDiv.setAttribute("class", "add-object-button-container")

    let newObjectButton = document.createElement("button")
    newObjectButton.setAttribute("class", "add-object-button")

    newObjectButton.appendChild(document.createTextNode("Add"))
    newObjectButtonDiv.appendChild(newObjectButton)


    newObjectButton.addEventListener("click", (evt) => {
        evt.preventDefault()
        let newObject = {"" : []}

        let objectContainer = createObject(newObject)
        objectListContainer.appendChild(objectContainer)

    })

    mainContainer.appendChild(headingContainer)
    mainContainer.appendChild(objectListContainer)
    mainContainer.appendChild(newObjectButtonDiv)
    

    return mainContainer

}


function createProcess(process){
    let processContainer = document.createElement("div")
    processContainer.setAttribute("class", "process-card")

    let headingContainer = document.createElement("div")
    headingContainer.setAttribute("class", "process-heading-container")

    let headingInput = document.createElement("input")
    headingInput.setAttribute("class", "process-heading-input")
    headingInput.setAttribute("value", process.type)
    headingContainer.appendChild(headingInput)

    let rolesContainer = createSection("Roles", process["roles"])
    let structuralConditionsContainer = createSection("Structural Conditions", process["structural_conditions"])
    let quantitativeConditionsContainer = createSection("Quantitative Conditions", process["quantitative_conditions"])
    let structuralEffectsContainer = createSection("Structural Effects", process["structural_effects"])
    let quantitativeEffectsContainer = createSection("Quantitative Effects", process["quantitative_effects"])

    // ------ PROCESS BUTTONS CONTAINER ------

    let processButtonContainer = document.createElement("div")
    processButtonContainer.setAttribute("class", "process-button-container")

    // ------ DELETE PROCESS BUTTON ------
    
    let deleteProcessButton = document.createElement("button")
    deleteProcessButton.setAttribute("class", "delete-process-button")

    deleteProcessButton.appendChild(document.createTextNode("Del Process"))

    deleteProcessButton.addEventListener("click", (evt) => {
        evt.preventDefault()
        
        processContainer.remove()

    })


    processButtonContainer.appendChild(deleteProcessButton)

    // ------ SAVE PROCESS BUTTON ------

    let saveProcessButton = document.createElement("button")
    saveProcessButton.setAttribute("class", "save-process-button")

    saveProcessButton.appendChild(document.createTextNode("Save Process"))

    saveProcessButton.addEventListener("click", (evt) => {
        evt.preventDefault()
        let thisProcess = {
            "type":"",
            "roles":[],
            "structural_conditions":[],
            "quantitative_conditions":[],
            "structural_effects":[],
            "quantitative_effects":[]
        }

        thisProcess["type"] = headingInput.value

        processContainer.querySelectorAll(".process-section").forEach(section => {
            
            let sectionName = section.querySelector(".section-heading").innerHTML

            let objectList = []

            section.querySelectorAll(".object-container").forEach(object => {
                let relation = object.querySelector(".object-heading-input").value
                let valueList = []
                object.querySelectorAll("input.value-input").forEach(inp => {
                    valueList.push(inp.value)
                })
                let obj = {}
                obj[relation] =  valueList
                objectList.push(obj)

            })

            if(sectionName === "Roles"){
                thisProcess["roles"] = objectList
            }else{
                if(sectionName === "Structural Conditions"){
                    thisProcess["structural_conditions"] = objectList
                }else{
                    if(sectionName === "Quantitative Conditions"){
                        thisProcess["quantitative_conditions"] = objectList
                    }else{
                        if(sectionName === "Structural Effects"){
                            thisProcess["structural_effects"] = objectList
                        }else{
                            if(sectionName === "Quantitative Effects"){
                                thisProcess["quantitative_effects"] = objectList
                            }
                        }
                    }
                }
            }

        })

        processes["processes"] = processes["processes"].map(process => {
            if(process["type"] === thisProcess["type"]){
                return thisProcess
            }
            return process
        })
        
        fs.writeFile(processesFile, JSON.stringify(processes), function writeJSON(err) {
            if(err) return console.log(err)
            console.log("writting to: " + processesFile)
        })
        
    })

    processButtonContainer.appendChild(saveProcessButton)


    // ------ ADD EVERYTHING TO THE PROCESS ------

    processContainer.appendChild(headingContainer)
    processContainer.appendChild(rolesContainer)
    processContainer.appendChild(structuralConditionsContainer)
    processContainer.appendChild(quantitativeConditionsContainer)
    processContainer.appendChild(structuralEffectsContainer)
    processContainer.appendChild(quantitativeEffectsContainer)
    processContainer.appendChild(processButtonContainer)
    
    return processContainer

}

// ------ PROCESSES TO THE MAIN CONTAINER ------

const processesContainer = document.querySelector("#processes")


processes.processes.forEach(process => {
    let processCard = createProcess(process)
    processesContainer.appendChild(processCard)
})

// ------ ADD A NEW BLANK PROCESS TO THE LIST ------


let blankProcess = {
    "type":"",
    "roles":[],
    "structural_conditions":[],
    "quantitative_conditions":[],
    "structural_effects":[],
    "quantitative_effects":[]
}



const addProcessButton = document.querySelector("#addProcessButton")
addProcessButton.addEventListener("click", (evt) => {
    evt.preventDefault()

    let blankProcessCard = createProcess(blankProcess)
    
    processesContainer.appendChild(blankProcessCard)



})