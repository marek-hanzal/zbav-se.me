import { PriceInline, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Sheet } from "~/app/sheet/Sheet";
import { Dial } from "~/app/ui/dial/Dial";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";

export const PriceWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const price = useCreateListingStore((store) => store.price);
	const setPrice = useCreateListingStore((store) => store.setPrice);

	return (
		<Sheet>
			<Status
				icon={PriceIcon}
				textTitle={
					<div
						className={
							"inline-flex justify-between items-center gap-2"
						}
					>
						<Tx label={"Price"} />
						<PriceInline
							value={{
								price,
								withVat: undefined,
							}}
						/>
					</div>
				}
			/>

			<Dial
				value={price}
				onChange={setPrice}
			/>
		</Sheet>
	);
};
