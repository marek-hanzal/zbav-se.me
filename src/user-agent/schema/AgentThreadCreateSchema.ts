import { z } from "zod";

export const AgentThreadCreateSchema = z.looseObject({}).strip().meta({
	id: "AgentThreadCreate",
	description: "Data for creating an agent thread",
});

export type AgentThreadCreateSchema = typeof AgentThreadCreateSchema;

export namespace AgentThreadCreateSchema {
	export type Type = z.infer<AgentThreadCreateSchema>;
}
