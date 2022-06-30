import * as swaggerJsdoc from 'swagger-jsdoc';
import * as packageJson from '../package.json';
import { config } from '../config';

export const swaggerHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>METASALT service ${config.stage} API Documentation</title>
    <script src="//cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-bundle.js"></script>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.css" media="all"/>
  </head>
  <body>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/${config.stage + config.swagger.path}",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
      });
    };
  </script>
  <div id="swagger-ui"></div>
  </body>
  </html>
`;
export const swaggerOptions = (host: string): swaggerJsdoc.Options => ({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
      contact: {
        email: 'christianiancuya@outlook.com',
        name: 'Christian Ian Cuya',
        url: `${host}/${config.stage}${config.swagger.docsPath}`,
      },
    },
    basePath: `/${config.stage}`,
    host: '',
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'authorization-token',
          in: 'header',
        },
      },
    },
    servers: [{ url: `${host}/${config.stage}` }],
    security: [
      { BearerAuth: [] },
    ],
    tags: [
      {
        name: 'Ping',
        description: 'No need Cognito JWT Access token',
      },
      {
        name: 'Auth',
        description: 'No need Cognito JWT Access token',
      },
    ],
  },
  apis: ['api/routes/*.ts', 'api/routes/*.js'], // files containing annotations as above
});
