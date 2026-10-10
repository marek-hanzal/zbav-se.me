import { Effect } from "effect";
import { getFeedDefaultCreateFn } from "~/buyer-feed/service/getFeedDefaultCreateFn";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { dbFx } from "~/database/fx/dbFx";
import type { Database } from "~/database/type/Database";
import { genIdFn } from "~/identity/fn/genIdFn";

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
type UserRow = Database["user"];
const leaseIndexByKysely = new WeakMap<object, number>();
export const TEST_USER_PASSWORD = "12345678";

export function toLeasedTestUserEmailFn(key: LeaseKey) {
	return `test-${key}@zbav-se.me`;
}

function getNextLeaseKeyFn(kysely: object) {
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

	export interface User extends UserRow {
		password: typeof TEST_USER_PASSWORD;
	}
}

export const leaseTestUserFx = Effect.fn("leaseTestUserFx")(function* ({
	key,
}: leaseTestUserFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const resolvedKey = key ?? getNextLeaseKeyFn(kysely);
	const seededEmail = toLeasedTestUserEmailFn(resolvedKey);

	const user = yield* dbFx(async (kysely) =>
		kysely
			.selectFrom("user")
			.selectAll()
			.where("email", "=", seededEmail)
			.executeTakeFirstOrThrow(),
	);

	const userFeed = yield* dbFx(async (kysely) =>
		kysely
			.selectFrom("feed")
			.select("id")
			.where("userId", "=", user.id)
			.where("type", "=", "user")
			.executeTakeFirst(),
	);

	if (!userFeed) {
		const now = new Date();
		const feed = getFeedDefaultCreateFn(`Leased feed ${resolvedKey.toUpperCase()}`);

		yield* dbFx(async (kysely) =>
			kysely
				.insertInto("feed")
				.values({
					id: genIdFn(),
					userId: user.id,
					type: feed.type,
					name: feed.name,
					uploadId: null,
					query: JSON.stringify(feed.query) as any,
					createdAt: now,
					updatedAt: now,
				})
				.executeTakeFirstOrThrow(),
		);
	}

	return {
		...user,
		password: TEST_USER_PASSWORD,
	} satisfies leaseTestUserFx.User;
});
