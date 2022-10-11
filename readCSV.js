const { AwesomeGraphQLClient } = require('awesome-graphql-client');
const fetch = require('node-fetch');
require('dotenv').config();
const csvToJson =require("convert-csv-to-json");
const Queue = require('bee-queue');
const RedisServer = require('redis-server');
const res = require('express/lib/response');

const importCSV = async () => {
    const data = csvToJson.getJsonFromCsv('./ImportData.csv');
  
    const queue = new Queue('GraphCMS Import');
  
    await Promise.all(
      data.map(async (row) => {
        const job = await queue.createJob(row).backoff('fixed', 5000).save();
        
        return job;
      }),
    );
  
    queue.on('job succeeded', (jobId) => console.log(`[SUCCESS]: ${jobId}`));
    queue.on('job failed', (jobId, err) =>
      console.log(`[FAILED]: ${jobId} (${err})`),
    );
  
    await queue.process(async (job) => await createContentEntry(job.data));
  };
  
const createContentEntry = async (variables) => {
    const GRAPHCMS_INSTANCE = process.env.GRAPHCMS_INSTANCE;

    const client = new AwesomeGraphQLClient({
        endpoint:
            GRAPHCMS_INSTANCE,
        fetch,
        headers: {
            Authorization: `Bearer ` + process.env.GRAPHCMS_TOKEN
        }
    });

    const query = `
        mutation createAuthor($name: String, $portfolioLink: String) {
            createAuthor(data: { name: $name, portfolioLink: $portfolioLink }) {
            id
            name
            portfolioLink
            }
        }
    `;


    const author = await client.request(query, variables);

    return author;
};

exports.importCSV = function () {
  importCSV();
}