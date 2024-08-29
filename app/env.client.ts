import { z } from "zod";

const ClientSchema = z.object({});

export const clientEnv = () => ClientSchema.parse(process.env);
