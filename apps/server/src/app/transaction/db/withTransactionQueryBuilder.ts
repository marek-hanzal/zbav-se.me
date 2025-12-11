import { match } from "ts-pattern";
import type { TransactionFilterSchema } from "~/app/transaction/schema/TransactionFilterSchema";
import type { TransactionMetaSchema } from "~/app/transaction/schema/TransactionMetaSchema";
import type { withTransactionSelect } from "./withTransactionSelect";

export namespace withTransactionQueryBuilder {
	export interface Props {
		select: withTransactionSelect.Select;
		where?: TransactionFilterSchema.Type;
		meta?: TransactionMetaSchema.Type;
	}

	export type Callback = (props: Props) => withTransactionSelect.Select;
}

export const withTransactionQueryBuilder: withTransactionQueryBuilder.Callback = ({
	select,
	where,
	meta,
}) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("lt.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("lt.id", "in", where.idIn);
	}

	if (where.userId) {
		const userId = where.userId;
		const userSide = meta?.side;

		query = query.where((eb) => {
			const buyerCondition = eb("lt.userId", "=", userId);
			const sellerCondition = eb.exists((eb) =>
				eb
					.selectFrom("listing as l")
					.select("l.id")
					.whereRef("l.id", "=", "lt.listingId")
					.where("l.userId", "=", userId),
			);

			return match(userSide)
				.with("buyer", () => {
					return buyerCondition;
				})
				.with("seller", () => {
					return sellerCondition;
				})
				.with(undefined, () => {
					return eb.or([
						buyerCondition,
						sellerCondition,
					]);
				})
				.exhaustive();
		});
	}

	if (where.listingId) {
		query = query.where("lt.listingId", "=", where.listingId);
	}

	if (where.status) {
		const status = where.status;

		query = query.where((eb) => {
			return eb.exists((eb) =>
				eb
					.selectFrom("transaction_status as lts")
					.select("lts.id")
					.whereRef("lts.transactionId", "=", "lt.id")
					.where("lts.status", "=", status)
					.where((eb) => {
						return eb.not(
							eb.exists((eb) =>
								eb
									.selectFrom("transaction_status as lts2")
									.select("lts2.id")
									.whereRef("lts2.transactionId", "=", "lt.id")
									.whereRef("lts2.createdAt", ">", "lts.createdAt"),
							),
						);
					}),
			);
		});
	}

	if (where.statusIn && where.statusIn.length > 0) {
		const statusIn = where.statusIn;

		query = query.where((eb) => {
			return eb.exists((eb) =>
				eb
					.selectFrom("transaction_status as lts")
					.select("lts.id")
					.whereRef("lts.transactionId", "=", "lt.id")
					.where("lts.status", "in", statusIn)
					.where((eb) => {
						return eb.not(
							eb.exists((eb) =>
								eb
									.selectFrom("transaction_status as lts2")
									.select("lts2.id")
									.whereRef("lts2.transactionId", "=", "lt.id")
									.whereRef("lts2.createdAt", ">", "lts.createdAt"),
							),
						);
					}),
			);
		});
	}

	return query;
};
