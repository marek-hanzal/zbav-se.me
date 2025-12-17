import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction, tUpload } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";

export namespace TransactionItem {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	transaction,
	ui,
	className,
	...props
}) => {
	const [hero] = transaction.gallery.items.map((item) => item.upload) as [
		tUpload,
		...tUpload[],
	];

	return (
		<Container
			ui={{
				position: "relative",
				round: "default",
				...ui,
			}}
			className={[
				"h-48 md:h-92",
				className,
			]}
			{...props}
		>
			<HeroImage
				src={hero.url}
				alt={`Hero image for transaction ${transaction.id}`}
				ui={{
					round: "default",
				}}
			/>

			<Container
				ui={{
					tone: "secondary",
					theme: "light",
					color: "lead",
					flow: "vertical",
					background: "default",
					border: true,
					shadow: true,
					inner: "default",
					round: "default",
					snapTo: "bottom",
				}}
				className={"text-center"}
			>
				<Tx
					label={transaction.title}
					ui={{
						font: "bold",
					}}
				/>

				<Tx
					label={transaction.location.address}
					ui={{
						text: "sm",
					}}
				/>
			</Container>
		</Container>
	);
};
