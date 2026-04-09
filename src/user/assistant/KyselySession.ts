import type { AgentInputItem, Session } from "@openai/agents-core";
import type { Kysely } from "kysely";
import { genId } from "@/lib/common/gen-id";
import type { Database } from "~/server/database/Database";

export namespace KyselySession {
	export interface Props {
		kysely: Kysely<Database>;
		userId: string;
		threadId?: string;
	}
}

export class KyselySession implements Session {
	public constructor(private readonly props: KyselySession.Props) {
		//
	}

	public async getSessionId(): Promise<string> {
		return this.props.threadId ?? this.props.userId;
	}

	public async getItems(limit?: number): Promise<AgentInputItem[]> {
		const threadId = this.props.threadId ?? this.props.userId;
		const recent = this.props.kysely
			.selectFrom("agent_stream")
			.select([
				"payload",
				"sort",
			])
			.where("userId", "=", this.props.userId)
			.where("threadId", "=", threadId)
			.orderBy("sort", "desc");

		const rows = await this.props.kysely
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

		const threadId = this.props.threadId ?? this.props.userId;
		await this.props.kysely.transaction().execute(async (trx) => {
			const current = await trx
				.selectFrom("agent_stream")
				.select(({ fn }) => fn.max<number>("sort").as("maxSort"))
				.where("userId", "=", this.props.userId)
				.where("threadId", "=", threadId)
				.executeTakeFirst();

			let nextSort = current?.maxSort ?? 0;

			await trx
				.insertInto("agent_stream")
				.values(
					items.map((payload) => ({
						id: genId(),
						userId: this.props.userId,
						threadId,
						payload,
						sort: ++nextSort,
					})),
				)
				.execute();
		});
	}

	public async popItem(): Promise<AgentInputItem | undefined> {
		const threadId = this.props.threadId ?? this.props.userId;
		return await this.props.kysely.transaction().execute(async (trx) => {
			const row = await trx
				.selectFrom("agent_stream")
				.select([
					"id",
					(eb) => eb.ref("payload").$castTo<AgentInputItem>().as("payload"),
				])
				.where("userId", "=", this.props.userId)
				.where("threadId", "=", threadId)
				.orderBy("sort", "desc")
				.executeTakeFirst();

			if (!row) {
				return undefined;
			}

			await trx
				.deleteFrom("agent_stream")
				.where("id", "=", row.id)
				.where("threadId", "=", threadId)
				.execute();

			return row.payload;
		});
	}

	public async clearSession(): Promise<void> {
		const threadId = this.props.threadId ?? this.props.userId;
		await this.props.kysely
			.deleteFrom("agent_stream")
			.where("userId", "=", this.props.userId)
			.where("threadId", "=", threadId)
			.execute();
	}
}
