import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { NoticeSchema } from "@/lib/common/schema";
import { StripeEventTableSchema } from "~/server/database/@table/StripeEventTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { StripeConfigFx } from "../context/StripeConfigFx";
import { stripeClientFx } from "./stripeClientFx";
import { syncFx } from "./sync/syncFx";

export namespace webhookFx {
	export interface Props {
		/**
		 * Stripe-Signature header.
		 */
		signature: string;
		/**
		 * Raw request body. Stripe signature verification requires the unparsed body.
		 */
		content(): Promise<string>;
	}
}

/**
 * Stripe webhook inbox.
 *
 * This Fx verifies the event, stores it once for idempotency/audit, and delegates to
 * syncFx. It deliberately does not contain event-specific business rules.
 */
export const webhookFx = Effect.fn("webhookFx")(function* (props: webhookFx.Props) {
	const logger = yield* getLoggerFx("webhookFx");
	logger.trace("webhookFx");

	const stripeConfig = yield* StripeConfigFx;
	const stripe = yield* stripeClientFx();

	const event = yield* Effect.promise(async () => {
		return stripe.webhooks.constructEvent(
			await props.content(),
			props.signature,
			stripeConfig.webhook,
		);
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			const stripeEvent = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("stripe_event")
					.values({
						id: genId(),
						eventId: event.id,
						type: event.type,
						payload: StripeEventTableSchema.shape.payload.parse(event),
						createdAt: dateContext.now().toJSDate(),
						processedAt: null,
					})
					.onConflict((oc) => {
						return oc.column("eventId").doNothing();
					})
					.returning([
						"id",
						"processedAt",
					])
					.executeTakeFirst();
			});

			if (!stripeEvent) {
				return {
					type: "warning",
					message: `Duplicate event [${event.type}]`,
				} satisfies NoticeSchema.Type;
			}

			yield* syncFx({
				event,
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("stripe_event")
					.set({
						processedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", stripeEvent.id)
					.execute();
			});

			return {
				type: "info",
				message: "Success",
			} satisfies NoticeSchema.Type;
		}),
	);
});

export type webhookFx = ReturnType<typeof webhookFx>;
