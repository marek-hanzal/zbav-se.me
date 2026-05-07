import type { AgentInputItem, Session } from "@openai/agents-core";
import type { Kysely } from "kysely";
import { genId } from "@/lib/common/gen-id";
import type { Database } from "~/server/database/Database";

export namespace KyselySession {
	export interface Props {
		kysely: Kysely<Database>;
		userId: string;
		threadId: string;
	}
}

export class KyselySession implements Session {
	private readonly kysely: Kysely<Database>;
	private readonly threadId: string;
	private readonly userId: string;

	public constructor({ kysely, threadId, userId }: KyselySession.Props) {
		this.kysely = kysely;
		this.threadId = threadId;
		this.userId = userId;
	}

	public async getSessionId(): Promise<string> {
		return this.threadId;
	}

	public async getItems(limit?: number): Promise<AgentInputItem[]> {
		const recent = this.kysely
			.selectFrom("agent_stream")
			.select([
				"payload",
				"sort",
			])
			.where("userId", "=", this.userId)
			.where("threadId", "=", this.threadId)
			.orderBy("sort", "desc");

		const rows = await this.kysely
			.selectFrom(
				(limit !== undefined && limit > 0 ? recent.limit(limit) : recent).as("recent"),
			)
			.select((eb) => eb.ref("payload").$castTo<AgentInputItem>().as("payload"))
			.orderBy("sort", "asc")
			.execute();

		return rows.map(({ payload }) => payload);
	}

	public async addItems(items: AgentInputItem[]): Promise<void> {
		if (items.length === 0) {
			return;
		}

		await this.kysely.transaction().execute(async (trx) => {
			const current = await trx
				.selectFrom("agent_stream")
				.select(({ fn }) => fn.max<number>("sort").as("maxSort"))
				.where("userId", "=", this.userId)
				.where("threadId", "=", this.threadId)
				.executeTakeFirst();

			let nextSort = current?.maxSort ?? 0;

			await trx
				.insertInto("agent_stream")
				.values(
					items.map((payload) => ({
						id: genId(),
						userId: this.userId,
						threadId: this.threadId,
						payload,
						sort: ++nextSort,
					})),
				)
				.execute();
		});
	}

	public async popItem(): Promise<AgentInputItem | undefined> {
		return await this.kysely.transaction().execute(async (trx) => {
			const row = await trx
				.selectFrom("agent_stream")
				.select([
					"id",
					(eb) => eb.ref("payload").$castTo<AgentInputItem>().as("payload"),
				])
				.where("userId", "=", this.userId)
				.where("threadId", "=", this.threadId)
				.orderBy("sort", "desc")
				.executeTakeFirst();

			if (!row) {
				return undefined;
			}

			await trx
				.deleteFrom("agent_stream")
				.where("id", "=", row.id)
				.where("threadId", "=", this.threadId)
				.execute();

			return row.payload;
		});
	}

	public async clearSession(): Promise<void> {
		await this.kysely
			.deleteFrom("agent_stream")
			.where("userId", "=", this.userId)
			.where("threadId", "=", this.threadId)
			.execute();
	}
}
