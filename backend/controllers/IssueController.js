const {fetchIssueTitle} = require("../utils/fetchIssueTitle");

const getIssueTitle = async (req, res) => {
     try {
    const { githubIssueUrl } = req.body;

    if (!githubIssueUrl)
      return res.status(400).json({ msg: "GitHub Issue URL is required" });

    const title = await fetchIssueTitle(githubIssueUrl);

    return res.json({
      success: true,
      issueTitle: title,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

module.exports = { getIssueTitle };