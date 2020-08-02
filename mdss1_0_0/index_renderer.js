// -----------------------------------REQUIREMENTS--------------------------------------------------------- //
const vis = require('vis-network/standalone/umd/vis-network')
const fs = require("fs")
let graphFile = './graph.json' 
let graph = require(graphFile)
let actionLibrary = require('./actionLibrary.json')
let processes = require('./processes.json')
const {forwardPropagation, diagnose, getActions} = require("./diagnosis/diagnosis")

// graph = {
//   nodes: [],
//   edges: [], 
//   data: []
// }

const properties = document.getElementById("nodeProperties")
const container = document.getElementById('graph')
const addPropertyBtn = document.getElementById("addProperty")
const savePropertiesBtn = document.getElementById("saveProperties")

const resultsContainer = document.getElementById("resultsContainer")
const resultsButtonsContainer = document.getElementById("resultsButtonsContainer")
const saveContentButton = document.getElementById("saveContentButton")
const processListButton = document.getElementById("processListButton")
const situationAssessmentButton = document.getElementById("situationAssessmentButton")
const therapyProposalButton = document.getElementById("therapyProposalButton")

let processInstancesList

// --------------------------------------------------------------------------------------------------- //

// ---------------------------------FUNCTIONS--------------------------------------------------------- //
function addProperty(attribute="", value=""){

  let propertyDiv = document.createElement("div")
  propertyDiv.setAttribute("class", "property")
  let attributeDiv = document.createElement('div')
  attributeDiv.setAttribute("class", "attribute")
  let valueDiv = document.createElement('div')
  valueDiv.setAttribute("class", "value")
  let deleteDiv = document.createElement('div')
  deleteDiv.setAttribute("class", "delete-property-div")

  let attributeInput = document.createElement("input")
  attributeInput.setAttribute("type", "text")
  attributeInput.setAttribute("class", "attribute")
  attributeInput.setAttribute("value", attribute)
  let valueInput = document.createElement("input")
  valueInput.setAttribute("type", "text")
  valueInput.setAttribute("class", "value")
  valueInput.setAttribute("value", value)
  let deleteButton = document.createElement("button")
  deleteButton.setAttribute("class", "delete-property")
  let deleteText = document.createTextNode("Del")
  deleteButton.appendChild(deleteText)

  if(attribute === "id"){
    attributeInput.setAttribute("disabled","")
    valueInput.setAttribute("disabled","")
    deleteButton.setAttribute("disabled","")
  }
  if(attribute === "label"){
    attributeInput.setAttribute("disabled", "")
    deleteButton.setAttribute("disabled", "")
  }
  if(attribute === "group"){
    attributeInput.setAttribute("disabled", "")
    deleteButton.setAttribute("disabled", "")
  }
  if(attribute === "from"){
    attributeInput.setAttribute("disabled", "")
    valueInput.setAttribute("disabled","")
    deleteButton.setAttribute("disabled", "")
  }
  if(attribute === "to"){
    attributeInput.setAttribute("disabled", "")
    valueInput.setAttribute("disabled","")
    deleteButton.setAttribute("disabled", "")
  }


  attributeDiv.appendChild(attributeInput)
  valueDiv.appendChild(valueInput)
  deleteDiv.appendChild(deleteButton)
  
  propertyDiv.appendChild(attributeDiv)
  propertyDiv.appendChild(valueDiv)
  propertyDiv.appendChild(deleteDiv)

  properties.appendChild(propertyDiv)

  attributeInput.addEventListener("change", (evt) => {
    evt.preventDefault()
    attributeInput.value = evt.target.value
  })

  valueInput.addEventListener("change", (evt) => {
    evt.preventDefault()
    valueInput.value = evt.target.value
  })


  deleteButton.addEventListener('click', (evt) => {
    evt.preventDefault()
    properties.removeChild(propertyDiv)
  })

  // valueInput.addEventListener("keypress", (evt) => {
  //   evt.preventDefault()
  //   if(evt.keyCode === 13){
  //     addProperty()
  //   }
  // })

}

