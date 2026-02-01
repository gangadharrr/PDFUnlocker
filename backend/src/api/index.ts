import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await app.ready();
    const response = await app.inject({
      method: (req.method || 'GET') as any,
      url: req.url || '/',
      headers: req.headers as Record<string, string | string[]>,
      payload: req.body,
    });

    // Set response headers
    Object.entries(response.headers).forEach(([key, value]: [string, any]) => {
      res.setHeader(key, value);
    });

    res.status((response as any).statusCode).send((response as any).body);
  } catch (error: any) {
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
