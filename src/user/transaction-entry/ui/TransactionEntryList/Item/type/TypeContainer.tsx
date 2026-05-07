import type { FC } from "react";
import { match } from "ts-pattern";
import { Group } from "@/lib/client/group";
import type { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";

export namespace TypeContainer {
	export interface Props extends Group.Props {
		direction: TransactionEntryDirectionEnumSchema.Type;
	}
}

export const TypeContainer: FC<TypeContainer.Props> = ({ direction, className, ...props }) => {
	return (
		<Group
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-inner="default"
			{...match<typeof direction, Partial<Group.Props>>(direction)
				.with("in", () => {
					return {
						"data-ui-tone": "neutral",
					};
				})
				.with("out", () => {
					return {
						"data-ui-tone": "link",
						"data-ui-opacity": "7",
					};
				})
				.with("system", () => {
					return {
						"data-ui-tone": "neutral",
					};
				})
				.exhaustive()}
			className={[
				"w-4/5",
				direction === "out" ? "ml-auto" : undefined,
				direction === "system" ? "w-full" : undefined,
				className,
			]}
			{...props}
		/>
	);
};
