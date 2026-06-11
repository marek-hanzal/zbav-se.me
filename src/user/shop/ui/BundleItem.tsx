import type { FC, KeyboardEvent } from "react";
import { useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import type { BundleSchema } from "~/user/stripe/server/schema/BundleSchema";
import { BundleSheet } from "./BundleSheet";

export namespace BundleItem {
	export interface Props extends Group.Props {
		bundle: BundleSchema.Type;
	}
}

export const BundleItem: FC<BundleItem.Props> = ({ bundle, className, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);
	const isActive = Boolean(bundle.active);
	const open = () => {
		setIsOpen(true);
	};

	const openByKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		open();
	};

	return (
		<>
			<Group
				data-ui="BundleItem"
				data-resource-bundle={bundle.bundle}
				data-ui-bundle={bundle.bundle}
				data-ui-bundle-status={isActive}
				data-ui-tone={isActive ? "secondary" : "neutral"}
				data-ui-theme="light"
				data-ui-background={isActive ? "alt" : "default"}
				data-ui-border={true}
				data-ui-shadow={isActive}
				data-ui-inner="lg"
				role="button"
				tabIndex={0}
				className={[
					"cursor-pointer",
					className,
				]}
				onClick={open}
				onKeyDown={openByKeyboard}
				{...props}
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-gap="sm"
					data-ui-width="full"
				>
					<Container
						data-ui-flow="horizontal"
						data-ui-items="start"
						data-ui-justify="space-between"
						data-ui-gap="default"
						data-ui-width="full"
					>
						<Typo
							label={bundle.name}
							preset="subheader"
						/>

						<Typo
							label={
								<PriceInline
									price={bundle.price / 100}
									locale={locale}
									currency={bundle.currency.toUpperCase()}
								/>
							}
							data-ui-font="bold"
						/>
					</Container>

					<Container
						data-ui-flow="horizontal"
						data-ui-items="center"
						data-ui-justify="space-between"
						data-ui-gap="default"
						data-ui-width="full"
					>
						<Typo
							label={bundle.description}
							data-ui-opacity="7"
							data-ui-text="sm"
							className="line-clamp-3"
						/>

						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
							data-ui-color="lead"
							className="shrink-0"
						/>
					</Container>

					{bundle.active ? null : (
						<Typo
							label={translator.text("See the bundle detail (label)")}
							data-ui-color="lead"
							data-ui-font="bold"
							data-ui-text="sm"
						/>
					)}

					{bundle.active ? (
						<Container
							data-ui-layout="horizontal-flex"
							data-ui-items="center"
							data-ui-justify="space-between"
							data-ui-gap="xs"
						>
							<Typo
								label={translator.text("Active")}
								data-ui-color="lead"
								data-ui-font="normal"
								data-ui-text="sm"
							/>

							{bundle.active.periodEndAt ? (
								<Container
									data-ui-flow="horizontal"
									data-ui-gap="default"
									data-ui-items="center"
								>
									<Typo
										label={translator.text(
											bundle.active.cancelAtPeriodEnd
												? "Subscription ends summary (label)"
												: "Subscription renewal summary (label)",
										)}
										data-ui-color="lead"
										data-ui-text="sm"
									/>

									<Typo
										label={toTimeDiff({
											locale,
											time: bundle.active.periodEndAt,
											type: "human",
										})}
										data-ui-color="lead"
										data-ui-font="bold"
										data-ui-text="md"
									/>
								</Container>
							) : null}
						</Container>
					) : null}
				</Container>
			</Group>

			<BundleSheet
				bundle={bundle}
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
			/>
		</>
	);
};
