//  ***** List in the variable name is used whenever it is a list of values not objects ***** //


const {
    getKeys,
    getAttributes,
    getObject,
    getObjectList,
    getValueList,
    getSubset,
    naturalJoin,
    naturalJoinAll,
    getUnique,
    getUniqueObjectList,
    displayObjectList,
    getSubObject,
    getObjectUnion
} = require("./Utility")

let { RoleBinding, getNewInstance } = require("./RoleBinding")


function newInstancesStructural(newStructuralElements, preExistingStructuralElements, processTypeCandidates, data){

    let {LibraryType,
        TypeSubsumption,
        RoleRelation,
    } = data
    // Collect all the structural elements
    let allStructuralElements = preExistingStructuralElements
    newStructuralElements["SituationType"].forEach(se => (allStructuralElements["SituationType"].push(se)) )
    newStructuralElements["SituationRelation"].forEach(relation => (allStructuralElements["SituationRelation"].push(relation)) )
    
    
    let Candidates = {"TypeJoin": [], "RelationJoin": []}
    getUnique(getValueList(processTypeCandidates["TypeJoin"], "ProcessType")).forEach(processType => {
        getObjectList(LibraryType, {"ProcessType": processType}).forEach(process => Candidates["TypeJoin"].push(process))
    })
    getUnique(getValueList(processTypeCandidates["RelationJoin"], "ProcessType")).forEach(processType => {
        getObjectList(RoleRelation, {"ProcessType": processType}).forEach(process => Candidates["RelationJoin"].push(process))
    })

    // Identify processInstances
    let TypeJoin = naturalJoin(naturalJoin(Candidates["TypeJoin"],TypeSubsumption), allStructuralElements["SituationType"])
    let RelationJoin = naturalJoin(Candidates["RelationJoin"], allStructuralElements["SituationRelation"])

    // Take necessary attributes only
    TypeJoin = getSubset(TypeJoin, ["ProcessType","SERole", "SE"])
    RelationJoin = getSubset(RelationJoin, ["ProcessType","RoleRelation", "Relation", "SERole", "SE"])
    let prevRelationJoin = naturalJoin(RelationJoin, TypeJoin)
    // Relations are Eligible only if there is one new SE Relation to it
    let EligibleRelations = []
    RelationJoin.forEach(rel => {
        if(getObject(newStructuralElements["SituationType"], {"SE": rel["SE"]})){
            EligibleRelations.push(rel["Relation"])
        }
    })
    EligibleRelations = getUnique(EligibleRelations)
    RelationJoin = RelationJoin.filter(rel => (EligibleRelations.includes(rel["Relation"])))
    
    // Join to remove discripancies
    let existingRelationInstances = naturalJoin(TypeJoin, RelationJoin)
    // identify relations having the se in existingRelationInstances
    let relatedSE = existingRelationInstances.map(rel => rel["SE"])
    let relatedRelations = []
    prevRelationJoin.forEach(rel => {
        if(relatedSE.includes(rel["SE"])) relatedRelations.push(rel["Relation"])
    })
    relatedRelations = getUnique(relatedRelations)
    prevRelationJoin.forEach(rel => {
        if(relatedRelations.includes(rel["Relation"])) existingRelationInstances.push(rel)
    })

    let roleBinding = RoleBinding(existingRelationInstances)
    
    // Collect all processInstances
    let newForwardExtensionStructural = {}
    let processTypes = getUnique(getValueList(existingRelationInstances, "ProcessType"))
    processTypes.forEach(processType => {
        let requiredRoleRelations = getUnique(getValueList(getObjectList(RoleRelation, {"ProcessType": processType}), "RoleRelation"))
        let requiredSERoles = {}
        requiredRoleRelations.forEach(roleRelation => {
            requiredSERoles[roleRelation] = getUnique(getValueList(getObjectList(RoleRelation, {"ProcessType": processType, "RoleRelation": roleRelation}), "SERole"))
        })
        // Checking for correct relations -> relations with different SERoles in different processes may have same RoleRelations
        let structuralConditionRelations = getSubObject(roleBinding, requiredRoleRelations)
        
        if(structuralConditionRelations && getKeys(structuralConditionRelations).length > 0){
            getKeys(structuralConditionRelations).forEach(roleRelation => {
                structuralConditionRelations[roleRelation] = structuralConditionRelations[roleRelation]
                    .filter(relation => requiredSERoles[roleRelation].every(SERole => getKeys(relation).includes(SERole)) )
            })
            newForwardExtensionStructural[processType] = naturalJoinAll(structuralConditionRelations)
        }

        
    })

    return newForwardExtensionStructural

}

