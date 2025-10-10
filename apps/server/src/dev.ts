import { serve } from "bun";
import app from "./index";

const port = process.env.PORT || 3000;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
