class WebhookController {
    /**
     * Handle the github webhook of when a Pull request is opened/reopened
     *
     * @param context
     *
     * @returns {Promise<boolean>|Undefined}
     */
    async pullRequestOpened({ context }) {
        const { pull_request } = context.payload;
        const { repository } = context.payload;

        const issue = this.getIssue({ pull_request });

        // If we're not on an issue branch or we've
        // already added a badge, we'll stop here
        if (!issue || pull_request.body.includes('https://img.shields.io/endpoint.svg')) {
            return;
        }

        await context.github.pullRequests.update({
            owner: repository.owner.login,
            repo: repository.name,
            number: pull_request.number,

            body: [
                this.generateBadge(issue),
                '',
                pull_request.body
            ].join('\n'),
        });
    }

    /**
     * Get the issue ID from the branch
     *
     * @param {Object} pull_request
     *
     * @returns {Boolean}
     */
    getIssue({ pull_request }) {
        const branch = pull_request.head.ref;
        const branchRegex = /([A-Za-z]+-[0-9]+)/;

        // If it's not a task branch we'll allow it
        if (!new RegExp(branchRegex).test(branch)) {
            return false;
        }

        const [_, branchIssue] = new RegExp(branchRegex).exec(branch);

        return branchIssue;
    }

    /**
     * Generate the badge for markdown
     *
     * @param {String} issue
     *
     * @returns {String}
     */
    generateBadge(issue) {
        const url = encodeURIComponent(`${ process.env.APP_URL }/badge/${ issue }`);
        const issueLink = `https://netsells.atlassian.net/browse/${ issue }`;

        return `[![JIRA Status](https://img.shields.io/endpoint.svg?url=${ url })](${ issueLink })`;
    }
}

module.exports = new WebhookController;