function saveGraph(graphFile, graph){
  fs.writeFile(graphFile, JSON.stringify(graph), function writeJSON(err) {
    if(err) return console.log(err)
    console.log("writting to: " + graphFile)
  })

}

function getSubset(objList, keyList){
  if(!objList || objList.length === 0) return;
  else{
      if(!keyList || keyList.length === 0) return;
      let keysExist = keyList.every(key => Object.keys(objList[0]).includes(key));
      if(!keysExist) return;
      else{
          let returnObjList = objList.map(obj => {
              let objSubset = {};
              keyList.forEach((key) => {
                  objSubset[key] = obj[key];
              })

              return objSubset;
          })

          return returnObjList;
      }
  }
}


function Join(objList1, objList2, key1, key2){
  if(!Object.keys(objList1[0]).includes(key1) || !Object.keys(objList2[0]).includes(key2)) return;
  else{
      let returnJoin = [];
      objList1.forEach( o1 => {
          objList2.forEach( o2 => {
              
              let satisfied = true ? o1[key1] === o2[key2] : false;
              if(satisfied === true){
                  returnJoin.push(Object.assign({}, o1, o2));
              }
          })
      })
      return returnJoin;
  }
}

function displayPlan(plan) {
  let ActionList = document.createElement("div");

  plan.forEach(action => {
    let actionContainer = document.createElement("div");
    actionContainer.setAttribute("class", "action-container")
    
    let SEName = document.createElement("div");
    SEName.setAttribute("class", "se-name")
    SEName.appendChild(document.createTextNode(action["label"]))
    let actionName = document.createElement("div")
    actionName.setAttribute("class", "action-name")
    actionName.appendChild(document.createTextNode(action["Action"]))

    actionContainer.appendChild(SEName)
    actionContainer.appendChild(actionName)
    ActionList.appendChild(actionContainer)
  })
  return ActionList
}

function findObject(objList, subObject){
  if(!objList || objList.length === 0) return;

  let objListKeys = Object.keys(objList[0])
  let subObjectKeys = Object.keys(subObject)
  if(!subObjectKeys.every(key => objListKeys.includes(key))) return;

  let matchedObjects = objList.filter(obj => 
    subObjectKeys.every(key => obj[key] === subObject[key])
  )

  if(!matchedObjects || matchedObjects.length === 0) return ;

  return matchedObjects;

}



function removeDuplicateRecords(objList){

  let returnObjectList = []

  objList.forEach(obj => {
    let exists = true
    if(!findObject(returnObjectList, obj) || findObject(returnObjectList, obj).length === 0)
      exists = false
    if(exists === false){
      returnObjectList.push(obj)
    }
  })

  return returnObjectList
}


// --------------------------------------------------------------------------------------------------- //


// -----------------------------------------NETWORK DATA---------------------------------------------- //


let nodes = new vis.DataSet(graph.nodes)
let edges = new vis.DataSet(graph.edges)

let data = {
    nodes: nodes,
    edges: edges
}
// ADD THE APPROPRIATE MENU TO THE MAIN PROCESS AND ADDING PROCESSES
let options = {
    interaction: { hover: true },
    manipulation: {
      enabled: true,
      addNode: function(nodeData, callback){
        
        let node = {id:nodeData.id, label:"Unknown", group: ""}
        properties.innerHTML = ""
        addProperty("id", node.id)
        addProperty("label", node.label)
        addProperty("group", "")
        graph.nodes.push(node)
        graph.data.push(node)
        callback(node)
      },
      addEdge: function(edgeData, callback){

        let edge = {id: edgeData.id, from: edgeData.from, to: edgeData.to, label: "connectedTo"}
        properties.innerHTML = ""
        addProperty("id", edgeData.id)
        addProperty("from", edgeData.from)
        addProperty("to", edgeData.to)
        addProperty("label", "connectedTo")
        graph.edges.push(edge)
        callback(edge)
      },
      deleteNode: function(selected, callback){
        let nodes = selected.nodes
        if(nodes.length > 0){
          graph.data = graph.data.filter(n => !nodes.includes(n.id))
          graph.nodes = graph.nodes.filter(n => !nodes.includes(n.id))
          properties.innerHTML = ""
          callback(selected)
        }
      },
      deleteEdge: function(selected, callback){
        edges = selected.edges
        // console.log(edges)
        // if(edges.length > 0){
          // graph.edges = graph.edges.filter(e => !edges.includes(e.))
        // }
      }
    },
    physics: {
      enabled: false,
    },
    edges: {
      arrows: {
        to:{
          enabled: true
        }
      }
    },
    nodes: {
      color: { background: "#E27D60", border: "#E27D60" }
    }
}

