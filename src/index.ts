// Copyright (c) 2024 Webchemist Corp
// License: MIT

import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";

const sendSlackMessage = async ({
  slack_url,
  reviewers,
  owner,
  title,
  pr_url,
  repo_name,
}: any) => {
  axios({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    url: slack_url,
    data: {
      text: "PR Review 요청입니다.",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${owner}님이 \`${repo_name}\` PR을 요청했습니다.`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*PR Title*: ${title}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*PR URL*: ${pr_url}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Reviewers*: ${reviewers.join(", ")}`,
          },
        },
      ],
    },
  });
};

(async () => {
  try {
    const token = core.getInput("token");
    const slack_url = core.getInput("slack-url");
    const { payload } = github.context;
    const { pull_request, sender, repository } = payload;

    const {
      title,
      labels,
      html_url: pr_url,
      requested_reviewers,
    } = pull_request!;
    const repo_name = repository?.full_name;
    if (requested_reviewers.length === 0) {
      return;
    }

    const owner = sender?.login;
    const reviewers = requested_reviewers.map(({ login }: any) => login);

    await sendSlackMessage({
      slack_url,
      reviewers,
      owner,
      title,
      pr_url,
      repo_name,
    });
  } catch (error: any) {
    core.setFailed(error.message);
  }
})();
