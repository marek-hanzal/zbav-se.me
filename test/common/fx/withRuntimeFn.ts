import { getLogger } from "@logtape/logtape";
import type { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import type { Database } from "~/database/type/Database";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withTestGeoapifyFn } from "~/test/common/fn/withTestGeoapifyFn";
import { withTransactionContextFn } from "~/user-transaction/fn/withTransactionContextFn";
import { withUploadConfigEnvFn } from "~/user-upload/fn/withUploadConfigEnvFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";

type TestDatabase = withDatabaseFx.Instance<Database>;

const logger = getLogger("zbav-se.me");

const withBaseRuntimeFn = (database: TestDatabase) => {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withLoggerFn(logger),
			withKyselyFn(database),
			withDateServiceFn(),
			withTransactionContextFn(),
			withUploadConfigFn(withUploadConfigEnvFn()),
		);
};

export const withRuntimeFn = (database: TestDatabase) => {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(withBaseRuntimeFn(database), withTestGeoapifyFn());
};
