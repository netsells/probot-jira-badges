const JiraService = require('../../Services/JiraService');

const READY_TO_DEPLOY_STATUS = 10002;

class BadgeController {
    /**
     * Return the badge JSON for the specific issue
     *
     * @param {Object} request
     * @param {Object} response
     *
     * @returns {Promise<boolean | void>}
     */
    async show({ request, response }) {
        const issue = await JiraService.getIssue(request.params.issue);
        const status = issue.fields.status;

        const colour = status.id == READY_TO_DEPLOY_STATUS
            ? 'brightgreen'
            : 'red';

        return response.send({
            schemaVersion: 1,
            label: request.params.issue,
            message: status.name,
            color: colour,
            namedLogo: 'jira',
        });
    }
}

module.exports = new BadgeController;
