import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { BuyerIcon, CheckIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import type { FC } from "react";

export const WhatSheet: FC = () => {
	return (
		<Container
			layout={"vertical-centered"}
			items={"center"}
			className={"reveal"}
		>
			<div className="flex flex-col justify-evenly h-dvh py-16">
				<Status
					icon={SellerIcon}
					tone={"primary"}
					textTitle={"What - sellers (title)"}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "primary",
							theme: "light",
						}}
					>
						<div className="flex flex-col gap-1">
							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - sellers (badge 1)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - sellers (badge 2)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - sellers (badge 3)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>
						</div>
					</VariantProvider>
				</Status>

				<Status
					icon={BuyerIcon}
					tone={"secondary"}
					theme={"light"}
					textTitle={"What - buyers (title)"}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<div className="flex flex-col gap-1">
							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - buyers (badge 1)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - buyers (badge 2)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - buyers (badge 3)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>
						</div>
					</VariantProvider>
				</Status>
			</div>
		</Container>
	);
};
