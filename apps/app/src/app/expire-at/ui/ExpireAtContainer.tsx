import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc, VariantProvider } from "@use-pico/cls";
import { tListingExpireEnum } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { DateTime } from "luxon";
import { type FC, useId } from "react";
import { match } from "ts-pattern";

export namespace ExpireAtContainer {
	export interface Props extends Container.Props {
		value: tListingExpireEnum | undefined;
		onChange(value: tListingExpireEnum): void;
	}
}

export const ExpireAtContainer: FC<ExpireAtContainer.Props> = ({ value, onChange, ...props }) => {
	const expireId = useId();

	return (
		<Container
			data-ui="ExpireAtContainer"
			layout={"vertical-flex"}
			gap={"sm"}
			height={"auto"}
			width={"full"}
			{...props}
		>
			{Object.values(tListingExpireEnum).map((expire) => {
				return (
					<VariantProvider
						key={`${expireId}-${expire}`}
						cls={ThemeCls}
						variant={{
							tone: "primary",
							theme: value === expire ? "dark" : "light",
						}}
					>
						<Button
							data-ui="ExpireAtItem-root"
							onClick={() => {
								onChange(expire);
							}}
							size={"xl"}
							full
							className={tvc([
								"flex",
								"flex-row",
								"items-center",
								"justify-between",
								"gap-1",
							])}
						>
							<Tx
								label={`Expire in ${expire}`}
								font={"bold"}
							/>
							<Typo
								label={match(expire)
									.with("7-days", () =>
										DateTime.now()
											.plus({
												days: 7,
											})
											.toFormat("dd.MM.yyyy"),
									)
									.with("14-days", () =>
										DateTime.now()
											.plus({
												days: 14,
											})
											.toFormat("dd.MM.yyyy"),
									)
									.with("1-month", () =>
										DateTime.now()
											.plus({
												months: 1,
											})
											.toFormat("dd.MM.yyyy"),
									)
									.exhaustive()}
								size={"md"}
							/>
						</Button>
					</VariantProvider>
				);
			})}
		</Container>
	);
};
