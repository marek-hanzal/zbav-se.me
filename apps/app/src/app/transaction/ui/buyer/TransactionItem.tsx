import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { TransactionSheet } from "~/app/transaction/ui/buyer/TransactionSheet";

export namespace TransactionItem {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	transactionId,
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
					// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
					const hero = useHeroUpload(transaction.gallery.items);

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
							{match(transaction.status)
								.with("rejected", "expired", "success", "closed", () => {
									return (
										<Container
											data-ui="TransactionItem-[Overlay]"
											ui={{
												tone: "neutral",
												theme: "light",
												background: "default",
												opacity: "low",
											}}
											className={[
												"absolute",
												"inset-0",
											]}
										/>
									);
								})
								.with("open", "pending", "resolved", "dispute", () => {
									return null;
								})
								.exhaustive()}

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
				transactionId={transactionId}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				refresh={1_000 * 5}
			/>
		</>
	);
};
