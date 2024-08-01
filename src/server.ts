// @ts-nocheck

import { app } from "./app";
import { _env } from "./env/Env";

app.listen ({
   host: '0.0.0.0',
   port: _env.PORT,
}).then(() => {
   console.log('🚀 HTTP server runnning!')
})