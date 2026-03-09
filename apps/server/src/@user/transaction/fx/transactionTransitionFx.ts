import { Effect } from "effect";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace Transitions {
	export type Status = TransactionStatusEnumSchema.Type | null;
	export type Side = TransactionSideEnumSchema.Type | null;
	export type Request = TransactionStatusEnumSchema.Type | "message";
	export type StatusRequest = TransactionStatusEnumSchema.Type;

	export interface Entry {
		request: Request;
		side: Side;
	}

	export const CleanupSensitiveStatus: readonly StatusRequest[] = [
		"rejected",
		"expired",
		"success",
		"closed",
	];

	export const Map: Record<"null" | TransactionStatusEnumSchema.Type, Entry[]> = {
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
				request: "message",
				side: "buyer",
			},
			{
				request: "message",
				side: "seller",
			},
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
				request: "message",
				side: "buyer",
			},
			{
				request: "message",
				side: "seller",
			},
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
		status: Transitions.Status;
		/**
		 * Requested transaction action or target status transition.
		 */
		request: Transitions.Request;
		/**
		 * Side this request is meant for.
		 *
		 * Use `null` for side-agnostic system transitions.
		 */
		side: Transitions.Side;
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

		const allowedTransitions = Transitions.Map[props.status ?? "null"];
		const transition = allowedTransitions.find(
			(transition) => transition.request === props.request && transition.side === props.side,
		);

		if (!transition) {
			return yield* new InvalidRequestErrorFx({
				message: `Invalid transaction status transition from ${props.status ?? "null"} to ${props.request} for ${props.side ?? "system"}`,
			});
		}
	},
);

export type transactionTransitionFx = ReturnType<typeof transactionTransitionFx>;
