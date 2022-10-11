const { newMigration, FieldType } = require("@graphcms/management");
require('dotenv').config();

console.log(process.env.GRAPHCMS_INSTANCE);
console.log(process.env.GRAPHCMS_TOKEN);

const migration = newMigration({ 
    endpoint: process.env.GRAPHCMS_INSTANCE, 
    authToken: process.env.GRAPHCMS_TOKEN
});

const author = migration.createModel({
  apiId: "Author",
  apiIdPlural: "Authors",
  displayName: "Author",
});

author.addSimpleField({
  apiId: "name",
  displayName: "Name",
  isTitle: true,
  type: FieldType.String
});
author.addSimpleField({
  apiId: "portfolioLink",
  displayName: "Portfolio Link",
  type: FieldType.String,
});

migration.run();

//TODO: Add Write permissions in order to publish authors