require('dotenv').config();
const { Client } = require('@hygraph/management-sdk');
const { SimpleFieldType, RelationalFieldType, VisibilityTypes } = require("@hygraph/management-sdk/dist/mgmtServerTypes");

var hygraphInstance = process.env.GRAPHCMS_INSTANCE;
var hygraphToken = process.env.GRAPHCMS_TOKEN;

const client = new Client({
  authToken: hygraphToken,
  endpoint: hygraphInstance,
});

const run = async () => {
  client.createModel({
    apiId: 'Author',
    apiIdPlural: 'Authors',
    displayName: 'Author',
  });

  client.createSimpleField({
      apiId: 'name',
      displayName: 'Name',
      type: SimpleFieldType.String,
      modelApiId: 'Author',
  });

  client.createSimpleField({
    apiId: 'portfolioLink',
    displayName: 'Portfolio Link',
    type: SimpleFieldType.String,
    modelApiId: 'Author',
  });


  const result = await client.run(true);
  if (result.errors) {
    throw new Error(result.errors);
  }
  return result;
};

run()
  .then((result) => console.log(`Finished migration at: ${result.finishedAt}`))
  .catch((err) => console.error('Error: ', err));
