const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const { withSentryConfig } = require('@sentry/nextjs');
const { execSync } = require('child_process');

const nextConfig = {
	experimental: {
		serverActions: true,
		serverActionsBodySizeLimit: '22mb',
		serverComponentsExternalPackages: ['@react-pdf/renderer'],
	},
};

module.exports = nextConfig;
