function structuralConditions(data, objects, condition){
    let relation = Object.keys(condition)[0]
    if(relation === "connectedTo"){
        let connection = data.edges.filter(e => e.from === objects[Object.values(condition)[0][0]].id && e.to === objects[Object.values(condition)[0][1]].id)
        if(connection.length > 0){
            return true
        }else{
            return false
        }
    }
    if(relation === "waterIn"){
        if(objects[Object.values(condition)[0][0]].group === "source" || objects[Object.values(condition)[0][0]].group === "tank"){
            if(objects[Object.values(condition)[0][0]].water_level > 0){ 
                return true
            }else{
                return false
            }
        }
        else{
            if(objects[Object.values(condition)[0][0]].group === "pump" || objects[Object.values(condition)[0][0]].group === "outlet"){
                if(objects[Object.values(condition)[0][0]].water_exists > 0){ 
                    return true
                }else{
                    return false
                }
            }
            else{
                // For any other component that is not considered yet
                return false
            }
        }
    }
}


function quantitativeConditions(objects, condition){
    let relation = Object.keys(condition)[0]
    if(relation === "pressure_difference"){
        let source_pressure = 0
        let destination_pressure = 0
        if(objects[Object.values(condition)[0][0]].group === "source" || objects[Object.values(condition)[0][0]].group === "tank"){
            source_pressure = objects[Object.values(condition)[0][0]].area * objects[Object.values(condition)[0][0]].water_level
        }else{
            source_pressure = objects[Object.values(condition)[0][0]].discharge_pressure
        }

        if(objects[Object.values(condition)[0][1]].group === "source" || objects[Object.values(condition)[0][1]].group === "tank"){
            if(objects[Object.values(condition)[0][1]].water_level === objects[Object.values(condition)[0][1]].height)
            destination_pressure = objects[Object.values(condition)[0][1]].area*1;
            else
            destination_pressure = 0
        }else{
            if(objects[Object.values(condition)[0][1]].group === "pump"){
                destination_pressure = 0
            }else{
                destination_pressure = 0
            }
        }
        let pressure_difference = source_pressure - destination_pressure
        if(pressure_difference > 0)
            return true
        else
            return false
    }

}

function structuralEffects(data, objects, effects){
    effects.forEach(effect => {
        if(Object.keys(effect)[0] === "waterIn"){
            effect["waterIn"].forEach(role => {
                if(Object.keys(objects).includes(role)){
                    let updatedData = data.data.map(c => {
                        if(c.id === objects[role].id){
                            if(c.group === "source" || c.group === "tank"){
                                c.water_level = parseInt(c.water_level) + 1
                            }else{
                                c.water_exists = parseInt(1)
                            }
                        }
                        return c
                    })
                    data.data = updatedData
                }
            })
        }
    })
    return data
}



module.exports = {structuralConditions, quantitativeConditions, structuralEffects}