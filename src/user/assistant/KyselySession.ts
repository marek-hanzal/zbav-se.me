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

export class KyselySession implements Session {
	public constructor(private readonly props: KyselySession.Props) {
		//
	}

	public async getSessionId(): Promise<string> {
		return this.props.userId;
	}

	public async getItems(limit?: number): Promise<AgentInputItem[]> {
		const recent = this.props.kysely
			.selectFrom("assistant_chat")
			.select([
				"payload",
				"sort",
			])
			.where("userId", "=", this.props.userId)
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
						payload,
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
					(eb) => eb.ref("payload").$castTo<AgentInputItem>().as("payload"),
				])
				.where("userId", "=", this.props.userId)
				.orderBy("sort", "desc")
				.executeTakeFirst();

			if (!row) {
				return undefined;
			}

			await trx.deleteFrom("assistant_chat").where("id", "=", row.id).execute();

			return row.payload;
		});
	}

	public async clearSession(): Promise<void> {
		await this.props.kysely
			.deleteFrom("assistant_chat")
			.where("userId", "=", this.props.userId)
			.execute();
	}
}
