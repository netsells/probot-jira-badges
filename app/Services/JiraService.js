const axios = require('axios');

const key = Buffer.from(`${ process.env.JIRA_API_USER_EMAIL }:${ process.env.JIRA_API_KEY }`).toString('base64');

class JiraService {
    /**
     * Create a JIRA Client
     *
     * @returns {JiraService}
     */
    constructor() {
        this.jira = axios.create({
            baseURL: 'https://netsells.atlassian.net/rest/agile/latest/',
            headers: {
                'Authorization': `Basic ${ key }`,
                'Content-Type': 'application/json',
            },
        });

        return this;
    }

    /**
     * Fetch a specific issue from the API
     *
     * @param {String} issue
     *
     * @returns {Promise<any>}
     */
    async getIssue(issue) {
        const { data } = await this.jira.get(`issue/${issue}`, {
            params: {
                fields: 'status'
            },
        });

        return data;
    }
}

module.exports = new JiraService();
