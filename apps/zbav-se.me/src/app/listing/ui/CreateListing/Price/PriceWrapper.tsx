import { type FC, useState } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { Dial } from "~/app/ui/dial/Dial";

export const PriceWrapper: FC = () => {
	const [price, setPrice] = useState(NaN);

	return (
		<Sheet>
			<Dial
				value={price}
				onChange={setPrice}
			/>
		</Sheet>
	);
};
