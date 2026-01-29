import { env } from './configs/env.config';
import app from './app';

async function start(): Promise<void> {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0'})
    app.log.info(`Server is running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
void start()