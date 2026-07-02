import 'dotenv/config';
import { createApp } from './app';

// PORT is provided by most PaaS hosts (Render, Railway, …); fall back to
// BACKEND_PORT for local/Docker, then a sensible default.
const PORT = Number(process.env.PORT || process.env.BACKEND_PORT) || 4000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 G-Scores backend listening on http://localhost:${PORT}`);
});
