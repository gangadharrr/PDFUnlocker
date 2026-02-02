import { env } from './configs/env.config';
import app from './app';

app.listen({ port: env.PORT }).then(() => {
  app.log.info(`Server is running on port ${env.PORT}`);
}).catch((err) => {
   app.log.error(err);
    process.exit(1);
});
