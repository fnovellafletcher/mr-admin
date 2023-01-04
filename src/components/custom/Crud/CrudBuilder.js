export class CrudBuilder {
  textKeys = {
    createRecordTextKey: "crud.generic.create.new.record",
    updateRecordTextKey: "crud.generic.update.record",
    deleteRecordTextKey: "crud.generic.delete.record",
  };

  idName = "id"; // the name of the ID for your DB (example, for MongoDB it is _id)
  pageSize = 45; // page size
  position = "both"; // paginator location

  find;
  findOne;
  update;
  remove;
  insert;

  formFieldsFilter;
  formFieldsCrud;
  tableColumns;

  buildFormFieldsCrud(catalog) {
    if (this.formFieldsCrudBuilder) {
      this.formFieldsCrud = this.formFieldsCrudBuilder(catalog);
    }
  }

  setViewRedirect = (redirect) => {
    this.viewRedirect = redirect;
  };

  setUpdateRedirect = (redirect) => {
    this.updateRedirect = redirect;
  };

  constructor(constructorObj) {
    Object.assign(this, constructorObj);
  }
}
