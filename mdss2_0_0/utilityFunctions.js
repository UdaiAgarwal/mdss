// ----- UTILITY FUNCTIONS ----- //
const getAttributesFromGUI = (headingElement) => {
    let headingsContainer = headingElement.querySelector("tr")
    if(!headingsContainer) return []
    let attributeContainers = headingsContainer.querySelectorAll("th")
    let attributes = []
    attributeContainers.forEach(attr => attributes.push(attr.innerHTML))
    return attributes
}


const getRecords = (recordsContainer, attributes) => {
    let records = recordsContainer.querySelectorAll("tr")
    let allRecords = []
    records.forEach(rec => {
        let record = {}
        let recValues = rec.querySelectorAll("td")
        recValues.forEach((val, idx) => {
            let inputTag = val.querySelector("input")
            if(inputTag)
                record[attributes[idx]] = inputTag.value
        })
        allRecords.push(record)
    })
    
    return allRecords    
}

const addNewRecord = (recordsContainer, attributes) => {
    let cellCount = attributes.length
    let row = document.createElement("tr")
    for(let i=0;i<cellCount; i++){
        let cell = document.createElement("td")

        let input = document.createElement("input")
        input.setAttribute("type","text")
        input.setAttribute("placeholder", attributes[i])
        input.setAttribute("required", "required")
        
        cell.appendChild(input)
        row.appendChild(cell)
    }

    let cell = document.createElement("td")
    let delButton = document.createElement("button")
    delButton.setAttribute("class", "delete-row-button")
    delButton.appendChild(document.createTextNode("X"))
    delButton.addEventListener("click", (evt) => {
        evt.preventDefault()
        recordsContainer.removeChild(row)
    })

    cell.appendChild(delButton)
    row.appendChild(cell)
    recordsContainer.appendChild(row)
}

const showRecords = (recordsContainer, records, attributes) => {
    
    records.forEach(record => {
        let row = document.createElement("tr")
        attributes.forEach(attr => {
            let cell = document.createElement("td")

            let input = document.createElement("input")
            input.setAttribute("type","text")
            input.setAttribute("placeholder", attr)
            input.setAttribute("required", "required")
            input.setAttribute("value", record[attr] ? record[attr] : "")
            
            cell.appendChild(input)
            row.appendChild(cell)
        })    

        let cell = document.createElement("td")
        cell.setAttribute("class", "delete-button-container")
        let delButton = document.createElement("button")
        delButton.setAttribute("class", "delete-row-button")
        delButton.appendChild(document.createTextNode("X"))
        delButton.addEventListener("click", (evt) => {
            evt.preventDefault()
            recordsContainer.removeChild(row)
        })

        cell.appendChild(delButton)
        row.appendChild(cell)
        recordsContainer.appendChild(row)
    
    })
}

module.exports = { getAttributesFromGUI, getRecords, addNewRecord, showRecords }