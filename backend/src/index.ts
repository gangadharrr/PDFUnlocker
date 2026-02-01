import { env } from './configs/env.config';
import app from './app';

app.listen({ port: env.PORT })
app.log.info(`Server is running on port ${env.PORT}`);
