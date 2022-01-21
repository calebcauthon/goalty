const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_TOKEN });

exports.handler = async function(event, context) {
  var gist_id = 'c9da1d77dd4e145d405f5c4ffebf4143'
  var result = await octokit.request('GET /gists/{gist_id}', {
    gist_id: gist_id
  });

  var playersJson = result['data']['files']['players.json']['content'];

  return {
    statusCode: 200,
    body: playersJson,
  };
}