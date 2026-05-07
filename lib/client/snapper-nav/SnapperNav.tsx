import { type FC, useCallback, useId, useMemo } from "react";
import type { ui } from "../cls";
import { Container } from "../container/Container";
import { useDoubleTap } from "../double-tap/useDoubleTap";
import type { uiIcon } from "../icon";
import { DotIcon } from "../icon/DotIcon";
import { Icon } from "../icon/Icon";
import type { useSnapperNav } from "../snapper/useSnapperNav";

const activeIconUi = {
	"data-ui-text": "lg",
	"data-ui-color": "lead",
} satisfies ui.Data<uiIcon.Ui, keyof uiIcon.Ui>;

export namespace SnapperNav {
	export namespace IconProps {
		export interface Props {
			limit: boolean;
			active: boolean | undefined;
			index: number | undefined;
		}

		export type IconPropsFn = (props: Props) => Icon.PropsEx;
	}

	export interface Page {
		id: string;
		icon: Icon.Type;
		/**
		 * Overrides the default icon props for the given page.
		 *
		 * Keep in mind this affects only pages, not the limiter (edges).
		 */
		iconProps?: IconProps.IconPropsFn;
	}

	export interface Count {
		count: number;
		icon?: Icon.Type;
	}

	export interface Props extends Container.Props {
		snapperNav: useSnapperNav.Result;
		pages?: Page[] | Count;
		iconProps?: IconProps.IconPropsFn;
		limit?: number;
	}
}

export const SnapperNav: FC<SnapperNav.Props> = ({
	snapperNav,
	pages,
	//
	iconProps,
	limit = 5,
	//
	...props
}) => {
	const pageId = useId();
	const $pages: SnapperNav.Page[] = pages
		? Array.isArray(pages)
			? pages
			: Array.from(
					{
						length: pages.count,
					},
					(_, i) => ({
						id: `${pageId}-${i}`,
						icon: pages.icon ?? DotIcon,
					}),
				)
		: Array.from(
				{
					length: snapperNav.state.count,
				},
				(_, i) => ({
					id: `${pageId}-${i}`,
					icon: DotIcon,
				}),
			);

	const firstDoubleTap = useDoubleTap({
		onDoubleTap: snapperNav.api.start,
	});

	const lastDoubleTap = useDoubleTap({
		onDoubleTap: snapperNav.api.end,
	});

	// Control ids (stable, unique) for start/end buttons.
	const firstId = useId();
	const lastId = useId();

	const flow = useMemo(() => {
		if (!limit) {
			return $pages.map((_, i) => i);
		}

		const total = $pages.length;
		if (total === 0) {
			return [];
		}

		const visible = Math.max(1, Math.min(limit, total));
		const half = Math.floor((visible - 1) / 2);
		let start = snapperNav.state.current - half;
		start = Math.max(0, Math.min(start, total - visible));

		const out: number[] = [];
		for (let i = 0; i < visible; i++) {
			out.push(start + i);
		}
		return out;
	}, [
		limit,
		$pages,
		snapperNav.state.current,
	]);

	const renderLimiter = useCallback(() => {
		// const leftIcon: Icon.Type =
		// 	orientation === "vertical"
		// 		? "icon-[rivet-icons--chevron-up]"
		// 		: "icon-[rivet-icons--chevron-left]";
		// const rightIcon: Icon.Type =
		// 	orientation === "vertical"
		// 		? "icon-[rivet-icons--chevron-down]"
		// 		: "icon-[rivet-icons--chevron-right]";
		const leftIcon: Icon.Type = "icon-[rivet-icons--chevron-left]";
		const rightIcon: Icon.Type = "icon-[rivet-icons--chevron-right]";

		return (
			<>
				<Icon
					data-ui="SnapperNav[Icon.first]"
					key={firstId}
					onDoubleClick={snapperNav.api.start}
					onClick={snapperNav.api.prev}
					onTouchStart={firstDoubleTap.onTouchStart}
					icon={leftIcon}
					data-ui-text="md"
					{...iconProps?.({
						limit: true,
						active: false,
						index: undefined,
					})}
				/>
				{flow.map((i) => {
					const page = $pages[i];
					/**
					 * Just to make TS happy
					 */
					if (!page) {
						return null;
					}
					const isActive = i === snapperNav.state.current;

					return (
						<Icon
							data-ui="SnapperNav-item"
							key={page.id}
							onClick={() => snapperNav.api.snapTo(i)}
							icon={page.icon}
							{...(isActive
								? activeIconUi
								: {
										"data-ui-text": "md",
										"data-ui-color": "icon",
									})}
							{...iconProps?.({
								limit: false,
								active: isActive,
								index: i,
							})}
							{...page.iconProps?.({
								limit: false,
								active: isActive,
								index: i,
							})}
						/>
					);
				})}
				<Icon
					data-ui="SnapperNav[Icon.last]"
					key={lastId}
					onClick={snapperNav.api.next}
					onDoubleClick={snapperNav.api.end}
					onTouchStart={lastDoubleTap.onTouchStart}
					icon={rightIcon}
					data-ui-text="md"
					{...iconProps?.({
						limit: true,
						active: false,
						index: undefined,
					})}
				/>
			</>
		);
	}, [
		firstId,
		lastId,
		iconProps,
		$pages,
		snapperNav,
		flow,
		firstDoubleTap,
		lastDoubleTap,
	]);

	const renderPages = useCallback(
		() => (
			<>
				{$pages.map((page, i) => {
					const isActive = i === snapperNav.state.current;

					return (
						<Icon
							data-ui="SnapperNav[Icon.item]"
							key={page.id}
							onClick={() => snapperNav.api.snapTo(i)}
							icon={page.icon}
							{...(isActive
								? activeIconUi
								: {
										"data-ui-text": "md",
									})}
							//
							data-active={isActive}
							//
							{...iconProps?.({
								limit: false,
								active: isActive,
								index: i,
							})}
						/>
					);
				})}
			</>
		),
		[
			$pages,
			iconProps,
			snapperNav,
		],
	);

	return snapperNav.state.count > 1 ? (
		<Container
			data-ui="SnapperNav[Container]"
			data-ui-tone="primary"
			data-ui-theme="light"
			data-ui-border
			data-ui-shadow
			data-ui-round="xl"
			data-ui-inner="default"
			data-ui-snap-to="bottom-center"
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-gap="default"
			data-ui-background="default"
			data-ui-z-index
			data-ui-color="lead"
			data-ui-opacity="6"
			className={"transition-all tone-neutral-light-bg"}
			{...props}
		>
			{limit && $pages.length > limit ? renderLimiter() : renderPages()}
		</Container>
	) : null;
};
