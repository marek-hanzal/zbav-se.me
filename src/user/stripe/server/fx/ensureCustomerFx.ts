import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace ensureCustomerFx {
	export interface Props {
		userId: string;
	}
}

export const ensureCustomerFx = Effect.fn("ensureCustomerFx")(function* ({
	userId,
}: ensureCustomerFx.Props) {
	const logger = yield* getLoggerFx("ensureCustomerFx");
	logger.trace("ensureCustomerFx", {
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
	const customer = yield* Effect.promise(() => {
		return stripe.customers.create({
			email,
			metadata: {
				userId,
			},
		});
	});
	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();

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

export type ensureCustomerFx = ReturnType<typeof ensureCustomerFx>;
