import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingMetrics } from "@zbav-se.me/sdk/api/user";
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
			ui={{
				layout: "vertical-flex",
				gap: "default",
			}}
			{...props}
		>
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
					textValue={0}
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
					textValue={0}
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
					textValue={0}
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
					textValue={0}
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
					textValue={0}
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
					textValue={0}
				/>
			)}
		</Container>
	);
};
