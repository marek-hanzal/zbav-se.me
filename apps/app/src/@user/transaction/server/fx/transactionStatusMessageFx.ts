import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { TransactionSideEnumSchema } from "~/@common/user-transaction/enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/@common/user-transaction/enum/TransactionStatusEnumSchema";
import type { TransactionEntryTableSchema } from "~/server/database/@table/TransactionEntryTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

const KindMap = {
	"pending:buyer": "status-pending",
	"open:seller": "status-open",
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
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const key: transactionStatusMessageFx.Key = `${request}:${target ?? "null"}`;
	const kind = KindMap[key as keyof typeof KindMap];

	if (!kind) {
		return;
	}

	yield* tryDbFx(async () =>
		kysely
			.insertInto("transaction_entry")
			.values({
				id: genId(),
				transactionId,
				kind,
				userId,
				payload: {
					text: kind,
				},
				createdAt: dateContext.now().toJSDate(),
			})
			.executeTakeFirstOrThrow(),
	);
});

export type transactionStatusMessageFx = ReturnType<typeof transactionStatusMessageFx>;
