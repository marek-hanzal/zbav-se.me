import { Effect } from "effect";
import { dual } from "effect/Function";

type TaggedError = {
	readonly _tag: string;
};
type TagOf<E extends TaggedError> = E["_tag"] & string;

type HandlerMap<E extends TaggedError> = {
	readonly [K in TagOf<E>]: (
		e: Extract<
			E,
			{
				readonly _tag: K;
			}
		>,
	) => unknown;
};

type HandlerOut<E extends TaggedError, H extends HandlerMap<E>> = ReturnType<H[TagOf<E>]>;

type ExactKeys<Obj, Keys extends PropertyKey> = Obj & Record<Exclude<keyof Obj, Keys>, never>;

type WithCatchFx = {
	<E extends TaggedError, H extends HandlerMap<E>>(
		handlers: ExactKeys<H, TagOf<E>>,
	): <A, R>(self: Effect.Effect<A, E, R>) => Effect.Effect<A | HandlerOut<E, H>, never, R>;

	<A, E extends TaggedError, R, H extends HandlerMap<E>>(
		self: Effect.Effect<A, E, R>,
		handlers: ExactKeys<H, TagOf<E>>,
	): Effect.Effect<A | HandlerOut<E, H>, never, R>;
};

const implFx = <A, E extends TaggedError, R, H extends HandlerMap<E>>(
	self: Effect.Effect<A, E, R>,
	handlers: ExactKeys<H, TagOf<E>>,
): Effect.Effect<A | HandlerOut<E, H>, never, R> =>
	self.pipe(
		Effect.catch((e) => {
			const tag = e._tag as TagOf<E>;
			const fnFn = handlers[tag] as (x: E) => HandlerOut<E, H>;
			return Effect.succeed(fnFn(e));
		}),
	);

export const withCatchFx: WithCatchFx = dual(2, implFx);
