
export default async function handler(req, res) {
  try {
    // Dynamically import the app to catch any module loading errors
    const appModule = await import('../dist/app.js');

    // Handle CommonJS/ESM interop - the module has nested default exports
    const app = (appModule.default && appModule.default.default)
      ? appModule.default.default
      : appModule.default || appModule;

    await app.ready();

    const response = await (app).inject({
      method: (req.method || 'GET'),
      url: req.url || '/',
      headers: req.headers,
      payload: req.body,
    });

    // Set response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(response.statusCode).send(response.body);
  } catch (error) {
    console.error('Error handling request:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    res.status(500).send({
      error: 'Internal Server Error',
      message: error?.message,
      stack: process.env['NODE_ENV'] === 'development' ? error?.stack : undefined
    });
  }
}