function effectsStructuralElements(newForwardExtensionStructural, preExistingStructuralElements, data, separator){
    let {LibraryTypeEffects,
        RelationTypeEffects
    } = data
    
    let newEffectsStructuralElements = {"SituationType": [], "SituationRelation": []}
    let newSituationTypeEffects = naturalJoin(LibraryTypeEffects, RelationTypeEffects)
    
    // SituationTypeStructuralElements
    getKeys(newForwardExtensionStructural).forEach(processType => {

        newForwardExtensionStructural[processType].forEach((processInstance,idx) => {
            
            let effects = getObjectList(newSituationTypeEffects, {"ProcessType": processType})
            effects.forEach(effect => {
                // LibraryTypeEffects
                let preExistingSE = getUnique(getValueList(getObjectList(preExistingStructuralElements["SituationType"], {"SEType": effect["SEType"]}), "SE"))
                getValueList(getObjectList(newEffectsStructuralElements["SituationType"], {"SEType": effect["SEType"]}), "SE").forEach(se => preExistingSE.push(se))
                let newInstanceName = getNewInstance(preExistingSE, effect["SEType"], separator)
                
                let situationName = (preExistingStructuralElements["SituationType"][0]) ? preExistingStructuralElements["SituationType"][0]["Situation"] : "Sit-1"
                let newInstance = {
                    "Situation": situationName,
                    "SE": newInstanceName,
                    "SEType": effect["SEType"]
                }
                newEffectsStructuralElements["SituationType"].push(newInstance)
                newForwardExtensionStructural[processType][idx][effect["SERole"]] = newInstanceName

                
            })

            // RelationTypeEffects
            effects = getUniqueObjectList(getObjectList(getSubset(RelationTypeEffects,["ProcessType", "RelationType"]), {"ProcessType": processType}))
            effects.forEach(effect => {
                let preExistingRelations = getUnique(getValueList(getObjectList(preExistingStructuralElements["SituationRelation"], {"RelationType": effect["RelationType"]}), "Relation"))
                getValueList(getObjectList(newEffectsStructuralElements["SituationRelation"], {"RelationType": effect["RelationType"]}), "Relation")
                    .forEach(rel => preExistingRelations.push(rel))

                let relationEffects = getUniqueObjectList(getObjectList(RelationTypeEffects, {"ProcessType": processType, "RelationType": effect["RelationType"]}))
                // Adding the SE like pump-1 from existing elements in position-2
                
                let newRelationInstanceName = getNewInstance(preExistingRelations, effect["RelationType"], separator)
                let situationName = (preExistingStructuralElements["SituationRelation"][0]) ? preExistingStructuralElements["SituationRelation"][0]["Situation"] : "Sit-1"

                relationEffects.forEach(eff => {
                    let se = newForwardExtensionStructural[processType][idx][eff["SERole"]]

                    let newRelationInstance = {
                        "Situation": situationName,
                        "Relation": newRelationInstanceName,
                        "RelationType": effect["RelationType"],
                        "SE": se,
                        "Pos": eff["Pos"]
                    }
                    
                    newEffectsStructuralElements["SituationRelation"].push(newRelationInstance)

                    newForwardExtensionStructural[processType][idx][eff["RoleRelation"]] = newRelationInstanceName
                })
            })


        })
    })

    return {
        newEffectsStructuralElements, newForwardExtensionStructural
    }


}

// ------ MAIN FUNCTION ------ //
function forwardCompletionStructural(newStructuralElements, preExistingStructuralElements, forwardExtensionStructural, data, separator){

    let {LibraryType,
        TypeSubsumption,
        RoleRelation,
    } = data

    // Identify processTypeCandidates    
    let TypeJoin = naturalJoin(naturalJoin(LibraryType, TypeSubsumption), newStructuralElements["SituationType"])
    let RelationJoin = naturalJoin(RoleRelation, newStructuralElements["SituationRelation"])
    
    let TypeRelationJoin = naturalJoin(TypeJoin, RelationJoin)

    let processTypeCandidates = {}
    processTypeCandidates["TypeJoin"] = getUniqueObjectList(getSubset(TypeRelationJoin, ["ProcessType", "SERole","SEType"]))
    processTypeCandidates["RelationJoin"] = getUniqueObjectList(getSubset(TypeRelationJoin, ["ProcessType", "RoleRelation","RelationType", "SERole", "Pos"]))
    
    // Identify newForwardExtensionStructural
    let newForwardExtensionStructural = newInstancesStructural(newStructuralElements, preExistingStructuralElements, processTypeCandidates, data)

    // preExistingStructuralElements = preExistingStructuralElements Union newStructuralElements
    preExistingStructuralElements = getObjectUnion(preExistingStructuralElements, newStructuralElements)
    getKeys(preExistingStructuralElements).forEach(key => preExistingStructuralElements[key] = getUniqueObjectList(preExistingStructuralElements[key]))
    
    
    // find newEffectsStructuralElements -> Effects of newForwardExtensionStructural
    let newEffects = effectsStructuralElements(newForwardExtensionStructural, preExistingStructuralElements, data, separator)
    let newEffectsStructuralElements = newEffects["newEffectsStructuralElements"]
    newEffectsStructuralElements["SituationType"] = getUniqueObjectList(newEffectsStructuralElements["SituationType"])
        .filter(se => !getObject(preExistingStructuralElements["SituationType"], se))
    newEffectsStructuralElements["SituationRelation"] = getUniqueObjectList(newEffectsStructuralElements["SituationRelation"])
        .filter(rel => !getObject(preExistingStructuralElements["SituationRelation"], rel))
    newForwardExtensionStructural = newEffects["newForwardExtensionStructural"]
    
    // Take union of forwardExtensionStructural and newForwardExtensionStructural
    forwardExtensionStructural = getObjectUnion(forwardExtensionStructural, newForwardExtensionStructural)
    getKeys(forwardExtensionStructural).forEach(process => forwardExtensionStructural[process] = getUniqueObjectList(forwardExtensionStructural[process]))

    // Recursive call if newEffectsStructuralElements exist
    if(newEffectsStructuralElements["SituationType"].length > 0 || newEffectsStructuralElements["SituationRelation"].length > 0){
        
        forwardExtensionStructural = forwardCompletionStructural(newEffectsStructuralElements, preExistingStructuralElements, forwardExtensionStructural, data, separator)
    }

    return forwardExtensionStructural
}




module.exports = {forwardCompletionStructural}
