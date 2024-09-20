// Copyright (c) 2024 Webchemist Corp
// License: MIT

import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";

interface SlackMessage {
  slack_url: string;
  owner: string;
  reviewers: string[];
  title: string;
  pr_url?: string;
  repo_name?: string;
}

const sendSlackMessage = async ({ slack_url, owner, title, pr_url, reviewers, repo_name }: SlackMessage) => {
  await axios({
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
            text: `${owner}님이 \`${repo_name}\`에서 PR을 요청했습니다.`,
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
    const slack_url = core.getInput("slack-url");
    const { payload } = github.context;
    const { pull_request, sender, repository } = payload;

    const { title, html_url: pr_url, requested_reviewers } = pull_request!;
    const repo_name = repository?.full_name;
    // if (requested_reviewers.length === 0) {
    //   return;
    // }

    // let slack_channels: Record<string, string> = {};
    // try {
    //   slack_channels = JSON.parse(_channels);
    // } catch {
    //   slack_channels = {};
    // }

    const owner = sender?.login;
    const reviewers = requested_reviewers.map(({ login }: { login: string }) => login);

    await sendSlackMessage({
      slack_url,
      owner,
      reviewers,
      title,
      pr_url,
      repo_name,
    });
  } catch (error) {
    core.setFailed(error as string | Error);
  }
})();
