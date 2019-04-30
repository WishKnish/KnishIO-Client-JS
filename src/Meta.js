
export default class Meta {
  constructor(modelType, modelId, meta, snapshotMolecule = null) {
    this.modelType = modelType;
    this.modelId = modelId;
    this.meta = meta;
    this.snapshotMolecule = snapshotMolecule;
    created_at = +new Date;
  }
}
