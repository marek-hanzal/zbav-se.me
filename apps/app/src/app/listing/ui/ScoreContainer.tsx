import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingMetrics } from "@zbav-se.me/sdk/api/session";
import { ScoreIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ScoreContainer {
	export interface Props extends Container.Props {
		locale: string;
		listingMetrics: tListingMetrics;
	}
}

export const ScoreContainer: FC<ScoreContainer.Props> = ({ locale, listingMetrics, ...props }) => {
	return (
		<Container
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<Status
				icon={ScoreIcon}
				textTitle={"Listing Score - intro (title)"}
			/>

			{listingMetrics.score ? (
				<BadgeValue
					textLabel={"Listing Score - Raw score (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.score,
					})}
				/>
			) : null}

			{listingMetrics.score ? null : (
				<BadgeValue
					textLabel={"Listing Score - Raw score (label)"}
					textValue={"Listing Score - Raw score - no value (label)"}
				/>
			)}

			{/* 
                Views (active score)
            */}

			{listingMetrics.views ? (
				<BadgeValue
					textLabel={"Listing Score - Views (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.views,
					})}
				/>
			) : null}

			{listingMetrics.views ? null : (
				<BadgeValue
					textLabel={"Listing Score - Views (label)"}
					textValue={"Listing Score - Views - no value (label)"}
				/>
			)}

			{/* 
                Feed views (passive score)
            */}

			{listingMetrics.listing ? (
				<BadgeValue
					textLabel={"Listing Score - Feed views (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.listing,
					})}
				/>
			) : null}

			{listingMetrics.listing ? null : (
				<BadgeValue
					textLabel={"Listing Score - Feed views (label)"}
					textValue={"Listing Score - Feed views - no value (label)"}
				/>
			)}

			{/*
                Cart interactions
            */}

			{listingMetrics.cart ? (
				<BadgeValue
					textLabel={"Listing Score - Cart (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.cart,
					})}
				/>
			) : null}

			{listingMetrics.cart ? null : (
				<BadgeValue
					textLabel={"Listing Score - Cart (label)"}
					textValue={"Listing Score - Cart - no value (label)"}
				/>
			)}

			{/*
                Ignore interactions
            */}

			{listingMetrics.ignore ? (
				<BadgeValue
					textLabel={"Listing Score - Ignore (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.ignore,
					})}
				/>
			) : null}

			{listingMetrics.ignore ? null : (
				<BadgeValue
					textLabel={"Listing Score - Ignore (label)"}
					textValue={"Listing Score - Ignore - no value (label)"}
				/>
			)}

			{/*
                Flag interactions
            */}

			{listingMetrics.flag ? (
				<BadgeValue
					textLabel={"Listing Score - Flag (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.flag,
					})}
				/>
			) : null}

			{listingMetrics.flag ? null : (
				<BadgeValue
					textLabel={"Listing Score - Flag (label)"}
					textValue={"Listing Score - Flag - no value (label)"}
				/>
			)}
		</Container>
	);
};
