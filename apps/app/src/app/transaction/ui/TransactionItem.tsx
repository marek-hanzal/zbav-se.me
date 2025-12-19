import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tUpload, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { TransactionSheet } from "~/app/transaction/ui/TransactionSheet";

export namespace TransactionItem {
	export interface Props extends Container.Props {
		transactionId: string;
		side: tUserSideEnum;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	transactionId,
	side,
	ui,
	className,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<withTransactionFetchQuery.Suspense
				data={{
					where: {
						id: transactionId,
					},
				}}
				fallback={
					<SpinnerContainer
						type={"icon"}
						ui={{
							tone: "neutral",
							theme: "light",
							background: "default",
							border: true,
							shadow: true,
							round: "default",
						}}
						className={[
							"h-48 md:h-92",
						]}
						onClick={() => setIsOpen((prev) => !prev)}
					/>
				}
			>
				{({ data: transaction }) => {
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
							onClick={() => setIsOpen((prev) => !prev)}
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
				}}
			</withTransactionFetchQuery.Suspense>

			<TransactionSheet
				side={side}
				transactionId={transactionId}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};
