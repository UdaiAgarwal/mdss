// -------------------- utility function --------------------

function getKeys(obj){
    return Object.keys(obj);
}

// getkeylist to getAttributes
function getAttributes(objList){
    if( !objList || objList.length === 0) return []; 
    return Object.keys(objList[0]);
}

function getObject( objList, obj){
    if( !objList || objList.length === 0) return;
    if( !obj || getKeys(obj).length === 0) return;
    let objListAttributes = getAttributes(objList)
    let objKeys = getKeys(obj)
    let isSubset = objKeys.every(key => objListAttributes.includes(key))
    if(isSubset){
        for(let i = 0; i < objList.length; i++){
            let found = objKeys.every(key => objList[i][key] === obj[key])
            if(found) return objList[i];
        }
        return;
    }
}

function getObjectList(objList, obj){
    if( !objList || objList.length === 0) return [];
    if( !obj || getKeys(obj).length === 0) return [];
    let objListAttributes = getAttributes(objList)
    let objKeys = getKeys(obj)
    let isSubset = objKeys.every(key => objListAttributes.includes(key))
    if(isSubset){
        let returnObjList = objList.filter(o => (objKeys.every(key => (o[key] === obj[key]) )) )
        return returnObjList;
    }
}

function getValueList(objList, attr){
    if(!objList || objList.length ===  0) return [];
    if(!getAttributes(objList).includes(attr)) return [];
    let returnValueList = objList.map(obj => (obj[attr]) )
    return returnValueList;
}

function getSubset(objList, attributes){
    if(!objList || objList.length === 0) return [];
    if(!attributes || attributes.length === 0) return [];
    let objListAttributes = getAttributes(objList)
    let attributesExist = attributes.every(attr => objListAttributes.includes(attr));
    if(!attributesExist) return [];
    let returnObjList = objList.map(obj => {
        let objSubset = {}
        attributes.forEach((attr) => (objSubset[attr] = obj[attr]) )
        return objSubset;
    })
    return returnObjList;
}

function naturalJoin(objList1, objList2, attributes){
    if(!objList1 || objList1.length === 0) return [];
    if(!objList2 || objList2.length === 0) return [];
    let l1Attributes = getAttributes(objList1)
    let l2Attributes = getAttributes(objList2)
    
    if(!attributes || attributes.length === 0){    
        if(!l1Attributes || !l2Attributes || l1Attributes.length === 0 || l2Attributes.length === 0) return [];
        let common = l1Attributes.filter(l1key => l2Attributes.includes(l1key))
        if(common.length === 0) return [];
        attributes = common
    }
    else{
        let attributesExistIn1 = attributes.every(attr => l1Attributes.includes(attr))
        let attributesExistIn2 = attributes.every(attr => l2Attributes.includes(attr))
        if(!attributesExistIn1 || !attributesExistIn2) return [];
    }

    let returnobjList = [];
    objList1.forEach( o1 => {
        objList2.forEach( o2 => {
            
            let satisfied = attributes.every(attr => o1[attr] === o2[attr]);
            if(satisfied === true){
                returnobjList.push({...o1, ...o2});
            }
        })
    })
    return returnobjList;
}

function naturalJoinAll(obj){
    let TableNameList = getKeys(obj)
    if(!TableNameList || TableNameList.length === 0) return [];

    if(obj[TableNameList[0]].length === 0) return [];
    let returnObjectList = obj[TableNameList[0]]
    if(TableNameList.length === 1) return returnObjectList;
    if(TableNameList.length === 2){
        returnObjectList = naturalJoin(returnObjectList, obj[TableNameList[1]])
        return returnObjectList
    }
    let usedTables = TableNameList.map(name => 0)
    usedTables[0] = 1
    // Didn't consider the case one of the tables have no attribute in common
    for(let i=0; i < TableNameList.length; i++){
        if(usedTables.every(itm => itm===1)) return returnObjectList;
        for(let j=1; j < TableNameList.length ; j++){
            let kList1 = getKeyList(returnObjectList)
            let kList2 = getKeyList(obj[TableNameList[j]])
            common = kList1.filter(k1 => kList2.includes(k1))
            if(common.length === 0) break;
            returnObjectList = naturalJoin(returnObjectList, obj[TableNameList[j]])
            usedTables[j] = 1
        }
    }
    
    return returnObjectList;
    

}


function getUnique(list){
    return [...new Set(list)]
}

function getUniqueObjectList(objList){
    if(!objList || objList.length === 0) return [];
    let returnObjList = []
    objList.forEach(obj => {
        if(!getObject(returnObjList, obj)) returnObjList.push(obj)
    })
    return returnObjList
}

function displayObjectList(objList, blanks = 22){
    let spaces = " "
    let attributes = getAttributes(objList)
    // table header
    let header = ""
    attributes.forEach(attr => {
        spaces = (blanks-attr.length > 0) ? new Array(blanks-attr.length).join(" ") : " "
        header += `${attr} ${spaces}`
    })
    console.log(header)
    
    // entries
    objList.forEach(obj => {
        let row = ""
        attributes.forEach(attr => {
            spaces = (blanks-obj[attr].length > 0) ? new Array(blanks-obj[attr].length).join(" ") : " "
            row += `${obj[attr]} ${spaces}`
        })
        console.log(row)
    })
}

function getSubObject(obj, keyList){
    if(!obj) return;
    if(!keyList || keyList.length === 0) return;
    let objKeys = getKeys(obj)
    let allExist = keyList.every(key => (objKeys.includes(key)) )
    if(!allExist) return;
    let returnObj = {}
    keyList.forEach(key => returnObj[key] = obj[key])
    return returnObj;
}

function getObjectUnion(obj1, obj2){
    let obj1Keys = getKeys(obj1)
    let obj2Keys = getKeys(obj2)
    if(obj1Keys.length === 0 && obj2Keys.length === 0) return;
    if(obj1Keys.length === 0) return obj2;
    if(obj2Keys.length === 0) return obj1;
    obj2Keys.forEach(key => {
        if(obj1Keys.includes(key)){
            obj2[key].forEach(itm => {
                obj1[key].push(itm)
            })
        }
        else{
            obj1[key] = obj2[key]
        }
    })
    return obj1;
}

module.exports = {
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
}