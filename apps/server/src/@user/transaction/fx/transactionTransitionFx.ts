import { Effect } from "effect";
import type { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { traceLogFx } from "~/effect/traceLogFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

const LittleMachine = {
	pending: [
		// pending
		{
			request: "open",
			side: "seller",
		},
		// status
		{
			request: "status-open",
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
		// status
		{
			request: "status-rejected-buyer",
			side: "buyer",
		},
		{
			request: "status-rejected-seller",
			side: "seller",
		},
		// terminal
		{
			request: "expired",
			side: null,
		},
		// status
		{
			request: "status-expired",
			side: null,
		},
	],
	open: [
		// open
		{
			request: "resolved",
			side: "seller",
		},
		// status
		{
			request: "status-resolved",
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
		// status
		{
			request: "status-rejected-buyer",
			side: "buyer",
		},
		{
			request: "status-rejected-seller",
			side: "seller",
		},
		// terminal
		{
			request: "expired",
			side: null,
		},
		// status
		{
			request: "status-expired",
			side: null,
		},
		// entries
		{
			request: "text",
			side: "buyer",
		},
		{
			request: "text",
			side: "seller",
		},
		{
			request: "gallery",
			side: "buyer",
		},
		{
			request: "gallery",
			side: "seller",
		},
		{
			request: "location",
			side: "buyer",
		},
		{
			request: "location",
			side: "seller",
		},
		{
			request: "personal",
			side: "buyer",
		},
		{
			request: "personal",
			side: "seller",
		},
		// seller-only
		{
			request: "package",
			side: "seller",
		},
	],
	resolved: [
		// entries
		{
			request: "text",
			side: "buyer",
		},
		{
			request: "text",
			side: "seller",
		},
		// resolved
		{
			request: "dispute",
			side: "buyer",
		},
		{
			request: "dispute",
			side: "seller",
		},
		// status
		{
			request: "status-dispute-buyer",
			side: "buyer",
		},
		{
			request: "status-dispute-seller",
			side: "seller",
		},
		// terminal
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
		// status
		{
			request: "status-success",
			side: "buyer",
		},
		{
			request: "status-closed",
			side: "buyer",
		},
		{
			request: "status-expired",
			side: null,
		},
	],
	dispute: [
		// dispute
		{
			request: "resolved",
			side: "seller",
		},
		// status
		{
			request: "status-resolved",
			side: "seller",
		},
		// terminal
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
		// status
		{
			request: "status-success",
			side: "buyer",
		},
		{
			request: "status-closed",
			side: "buyer",
		},
		{
			request: "status-expired",
			side: null,
		},
		// entries
		{
			request: "text",
			side: "buyer",
		},
		{
			request: "text",
			side: "seller",
		},
		{
			request: "gallery",
			side: "buyer",
		},
		{
			request: "gallery",
			side: "seller",
		},
		{
			request: "location",
			side: "buyer",
		},
		{
			request: "location",
			side: "seller",
		},
		{
			request: "personal",
			side: "buyer",
		},
		{
			request: "personal",
			side: "seller",
		},
		// seller-only
		{
			request: "package",
			side: "seller",
		},
	],
} as const satisfies Partial<Record<Transitions.Kind, Transitions.Entry[]>>;

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
		"sold",
		"rejected",
		"expired",
		"success",
		"closed",
	];

	/**
	 * State machine - allowed transitions - input is "request", output are allowed states; when an empty
	 * array, transition is not allowed.
	 */
	export const Machine = {
		null: [
			// bootstrap
			{
				request: "pending",
				side: "buyer",
			},
			// status
			{
				request: "status-pending",
				side: "buyer",
			},
		],
		//
		pending: LittleMachine.pending,
		"status-pending": LittleMachine.pending,
		open: LittleMachine.open,
		"status-open": LittleMachine.open,
		resolved: LittleMachine.resolved,
		"status-resolved": LittleMachine.resolved,
		dispute: LittleMachine.dispute,
		"status-dispute-buyer": LittleMachine.dispute,
		"status-dispute-seller": LittleMachine.dispute,
		sold: [],
		"status-sold": [],
		rejected: [],
		"status-rejected-buyer": [],
		"status-rejected-seller": [],
		expired: [],
		"status-expired": [],
		success: [],
		"status-success": [],
		closed: [],
		"status-closed": [],
		//
		text: [],
		gallery: [],
		location: [],
		package: [],
		personal: [],
	} as const satisfies Record<"null" | Kind, Entry[]>;
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
