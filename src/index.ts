// Copyright (c) 2024 Webchemist Corp
// License: MIT

import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";

const sendSlackMessage = async ({ slack_url }: any) => {
  axios({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    url: slack_url,
    data: {
      text: "PR Review 요청입니다.",
    },
  });
};

(async () => {
  try {
    const token = core.getInput("token");
    const slack_url = core.getInput("slack-url");
    const { payload } = github.context;
    const {
      pull_request,
      sender,
      requested_reviewer,
      requested_team,
      repository,
    } = payload;

    console.log(JSON.stringify(payload, null, 2));
    const { title, labels, html_url: pr_url } = pull_request!;
    const repo_name = repository?.full_name;

    await sendSlackMessage({ slack_url });
  } catch (error: any) {
    core.setFailed(error.message);
  }
})();
