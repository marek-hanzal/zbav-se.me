import type { AgentInputItem, Session } from "@openai/agents-core";
import type { Kysely } from "kysely";
import { genId } from "@/lib/common/gen-id";
import type { Database } from "~/server/database/Database";

export namespace KyselySession {
	export interface Props {
		kysely: Kysely<Database>;
		userId: string;
	}
}

/**
 * NOTE:
 * - assistant_chat is expected to have at least:
 *   id, userId, threadId, payload, sort
 * - payload stores AgentInputItem as JSON
 */
export class KyselySession implements Session {
	public constructor(private readonly props: KyselySession.Props) {
		//
	}

	public async getSessionId(): Promise<string> {
		return this.props.userId;
	}

	public async getItems(limit?: number): Promise<AgentInputItem[]> {
		const rows = await this.props.kysely
			.selectFrom("assistant_chat")
			.select([
				"id",
				"payload",
				"sort",
			])
			.where("userId", "=", this.props.userId)
			.orderBy("sort", "asc")
			.execute();

		const items = rows.map(({ payload }) => structuredClone(payload as AgentInputItem));

		if (limit === undefined) {
			return items;
		}

		if (limit <= 0) {
			return [];
		}

		return items.slice(-limit);
	}

	public async addItems(items: AgentInputItem[]): Promise<void> {
		if (items.length === 0) {
			return;
		}

		await this.props.kysely.transaction().execute(async (trx) => {
			const current = await trx
				.selectFrom("assistant_chat")
				.select(({ fn }) => fn.max<number>("sort").as("maxSort"))
				.where("userId", "=", this.props.userId)
				.executeTakeFirst();

			let nextSort = current?.maxSort ?? 0;

			await trx
				.insertInto("assistant_chat")
				.values(
					items.map((payload) => ({
						id: genId(),
						userId: this.props.userId,
						threadId: this.props.threadId,
						payload: structuredClone(payload),
						sort: ++nextSort,
					})),
				)
				.execute();
		});
	}

	public async popItem(): Promise<AgentInputItem | undefined> {
		return await this.props.kysely.transaction().execute(async (trx) => {
			const row = await trx
				.selectFrom("assistant_chat")
				.select([
					"id",
					"payload",
				])
				.where("userId", "=", this.props.userId)
				.orderBy("sort", "desc")
				.executeTakeFirst();

			if (!row) {
				return undefined;
			}

			await trx.deleteFrom("assistant_chat").where("id", "=", row.id).execute();

			return structuredClone(row.payload as AgentInputItem);
		});
	}

	public async clearSession(): Promise<void> {
		await this.props.kysely
			.deleteFrom("assistant_chat")
			.where("userId", "=", this.props.userId)
			.execute();
	}
}
