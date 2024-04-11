import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.development.local",
});

export default {
  schema: "./src/lib/db.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // connectionString: process.env.POSTGRES_URL!,
    database: process.env.POSTGRES_DATABASE!,
    host: process.env.POSTGRES_HOST!,
    password: process.env.POSTGRES_PASSWORD!,
    // port: parseInt(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USER!,
  },
  strict: false,
} satisfies Config;
