import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export const FilterEmpty: FC = () => {
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				data-ui={"MyListing-[Status.filter-empty]"}
				icon={SearchIcon}
				textTitle={translator.text("No listings for current filter (title)")}
				textMessage={translator.text("No listings for current filter (message)")}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className="text-center"
			/>
		</Container>
	);
};
