import { Effect } from "effect";
import type { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace Transitions {
	/**
	 * All recognized transition kinds.
	 */
	export type Kind = TransactionStatusEnumSchema.Type | TransactionEntryKindEnumSchema.Type;

	export interface Entry {
		request: Kind;
		side: TransactionSideEnumSchema.Type | null;
	}

	export const CleanupSensitiveStatus: readonly TransactionStatusEnumSchema.Type[] = [
		"rejected",
		"expired",
		"success",
		"closed",
	];

	/**
	 * State machine - allowed transitions - input is "request", output are allowed states; when an empty
	 * array, transition is not allowed.
	 */
	export const Machine: Record<"null" | Kind, Entry[]> = {
		null: [
			{
				request: "pending",
				side: "buyer",
			},
		],
		pending: [
			{
				request: "open",
				side: "seller",
			},
			{
				request: "rejected",
				side: "buyer",
			},
			{
				request: "rejected",
				side: "seller",
			},
			{
				request: "expired",
				side: null,
			},
		],
		open: [
			{
				request: "resolved",
				side: "seller",
			},
			{
				request: "rejected",
				side: "buyer",
			},
			{
				request: "rejected",
				side: "seller",
			},
			{
				request: "expired",
				side: null,
			},
		],
		resolved: [
			{
				request: "dispute",
				side: "buyer",
			},
			{
				request: "dispute",
				side: "seller",
			},
			{
				request: "success",
				side: "buyer",
			},
			{
				request: "closed",
				side: "buyer",
			},
			{
				request: "expired",
				side: null,
			},
		],
		dispute: [
			{
				request: "resolved",
				side: "seller",
			},
			{
				request: "success",
				side: "buyer",
			},
			{
				request: "closed",
				side: "buyer",
			},
			{
				request: "expired",
				side: null,
			},
		],
		rejected: [],
		expired: [],
		success: [],
		closed: [],
	};
}

export namespace transactionTransitionFx {
	export interface Props {
		/**
		 * Current transaction status we are validating against.
		 */
		status: Transitions.Kind | null;
		/**
		 * Requested transaction action or target status transition.
		 */
		request: Transitions.Kind;
		/**
		 * Side this request is meant for.
		 *
		 * Use `null` for side-agnostic system transitions.
		 */
		side: TransactionSideEnumSchema.Type | null;
	}
}

export const transactionTransitionFx = Effect.fn("transactionTransitionFx")(function* (
	props: transactionTransitionFx.Props,
) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionTransitionFx",
		input: props,
	});

	const allowedTransitions = Transitions.Machine[props.status ?? "null"];
	const transition = allowedTransitions.find(
		(transition) => transition.request === props.request && transition.side === props.side,
	);

	if (!transition) {
		return yield* new InvalidRequestErrorFx({
			message: `Invalid transaction status transition from ${props.status ?? "null"} to ${props.request} for ${props.side ?? "system"}`,
		});
	}
});

export type transactionTransitionFx = ReturnType<typeof transactionTransitionFx>;
