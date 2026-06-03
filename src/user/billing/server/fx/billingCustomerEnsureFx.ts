import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace billingCustomerEnsureFx {
	export interface Props {
		userId: string;
	}
}

export const billingCustomerEnsureFx = Effect.fn("billingCustomerEnsureFx")(function* ({
	userId,
}: billingCustomerEnsureFx.Props) {
	const logger = yield* getLoggerFx("billingCustomerEnsureFx");
	logger.trace("billingCustomerEnsureFx", {
		userId,
	});

	const { email } = yield* dbFx((kysely) => {
		return kysely
			.selectFrom("user")
			.select("email")
			.where("id", "=", userId)
			.executeTakeFirstOrThrow();
	});

	const userStripe = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_stripe")
			.select([
				"customerId",
			])
			.where("userId", "=", userId)
			.orderBy("createdAt", "desc")
			.executeTakeFirst();
	});

	if (userStripe) {
		return {
			customerId: userStripe.customerId,
		};
	}

	const stripe = yield* stripeClientFx();
	const customer = yield* Effect.tryPromise({
		try() {
			return stripe.customers.create({
				email,
				metadata: {
					userId,
				},
			});
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe customer creation failed",
				cause: error,
			});
		},
	});
	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("user_stripe")
			.values({
				id: genId(),
				userId,
				customerId: customer.id,
				createdAt: now,
			})
			.onConflict((oc) => oc.column("userId").doNothing())
			.execute();
	});

	const ensuredUserStripe = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user_stripe")
			.select([
				"customerId",
			])
			.where("userId", "=", userId)
			.executeTakeFirstOrThrow();
	});

	return {
		customerId: ensuredUserStripe.customerId,
	};
});

export type billingCustomerEnsureFx = ReturnType<typeof billingCustomerEnsureFx>;
