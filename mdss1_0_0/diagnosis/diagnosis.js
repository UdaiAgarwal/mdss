const {structuralConditions, quantitativeConditions, structuralEffects} = require('./helperFunctions')

// cartesian product
function combos(objectRoles){
    let objects = Object.values(objectRoles)
    let combinations = cartesian(objects[0], objects[1])

    return combinations
}
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);



function forwardPropagation(processes, data){

    // let procs = processes.processes.filter(process => process.type === "flow_from_container_to_pump")
    let procs = processes.processes
    let happening_processes = []
    procs.forEach(process => {
        let objectRoles = []
        process.roles.forEach(role => {
            objectRoles[Object.keys(role)[0]] = data.data.filter(node => 
                Object.values(role)[0].includes(node.group))
        })

        let combinations = combos(objectRoles)
        let roles = Object.keys(objectRoles)

        combinations = combinations.map(c => {
            let objects = {}
            for(let i = 0 ; i< roles.length ; i++){
                objects[roles[i]] = c[i]
            }

            // Check if structural conditions are satisfied for the process
            let satisfied = true
            objects["process"] = process.type
            for(let i = 0; i< process.structural_conditions.length; i++){
                satisfied = structuralConditions(data, objects, process.structural_conditions[i])
                if(satisfied){
                    // Check for quantitative conditions HERE *****************
                    for(let j = 0; j< process.quantitative_conditions.length; j++){
                        satisfied = quantitativeConditions(objects, process.quantitative_conditions[j])
                        if(satisfied){
                            objects["process"] = process.type
                        }else{
                            objects["process"] = false
                            break
                        }
                    }
                    if(objects["process"] === false){
                        break
                    }
                }
                else{
                    objects["process"] = false
                    break
                }
            }

            // Check if quantity conditions are satisfied for the process
            if(objects["process"] !== false){
                data = structuralEffects(data, objects, process.structural_effects)
            }
            return objects

        })
        
        combinations = combinations.filter(c => c.process !== false)
        combinations.forEach(c => happening_processes.push(c))

    })
    let id = 0
    happening_processes = happening_processes.map(p => {
        p.id=id++
        return p
    })
    let returnedData = {
        processes: happening_processes, 
        data: data
    }
    return(returnedData)

}





function backwardPropagation(data, objectId){
    // INITIAL OBJECT IS THE OUTLET THAT IS NOT HAVING WATER

    let all_connected_elements = [objectId]
    let index = 0
    while(true){

        // eslint-disable-next-line no-loop-func
        let cur_sources = data.edges.filter(e => e.to === all_connected_elements[index])
        cur_sources = cur_sources.map(c => c.from)
        

        cur_sources.forEach(s => {
            if(!all_connected_elements.includes(s)){
                all_connected_elements.push(s)
            }
        })


        index += 1
        if( index >= all_connected_elements.length ){
            break
        }
    
    
    }

    return all_connected_elements

}


// Based on the goal - In This case the goal is to have water in all outlets
function diagnose(data){
    let outlets = data.data.filter(obj => obj.group === "outlet")

    let possibleFaults = []

    outlets.forEach(o => {
        if(o.water_exists > 0){
            // DO NOTHING
        }else{
            let path = backwardPropagation(data, o.id)

            let path_objects = data.data.filter(obj => path.includes(obj.id))

            let faulty = path_objects.filter(obj => {
                if(obj["group"] === "tank" || obj["group"] === "source"){
                    if(!(obj["water_level"] > 0)){
                        return obj
                    }
                }else{
                    if(!(obj["water_exists"] > 0)){
                        return obj
                    }
                }
            })

            faulty.map(obj => {
                if(possibleFaults.filter(fltyObj => fltyObj.id === obj.id).length === 0){
                    possibleFaults.push(obj)
                }
            })
        }
    })
    return possibleFaults
}



// return the possible actions for the diagnosed faults
function getActions(actionLibrary, faulty){

    let actionList = []
    faulty.forEach(fltyObj => {
        let actions = actionLibrary.filter(action => action["SEType"] === fltyObj["group"])
        actionList.push(actions)
    })

    return actionList
}


// forwardPropagation(processes, data)
module.exports = {forwardPropagation, diagnose, getActions}