// --------------------DISPLAYING THE NETWORK-------------------- //
let network = new vis.Network(container, data, options)

// --------------------EVENTS-------------------- //

network.on("selectNode", function(event) {
  let { nodes } = event
  console.log(nodes)
  if(nodes.length > 0){
    properties.innerHTML = ""
    let node = graph.data.filter(n => n.id === nodes[0])
    if(node){
      node = node[0]
      Object.keys(node).forEach(p => {
        addProperty(p, node[p])
      })
    }
  }
})

network.on("selectEdge", function(event) {
  let { nodes ,edges } = event
  if(edges.length > 0 && nodes.length === 0){
    properties.innerHTML = ""
    let edge = graph.edges.filter(e => e.id === edges[0])
    if(edge){
      edge = edge[0]
      Object.keys(edge).forEach(p => {
        addProperty(p, edge[p])
      })
    }
  }
})

network.on("deselectNode", function(event) {
  properties.innerHTML = ""
})
network.on("deselectEdge", function(event){
  properties.innerHTML = ""
})


// network.on("click", function( params ){
//   console.log(params)
// })

// --------------------------------------------------------------------------------------------------- //


// --------------- ADD A PROPERTY TO PROPERTIES DIVISION ------------------- //

addPropertyBtn.addEventListener('click', (evt) => {
  evt.preventDefault()
  addProperty()
})


// --------------- SAVE PROPERTIES TO THE GRAPH FOR NODES AND EDGES ------------------- //



savePropertiesBtn.addEventListener('click', (evt) => {
  evt.preventDefault()

  let props = {}
  properties.childNodes.forEach(prop => {
    let attr = prop.querySelector("input.attribute").value
    let val =  prop.querySelector("input.value").value
    if(attr.length > 0 && val.length > 0){
      props[attr] = val
    }
  })
  let found
  // IF THE PROPERTIES ARE OF A NODE
  found = graph.nodes.filter(n => props.id === n.id).length === 0 ? false : true

  console.log(found)
  if(found){
    let node = {id: props.id, label: props.label, group: props.group}
    
    graph.data = graph.data.map(n => {
      if(n.id === props.id){
        return props
      }
      return n
    })
    
    graph.nodes = graph.nodes.map(n => {
      if(n.id === node.id){
        return node
      }
      return n
    })
    if(node.id !== undefined && node.label !== undefined){
      nodes.update(node)
    }
  }else{
    // IF THE PROPERTIES ARE OF AN EDGE
    found = graph.edges.filter(e => props.id === e.id).length === 0 ? false : true 
    if(found){
      let edge = {id: props.id, from: props.from, to: props.to, label: props.label}

      graph.edges = graph.edges.map(e => {
        if(e.id === props.id){
          return props
        }
        return e
      })

      if(props.id !== undefined && props.from !== undefined && props.to !== undefined){
        edges.update(edge)
      }
    }
  }
  properties.innerHTML = ""

})


// --------------- SAVE CONTENT ACTIVITY ------------------- //
saveContentButton.addEventListener("click", (evt) => {
  evt.preventDefault()
  
  saveGraph(graphFile, graph)

  // when changing the screen. execute this so as to save the updated values

  // change the diagnostic engine, making it domain independent

})



// --------------- PROCESS LIST ACTIVITY ------------------- //

