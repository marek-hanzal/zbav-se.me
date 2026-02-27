import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { useHeroUpload } from "~/app/@common/gallery/hook/useHeroUpload";
import { TransactionSheet } from "~/app/v0/@buyer-user/transaction/ui/TransactionSheet";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, transactionId, ui, className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: transaction } = withTransactionQuery.useQuery(transactionId);
	const hero = useHeroUpload(transaction.gallery.items);

	return (
		<>
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
									opacity: "8",
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

			<TransactionSheet
				transactionId={transactionId}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				refresh={1_000 * 5}
			/>
		</>
	);
};
