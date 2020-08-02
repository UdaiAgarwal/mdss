let LibraryType = require("../knowledge/LibraryType.json")
let TypeSubsumption = require("../knowledge/TypeSubsumption.json")
let SituationType = require("../knowledge/SituationType.json")
let RoleRelation = require("../knowledge/RoleRelation.json")
let SituationRelation = require("../knowledge/SituationRelation.json")
let LibraryTypeEffects = require("../knowledge/LibraryTypeEffects.json")
let RelationTypeEffects = require("../knowledge/RelationTypeEffects.json")

let data = {
    LibraryType: LibraryType,
    TypeSubsumption: TypeSubsumption,
    SituationType: SituationType,
    RoleRelation: RoleRelation,
    SituationRelation: SituationRelation,
    LibraryTypeEffects: LibraryTypeEffects,
    RelationTypeEffects: RelationTypeEffects,
}


module.exports = {data}