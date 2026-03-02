import { NotFoundErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { userEventBuyerInfoFx } from "~/@buyer/user-event/fx/userEventBuyerInfoFx";
import { TransactionBuyerInfoSchema } from "~/@seller/transaction/schema/TransactionBuyerInfoSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace transactionGetBuyerInfoFx {
	export interface Props {
		userId: string;
		transactionId: string;
	}
}

export const transactionGetBuyerInfoFx = Effect.fn("transactionGetBuyerInfoFx")(function* ({
	userId,
	transactionId,
}: transactionGetBuyerInfoFx.Props) {
	yield* withTraceFx({
		fx: "transactionGetBuyerInfoFx",
		input: {
			userId,
			transactionId,
		},
	});

	const { kysely } = yield* KyselyContextFx;

	const userInfo = yield* tryDbFx(async () =>
		kysely
			.selectFrom("user as u")
			.innerJoin("transaction as lt", (eb) => {
				/**
				 * We're picking up the buyer (user who created the transaction).
				 */
				return eb.onRef("lt.userId", "=", "u.id").on("lt.id", "=", transactionId);
			})
			.innerJoin("listing as l", (eb) => {
				/**
				 * Ensure current user is owner of the listing
				 */
				return eb.onRef("l.id", "=", "lt.listingId").on("l.userId", "=", userId);
			})
			.select([
				"u.id",
				"u.createdAt",
			])
			.executeTakeFirst(),
	);

	if (!userInfo) {
		yield* withTraceFx({
			fx: "transactionGetBuyerInfoFx",
			error: {
				resource: "transaction-buyer-info",
				message: "Buyer info not available",
			},
		});
		return yield* new NotFoundErrorFx({
			resource: "transaction-buyer-info",
			message: "Buyer info not available",
		});
	}

	return yield* zodGuardFx({
		schema: TransactionBuyerInfoSchema,
		dataFx: Effect.succeed({
			registered: userInfo.createdAt,
			events: yield* userEventBuyerInfoFx({
				userId: userInfo.id,
			}),
		} satisfies TransactionBuyerInfoSchema.Type),
	});
});

export type transactionGetBuyerInfoFx = ReturnType<typeof transactionGetBuyerInfoFx>;
