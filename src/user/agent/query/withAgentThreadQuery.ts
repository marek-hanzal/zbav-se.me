import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { agentThreadCollectionFn } from "~/user/agent/fn/agentThreadCollectionFn";
import { agentThreadCountFn } from "~/user/agent/fn/agentThreadCountFn";
import { agentThreadCreateFn } from "~/user/agent/fn/agentThreadCreateFn";
import { agentThreadFetchFn } from "~/user/agent/fn/agentThreadFetchFn";
import type { AgentThreadCountQuerySchema } from "~/user/agent/server/schema/AgentThreadCountQuerySchema";
import type { AgentThreadCreateSchema } from "~/user/agent/server/schema/AgentThreadCreateSchema";
import type { AgentThreadPatchSchema } from "~/user/agent/server/schema/AgentThreadPatchSchema";
import type { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";
import type { AgentThreadSchema } from "~/user/agent/server/schema/AgentThreadSchema";

export const withAgentThreadQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withAgentThreadQuery",
	]),
	errors: {} as {
		fetch: agentThreadFetchFn.Error;
		collection: agentThreadCollectionFn.Error;
		count: agentThreadCountFn.Error;
		patch: Error;
		create: agentThreadCreateFn.Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"agent",
			"thread",
		];
	},
	toIdKey(id): AgentThreadQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: AgentThreadQuerySchema.Type) {
		return agentThreadFetchFn({
			data,
		});
	},
	async collectionFn(data: AgentThreadQuerySchema.Type) {
		return agentThreadCollectionFn({
			data,
		});
	},
	async countFn(data: AgentThreadCountQuerySchema.Type) {
		return agentThreadCountFn({
			data,
		});
	},
	async createFn(data: AgentThreadCreateSchema.Type) {
		return agentThreadCreateFn({
			data,
		});
	},
	async patchFn(_data: AgentThreadPatchSchema.Type): Promise<AgentThreadSchema.Type> {
		throw new Error("Agent thread patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<AgentThreadSchema.Type[]> {
		throw new Error("Agent thread collection patch is not supported.");
	},
	async deleteFn(_data: never): Promise<AgentThreadSchema.Type> {
		throw new Error("Agent thread delete is not supported.");
	},
});
