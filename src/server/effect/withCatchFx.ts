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

const impl = <A, E extends TaggedError, R, H extends HandlerMap<E>>(
	self: Effect.Effect<A, E, R>,
	handlers: ExactKeys<H, TagOf<E>>,
): Effect.Effect<A | HandlerOut<E, H>, never, R> =>
	self.pipe(
		Effect.catchAll((e) => {
			const tag = e._tag as TagOf<E>;
			const fn = handlers[tag] as (x: E) => HandlerOut<E, H>;
			return Effect.succeed(fn(e));
		}),
	);

export const withCatchFx: WithCatchFx = dual(2, impl);
