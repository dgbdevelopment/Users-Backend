const { model, Schema } = require("mongoose");

const RoleSchema = new Schema(
  {
    name: String
  }, {
    versionKey: false
  }
);


module.exports = model("Role", RoleSchema);
