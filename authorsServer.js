const express = require('express');
const { AwesomeGraphQLClient } = require('awesome-graphql-client');
const fetch = require('node-fetch');
const { randomInt } = require('crypto'); 
require('dotenv').config();
const importer = require("./readCSV");

const app = express();

const PORT = process.env.PORT || 3000;
const GRAPHCMS_INSTANCE = process.env.GRAPHCMS_INSTANCE;

const client = new AwesomeGraphQLClient({
  endpoint:
    GRAPHCMS_INSTANCE,
  fetch,
  headers: {
    Authorization: `Bearer ` + process.env.GRAPHCMS_TOKEN
  }
});

app.set('view engine', 'ejs');

app.get('/', async function (_, res) 
{
  const query = `
    { 
      authors {
        name
        portfolioLink
        id
      }
    }
  `;

  const { authors } = await client.request(query);

  res.render('authors', { authors });
});

app.get('/authors/:id', async function (req, res) 
{
  const query = `
    query AuthorPageQuery($id: ID!) {
      author(where: {id: $id}) {
        id
        name
        portfolioLink
        stage
      }
    }
  `;

  const { id } = req.params;

  const { author } = await client.request(query, { id });

  res.render('author', { author });
});

app.get('/addRandomAuthor', async function (req, res) 
{
  var authorName = "Name" + randomInt(9999);
  var authorPortfolioLink = "https://google.com";
  console.log('Creating author: { name: ' + authorName + ', portfolioLink: ' + authorPortfolioLink + '}');

  const query = `
    mutation createAuthor($name: String, $portfolioLink: String) {
      createAuthor(data: { name: $name, portfolioLink: $portfolioLink }) {
        id
        name
        portfolioLink
      }
    }
  `;

  const user = {
    name: authorName,
    portfolioLink: authorPortfolioLink
  };

  const author = await client.request(query, user );
  res.render('authorAdded', author );
});

app.get('/addCSVAuthors', async function (req, res) 
{
  importer.importCSV();

  res.render('addCSVAuthors');

});

app.get('/publishAuthor/:id', async function (req, res) 
{
  const query = `
    mutation PublishAuthorMutation($id: ID!) {
      publishAuthor(where: {id: $id}) {
        id
      }
    }
  `;

  const { id } = req.params;

  const { author } = await client.request(query, { id });

  res.render('authorAddedStatic');
});

app.listen(PORT, () => console.log(`🚀 Running on port ${PORT}`)); 