processListButton.addEventListener("click", (evt) => {
  evt.preventDefault()

  resultsButtonsContainer.style.display = "none"
  resultsContainer.style.display = "block"


  let structure = {
    data: graph.data, 
    edges: graph.edges,
    nodes: graph.nodes,
  }
  
  processInstancesList = forwardPropagation(processes, structure)

  // --------------- HEADER FOR RESULTS PROCESSES ------------- //
  let processHeader = document.createElement("div")
  processHeader.setAttribute("class", "process-header")
  
  let processNameHeader = document.createElement("div")
  processNameHeader.setAttribute("class", "process-name-header")
  processNameHeader.appendChild(document.createTextNode("Process"))

  let componentsHeader = document.createElement("div")
  componentsHeader.setAttribute("class", "components-header")
  componentsHeader.appendChild(document.createTextNode("Components"))


  processHeader.appendChild(processNameHeader)
  processHeader.appendChild(componentsHeader)


  // ---------------- LIST OF PROCESES -------------------- //

  let processList = document.createElement("div")
  processList.setAttribute("class", "process-list")
  
   
  processInstancesList.processes.map((p) => {
    // console.log(p)
    let processDiv = document.createElement("div")
    processDiv.setAttribute("class", "process")

    let processName = document.createElement("div")
    processName.setAttribute("class", "process-name")
    processName.appendChild(document.createTextNode(p.process))
    let processSource = document.createElement("div")
    processSource.setAttribute("class", "process-source")
    processSource.appendChild(document.createTextNode(p.source.label))
    let processDestination = document.createElement("div")
    processDestination.appendChild(document.createTextNode(p.destination.label))
    processDestination.setAttribute("class", "process-destination")

    processDiv.appendChild(processName)
    processDiv.appendChild(processSource)
    processDiv.appendChild(processDestination)

    processList.appendChild(processDiv)

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

    resultsButtonsContainer.style.display = "block"
    resultsContainer.innerHTML = ""
    resultsContainer.style.display = "none"


  })


  resultsContainer.appendChild(processHeader)
  resultsContainer.appendChild(processList)
  resultsContainer.appendChild(returnContainer)

  // console.log(resultsContainer)

})


// ------------------ SITUATION ASSESSMENT BUTTON --------------------- //
situationAssessmentButton.addEventListener("click", (evt) => {
  evt.preventDefault()
  

  let structure = {
    data: graph.data, 
    edges: graph.edges,
    nodes: graph.nodes,
  }
  
  
  processInstancesList = forwardPropagation(processes, structure)

  structure = processInstancesList.data
  
  let possibleFaultyComponents = diagnose(structure)
  if(!possibleFaultyComponents || possibleFaultyComponents.length === 0) {
    alert("No Faulty Component Present in the Situation")
    return;
  }

  // Show results in GUI

  resultsButtonsContainer.style.display = "none"
  resultsContainer.style.display = "block"
  
  let faultyHeading = document.createElement("div")
  faultyHeading.setAttribute("class", "faulty-header")
  faultyHeading.appendChild(document.createTextNode("Faulty Components"))
  resultsContainer.appendChild(faultyHeading)
  
  console.log("Faulty: ")
  console.log(possibleFaultyComponents)
  possibleFaultyComponents.forEach((comp) => {

    let componentContainer = document.createElement("div")
    componentContainer.setAttribute("class", "faulty-component")
    componentContainer.appendChild(document.createTextNode(comp.label))
    resultsContainer.appendChild(componentContainer)

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

    resultsButtonsContainer.style.display = "block"
    resultsContainer.innerHTML = ""
    resultsContainer.style.display = "none"


  })

  resultsContainer.appendChild(returnContainer)


})

