import type { FC } from "react";
import { match } from "ts-pattern";
import type { uiContainer } from "@/lib/client/container";
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
			ui={{
				theme: "light",
				background: "alt",
				inner: "default",
				...match<typeof direction, uiContainer.Ui>(direction)
					.with("in", () => {
						return {
							tone: "neutral",
						};
					})
					.with("out", () => {
						return {
							tone: "link",
							opacity: "7",
						};
					})
					.with("system", () => {
						return {
							tone: "neutral",
						};
					})
					.exhaustive(),
				...ui,
			}}
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
