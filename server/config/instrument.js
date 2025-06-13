// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://46c55d778bb73849432f947998163e23@o4509398871769088.ingest.us.sentry.io/4509398884089856",

  integrations: [Sentry.mongooseIntegration()],// check error in mongodb also

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
