# Request a PR review via Slack

This action allows you to request a PR review via Slack.

# What's new

Please refer to the [release page](https://github.com/GennYoon/request-pr-review/releases) for the latest release notes.

# Usage

```yaml
- name: Send Request PR Review
  uses: GennYoon/request-pr-review@0.1.0
  with:
    slack-url: ${{ secrets.SLACK_URL }}
```

# License

The scripts and documentation in this project are released under the [MIT License](https://github.com/GennYoon/request-pr-review/blob/main/LICENSE).
