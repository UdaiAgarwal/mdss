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
    getSubObject
} = require("./Utility");


// -------------------- relation rolebinding --------------------
function RoleBinding(RelationJoin){

    let relation_rolebinding = {}
    // Extract Unique RoleRelations
    let roleRelationNameList = getUnique(getValueList(RelationJoin, "RoleRelation"))
    roleRelationNameList.forEach(roleRelation => {
        relation_rolebinding[roleRelation] = [];
    
        // Extract Relation List of this roleRelation
        let RelationList = getObjectList(RelationJoin, {"RoleRelation": roleRelation})
    
        // Extract Unique Relations
        let relationNameList = getUnique(getValueList(RelationList, "Relation"))
        relationNameList.forEach(relationName => {
            let Relation = getObjectList(RelationList, {"Relation": relationName})
            
    
            let RelationTuple = {}
            // Adding Relation Name to relation tuple
            RelationTuple[Relation[0]["RoleRelation"]] = Relation[0]["Relation"]
        
    
            // Extract SERoles (According to the theory, SERoles are unique for a relation)
            let SERoleList = getValueList(Relation, "SERole")
            // Adding SERoles
            SERoleList.forEach(SERole => {
                RelationTuple[SERole] = getObject(Relation, {"SERole": SERole})["SE"]
            })       
            
    
            // Add the relationTuple to relation_rolebinding
            relation_rolebinding[roleRelation].push(RelationTuple)
    
        })
        
    })
    
    
    return relation_rolebinding
}

function getNewInstance(List, Type, separator){
    List = getUnique(List)
    if(!List || List.length === 0){   
        return [Type, 1].join(separator)
    }
    let instanceNumbers = []
    List.forEach(itm => {
        instanceNumbers.push(parseInt(itm.split(separator)[itm.split(separator).length - 1]))
    })
    // return Max + 1
    
    let nextInstanceNumber = instanceNumbers.sort()[instanceNumbers.length-1]+1
    return [Type, nextInstanceNumber].join(separator)

}

module.exports = { RoleBinding, getNewInstance}