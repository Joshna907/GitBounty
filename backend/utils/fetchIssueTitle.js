const axios = require("axios");

const fetchIssueTitle = async (githubIssueUrl) => {
  try {
    // 1. Split the URL
    const parts = githubIssueUrl.split("github.com/")[1].split("/");
    const owner = parts[0];
    const repo = parts[1];
    const issueNumber = parts[3];

    // 2. API Call to GitHub
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

    const response = await axios.get(apiUrl);

    return response.data.title; // Issue Title
  } catch (error) {
    console.log("Error fetching issue title:", error.message);
    return null;
  }
}
module.exports = {fetchIssueTitle};