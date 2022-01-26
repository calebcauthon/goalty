const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_TOKEN });

exports.handler = async function(event, context) {
  var payload = JSON.parse(event.body);
  var gist_id = 'c9da1d77dd4e145d405f5c4ffebf4143'
  var gameId = payload.gameId;
  var players = payload.players;
  var filename = `players-${gameId}.json`;
  var files = {};
  files[filename] = {
    content: JSON.stringify(players)
  };
  var result = await octokit.request('PATCH /gists/{gist_id}', {
    gist_id: gist_id,
    files: files
  });

  return {
    statusCode: 200,
    body: "",
  };
}
