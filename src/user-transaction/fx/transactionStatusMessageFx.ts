import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import type { TransactionEntryTableSchema } from "~/database/schema/TransactionEntryTable";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { TransactionSideEnumSchema } from "~/transaction-contract/schema/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";

const KindMap = {
	"interest:buyer": "status-interest",
	"trade:seller": "status-trade",
	"resolved:seller": "status-resolved",
	"dispute:buyer": "status-dispute-buyer",
	"dispute:seller": "status-dispute-seller",
	"rejected:buyer": "status-rejected-buyer",
	"rejected:seller": "status-rejected-seller",
	"sold:buyer": "status-sold",
	"expired:null": "status-expired",
	"success:buyer": "status-success",
	"closed:buyer": "status-closed",
} as const satisfies Partial<
	Record<transactionStatusMessageFx.Key, TransactionEntryTableSchema.Type["kind"]>
>;

export namespace transactionStatusMessageFx {
	export type Key =
		`${TransactionStatusEnumSchema.Type}:${TransactionSideEnumSchema.Type | "null"}`;

	export interface Props {
		transactionId: string;
		request: TransactionStatusEnumSchema.Type;
		target: TransactionSideEnumSchema.Type | null;
		userId: string | null;
	}
}

export const transactionStatusMessageFx = Effect.fn("transactionStatusMessageFx")(function* ({
	transactionId,
	request,
	target,
	userId,
}: transactionStatusMessageFx.Props) {
	const logger = yield* getLoggerFx("transactionStatusMessageFx");
	logger.trace("transactionStatusMessageFx", {
		transactionId,
		request,
		target,
		userId,
	});

	const dateService = yield* DateServiceFx;
	const key: transactionStatusMessageFx.Key = `${request}:${target ?? "null"}`;
	const kind = KindMap[key as keyof typeof KindMap];

	if (!kind) {
		return;
	}

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("transaction_entry")
			.values({
				id: genIdFn(),
				transactionId,
				kind,
				userId,
				payload: {
					text: kind,
				},
				createdAt: dateService.nowFn().toJSDate(),
			})
			.executeTakeFirstOrThrow();
	});
});

export type transactionStatusMessageFx = ReturnType<typeof transactionStatusMessageFx>;
