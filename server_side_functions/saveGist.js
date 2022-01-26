const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_TOKEN });

exports.handler = async function(event, context) {
  var gist_id = 'c9da1d77dd4e145d405f5c4ffebf4143'

  var payload = JSON.parse(event.body);
  var filename = payload.filename;
  var content = payload.content;
  var files = {};
  files[filename] = {
    content: JSON.stringify(content)
  };

  await octokit.request('PATCH /gists/{gist_id}', {
    gist_id: gist_id,
    files: files
  });

  return {
    statusCode: 200,
    body: "",
  };
}
