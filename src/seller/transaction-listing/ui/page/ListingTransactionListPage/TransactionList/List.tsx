import type { FC } from "react";
import { Suspense } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { Item } from "./Item";

export namespace List {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionIds: string[];
	}
}

export const List: FC<List.Props> = ({ _suspense, transactionIds, ...props }) => {
	return (
		<Container
			data-ui={"List"}
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{transactionIds.map((transactionId) => {
				return (
					<Suspense
						key={transactionId}
						fallback={<Item.Fallback />}
					>
						<Item
							data-id={transactionId}
							_suspense={_suspense}
							transactionId={transactionId}
						/>
					</Suspense>
				);
			})}
		</Container>
	);
};
