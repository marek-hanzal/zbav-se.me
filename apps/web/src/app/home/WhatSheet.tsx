import { Status, Tx } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import {
	BuyerIcon,
	CheckIcon,
	SellerIcon,
	Sheet,
	ThemeCls,
	TypoIcon,
} from "@zbav-se.me/ui";
import type { FC } from "react";

export const WhatSheet: FC = () => {
	return (
		<Sheet tone="secondary">
			<div className="reveal flex flex-col justify-evenly h-[100dvh] py-16">
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
							<TypoIcon icon={CheckIcon}>
								<Tx
									label={"What - sellers (badge 1)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon icon={CheckIcon}>
								<Tx
									label={"What - sellers (badge 2)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon icon={CheckIcon}>
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
							<TypoIcon icon={CheckIcon}>
								<Tx
									label={"What - buyers (badge 1)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon icon={CheckIcon}>
								<Tx
									label={"What - buyers (badge 2)"}
									display={"block"}
									font={"bold"}
								/>
							</TypoIcon>

							<TypoIcon icon={CheckIcon}>
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
		</Sheet>
	);
};
