import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

const TEST_USER_KEYS = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
] as const;

type LeaseKey = (typeof TEST_USER_KEYS)[number];
const leaseIndexByKysely = new WeakMap<object, number>();

function getNextLeaseKey(kysely: object) {
	const current = leaseIndexByKysely.get(kysely) ?? 0;
	const nextKey = TEST_USER_KEYS[current];

	if (!nextKey) {
		throw new Error("Ran out of seeded test users");
	}

	leaseIndexByKysely.set(kysely, current + 1);

	return nextKey;
}

export namespace leaseTestUserFx {
	export interface Props {
		key?: LeaseKey;
	}
}

export const leaseTestUserFx = Effect.fn("leaseTestUserFx")(function* ({
	key,
}: leaseTestUserFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const resolvedKey = key ?? getNextLeaseKey(kysely);
	const seededEmail = `test-${resolvedKey}@test.cz`;

	return yield* tryDbFx(async () =>
		kysely
			.selectFrom("user")
			.selectAll()
			.where("email", "=", seededEmail)
			.executeTakeFirstOrThrow(),
	);
});