// ------------------ THERAPY PROPOSAL BUTTON ------------------------ //
therapyProposalButton.addEventListener("click", (evt) => {
  evt.preventDefault()

  let structure = {
    data: graph.data, 
    edges: graph.edges,
    nodes: graph.nodes
  }

  processInstancesList = forwardPropagation(processes, structure)

  structure = processInstancesList.data
  
  let possibleFaultyComponents = diagnose(structure)
  if(!possibleFaultyComponents || possibleFaultyComponents.length === 0) {
    alert("No Faulty Component Present in the Situation")
    return;
  }

  let actionList = getActions(actionLibrary["actionLibrary"], possibleFaultyComponents)
  if(!actionList || actionList.length === 0){
    alert("No Possible actions available in Action Library")
    return;
  }
  actionList = [...actionList.filter(actions => actions.length !== 0)]
  // Get Combinations
  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

  // getting the actions join with the SEType of Components they are meant for
  
  let planOptions = cartesian(...actionList)
  
  planOptions = planOptions.map(plan => {
    let planBinding = Join(plan, possibleFaultyComponents, "SEType", "group")
    planBinding = getSubset(planBinding, ["label","group", "Action"])
    return planBinding;
  })




  // Show the list of plans In GUI
  resultsButtonsContainer.style.display = "none"
  resultsContainer.style.display = "block"    

// heading
  let planHeading = document.createElement("div")
  planHeading.setAttribute("class", "plans-header")
  planHeading.appendChild(document.createTextNode("Plans"))
  resultsContainer.appendChild(planHeading)
// list of plans 
  let planList = document.createElement("div")

  for(let i =0 ;i< planOptions.length; i++){
    let planNameContainer = document.createElement("div")
    planNameContainer.setAttribute("class", "plan-name")
    planNameContainer.appendChild(document.createTextNode("Plan: " + i))
    
    // plan details
    
    planNameContainer.addEventListener("click", (evt) => {
      resultsContainer.innerHTML = ""

      planHeading.innerHTML = ""
      let SEHeading = document.createElement("div")
      SEHeading.setAttribute("class", "se-heading")
      SEHeading.appendChild(document.createTextNode("Component"))
      let ActionNameHeading = document.createElement("div")
      ActionNameHeading.setAttribute("class", "action-name-heading")
      ActionNameHeading.appendChild(document.createTextNode("Action"))
      
      planHeading.appendChild(SEHeading)
      planHeading.appendChild(ActionNameHeading)
      let plan = removeDuplicateRecords(planOptions[i])
      console.log(plan)
      let planDisplay = displayPlan(plan)

      // BUTTON TO RETURN TO THE Plan Options

      let returnContainer = document.createElement("div")
      returnContainer.setAttribute("class", "return-button-container")
      let returnButton = document.createElement("button")
      returnButton.setAttribute("id", "returnButton")
      returnButton.appendChild(document.createTextNode("Return"))

      returnContainer.appendChild(returnButton)

      returnButton.addEventListener("click", (evt) => {
        evt.preventDefault()

        resultsContainer.innerHTML = ""
        let planHeading = document.createElement("div")
        planHeading.setAttribute("class", "plans-header")
        planHeading.appendChild(document.createTextNode("Plans"))
        resultsContainer.appendChild(planHeading)
        resultsContainer.appendChild(planList)

          // BUTTON TO RETURN TO THE FUNCTIONALITY BUTTONS

          let returnContainer = document.createElement("div")
          returnContainer.setAttribute("class", "return-button-container")
          let returnButton = document.createElement("button")
          returnButton.setAttribute("id", "returnButton")
          returnButton.appendChild(document.createTextNode("Return"))

          returnContainer.appendChild(returnButton)

          returnButton.addEventListener("click", (evt) => {
            evt.preventDefault()

            resultsButtonsContainer.style.display = "block"
            resultsContainer.innerHTML = ""
            resultsContainer.style.display = "none"


          })

          resultsContainer.appendChild(returnContainer)
          


      })


      resultsContainer.appendChild(planHeading)
      resultsContainer.appendChild(planDisplay)
      resultsContainer.appendChild(returnContainer)
    })

    planList.appendChild(planNameContainer)
  }


  resultsContainer.appendChild(planList)
  
  // BUTTON TO RETURN TO THE FUNCTIONALITY BUTTONS

  let returnContainer = document.createElement("div")
  returnContainer.setAttribute("class", "return-button-container")
  let returnButton = document.createElement("button")
  returnButton.setAttribute("id", "returnButton")
  returnButton.appendChild(document.createTextNode("Return"))

  returnContainer.appendChild(returnButton)

  returnButton.addEventListener("click", (evt) => {
    evt.preventDefault()

    resultsButtonsContainer.style.display = "block"
    resultsContainer.innerHTML = ""
    resultsContainer.style.display = "none"


  })

  resultsContainer.appendChild(returnContainer)
  

})