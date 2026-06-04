import { Effect } from "effect";
import type { Stripe } from "stripe";
import { getLoggerFx } from "@/lib/common/log";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { lineItemCollectionFx } from "~/user/stripe/server/fx/lineItemCollectionFx";
import { subscriptionFetchFx } from "~/user/stripe/server/fx/subscriptionFetchFx";
import { billingSubscriptionSyncFx } from "../../../billingSubscriptionSyncFx";

export namespace eventCompletedFx {
	export interface Props {
		event: Stripe.Event;
	}
}

export const eventCompletedFx = Effect.fn("eventCompletedFx")(function* ({
	event,
}: eventCompletedFx.Props) {
	const logger = yield* getLoggerFx("eventCompletedFx");
	logger.trace("eventCompletedFx", {
		eventId: event.id,
		type: event.type,
	});

	const session = event.data.object as Stripe.Checkout.Session;
	const userId = session.client_reference_id ?? session.metadata?.userId;

	if (!userId) {
		logger.error("Cannot resolve userId from a stripe event", {
			event,
		});

		return new RuntimeErrorFx({
			message: "Cannot resolve userId from a stripe event.",
		});
	}

	const { line_items: lineItems } = session;

	if (lineItems?.data?.length) {
		const items = yield* lineItemCollectionFx({
			lineItems: lineItems.data,
		});

        // TODO: create general user limit fx and user item fx which will grant to his default bundle those lineItems
	}

	if (session.subscription) {
		return yield* billingSubscriptionSyncFx({
			subscription: yield* subscriptionFetchFx({
				id: session.subscription,
			}),
		});
	}
});

export type eventCompletedFx = ReturnType<typeof eventCompletedFx>;
