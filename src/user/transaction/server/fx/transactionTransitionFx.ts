import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";
import type { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

/**
 * Shared transition blocks reused by the main machine.
 *
 * The goal here is not to be clever; it is just a small deduplication helper for
 * states that currently share the same allowed requests. The real source of truth
 * remains `Transitions.Machine` below.
 */
const LittleMachine = {
	interest: [
		// interest
		{
			request: "trade",
			side: "seller",
		},
		// status
		{
			request: "status-trade",
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
		// buyer-side buffer
		{
			request: "text",
			side: "buyer",
		},
	],
	trade: [
		// trade
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
	 * Every recognized input the machine can validate.
	 *
	 * This intentionally includes both:
	 * - transaction statuses (`interest`, `trade`, ...)
	 * - transaction entry kinds (`text`, `gallery`, `status-trade`, ...)
	 *
	 * Reason:
	 * the same gate is used both for validating status transitions and for
	 * validating whether a concrete transaction entry may be created in the
	 * current transaction state.
	 */
	export type Kind = TransactionStatusEnumSchema.Type | TransactionEntryKindEnumSchema.Type;

	/**
	 * One allowed request from one concrete state.
	 */
	export interface Entry {
		request: Kind;
		side: TransactionSideEnumSchema.Type | null;
	}

	/**
	 * Terminal statuses that trigger cleanup of sensitive structured entries.
	 */
	export const CleanupSensitiveStatus: readonly TransactionStatusEnumSchema.Type[] = [
		"sold",
		"rejected",
		"expired",
		"success",
		"closed",
	];

	/**
	 * Main transaction state machine.
	 *
	 * This is the server-side source of truth for transaction flow rules.
	 *
	 * We validate three things through this one machine:
	 * 1. status -> status transitions
	 * 2. status -> status-message transitions (`status-*`)
	 * 3. status -> user-authored transaction-entry writes (`text`, `gallery`, ...)
	 *
	 * Reading rule:
	 * - object key = current transaction state we are validating from
	 * - array item = one allowed request from that state
	 * - empty array = hard stop, nothing more is allowed from that state
	 */
	export const Machine = {
		null: [
			// bootstrap
			{
				request: "interest",
				side: "buyer",
			},
			// status
			{
				request: "status-interest",
				side: "buyer",
			},
		],
		//
		interest: LittleMachine.interest,
		"status-interest": LittleMachine.interest,
		trade: LittleMachine.trade,
		"status-trade": LittleMachine.trade,
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
		 * Current transaction state we are validating against.
		 *
		 * This is intentionally `Transitions.Kind | null`, not just the plain status
		 * enum, because the machine is also used when we validate status-message and
		 * transaction-entry requests against the current flow state.
		 *
		 * `null` is the bootstrap state used before the very first transition exists.
		 */
		status: Transitions.Kind | null;
		/**
		 * Requested transition/input we want to allow.
		 *
		 * This may be:
		 * - a target transaction status
		 * - a `status-*` transaction entry kind
		 * - a user-authored transaction entry kind
		 */
		request: Transitions.Kind;
		/**
		 * Side this request is evaluated for.
		 *
		 * Use `null` for side-agnostic system transitions, for example expiration.
		 */
		side: TransactionSideEnumSchema.Type | null;
	}
}

/**
 * Validates whether a requested transaction action is allowed from the current
 * transaction state.
 *
 * Important:
 * - this function is a pure gate; it does not write anything
 * - callers are expected to run it before they mutate status or append entries
 * - when validation fails, the request dies with `InvalidRequestErrorFx`
 *
 * In practice this is the single backend reference for:
 * - "which status may follow which status"
 * - "who may trigger that transition"
 * - "which transaction-entry kinds are allowed in each state"
 */
export const transactionTransitionFx = Effect.fn("transactionTransitionFx")(function* (
	props: transactionTransitionFx.Props,
) {
	const logger = yield* getLoggerFx("transactionTransitionFx");
	logger.trace("transactionTransitionFx", {
		...props,
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
