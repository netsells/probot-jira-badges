const BadgeController = require('./app/Http/Controllers/BadgeController');
const WebhookController = require('./app/Http/Controllers/WebhookController');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = (app) => {
    app.on([
        'pull_request.opened',
        'pull_request.reopened',
    ], async (context) => {
        await WebhookController.pullRequestOpened({ context });
    });

    // Get an express router to expose new HTTP endpoints
    const router = app.route('/');

    router.get('/badge/:issue', async (request, response) =>
        await BadgeController.show({ request, response })
    );
};
