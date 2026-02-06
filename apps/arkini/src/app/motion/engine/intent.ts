import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import type { AnimationPlaybackControlsWithThen } from "motion/react";
import type { RefObject } from "react";
import { flushSync } from "react-dom";
import { match } from "ts-pattern";
import type { Action } from "~/app/motion/Action";
import { getLayoutSnapshot } from "~/app/motion/engine/getLayoutSnapshot";
import { startAnim } from "~/app/motion/engine/startAnim";
import { stopAnim } from "~/app/motion/engine/stopAnim";
import type { Layout } from "~/app/motion/Layout";
import type { Motion } from "~/app/motion/Motion";

export namespace intent {
	export interface Refs {
		boardRef: RefObject<HTMLDivElement | null>;
		activeLayoutRef: RefObject<Motion.Layout | null>;
		animsByIdRef: RefObject<Map<string, Set<AnimationPlaybackControlsWithThen>>>;
		nodesByIdRef: RefObject<Map<string, Motion.RenderNode>>;
		itemsRef: RefObject<tBoardItem[]>;
	}

	export interface Deps {
		layout: Layout;
		animationsEnabledRef: RefObject<boolean>;
		patch(id: string, patch: Partial<tBoardItem>): void;
	}

	export interface Props {
		action: Action;
		refs: Refs;
		deps: Deps;
	}
}

export function intent({ action, refs, deps }: intent.Props) {
	match(action)
		.with(
			{
				type: "drag-start",
			},
			(action) => {
				stopAnim({
					id: action.id,
					animsByIdRef: refs.animsByIdRef,
				});
				refs.activeLayoutRef.current = getLayoutSnapshot({
					boardRef: refs.boardRef,
					layout: deps.layout,
				});

				const node = refs.nodesByIdRef.current.get(action.id);
				if (!node) {
					return;
				}

				startAnim({
					id: action.id,
					animsByIdRef: refs.animsByIdRef,
					mv: node.motionValues.scale,
					to: 1.25,
					options: {
						type: "spring",
						stiffness: 700,
						damping: 38,
					},
				});
			},
		)
		.with(
			{
				type: "drag-end",
			},
			(action) => {
				stopAnim({
					id: action.id,
					animsByIdRef: refs.animsByIdRef,
				});

				const layout =
					refs.activeLayoutRef.current ??
					getLayoutSnapshot({
						boardRef: refs.boardRef,
						layout: deps.layout,
					});
				refs.activeLayoutRef.current = null;
				if (!layout) {
					return;
				}

				const it = refs.itemsRef.current.find((x) => x.id === action.id);
				if (!it) {
					return;
				}

				const node = refs.nodesByIdRef.current.get(action.id);
				if (!node) {
					return;
				}

				const next = layout.pxToCell(action.target);
				const same = next.x === it.x && next.y === it.y;

				if (same) {
					startAnim({
						id: it.id,
						animsByIdRef: refs.animsByIdRef,
						mv: node.motionValues.x,
						to: 0,
						options: {
							type: "spring",
							stiffness: 650,
							damping: 42,
						},
					});

					startAnim({
						id: it.id,
						animsByIdRef: refs.animsByIdRef,
						mv: node.motionValues.y,
						to: 0,
						options: {
							type: "spring",
							stiffness: 650,
							damping: 42,
						},
					});
					startAnim({
						id: it.id,
						animsByIdRef: refs.animsByIdRef,
						mv: node.motionValues.scale,
						to: 1,
						options: {
							type: "spring",
							stiffness: 650,
							damping: 44,
						},
					});
					return;
				}

				flushSync(() => {
					deps.patch(it.id, {
						x: next.x,
						y: next.y,
					});
				});

				const delta = layout.deltaPx(
					{
						x: it.x,
						y: it.y,
					},
					next,
				);
				node.motionValues.x.set(node.motionValues.x.get() - delta.x);
				node.motionValues.y.set(node.motionValues.y.get() - delta.y);

				startAnim({
					id: it.id,
					animsByIdRef: refs.animsByIdRef,
					mv: node.motionValues.x,
					to: 0,
					options: {
						type: "spring",
						stiffness: 700,
						damping: 45,
					},
				});
				startAnim({
					id: it.id,
					animsByIdRef: refs.animsByIdRef,
					mv: node.motionValues.y,
					to: 0,
					options: {
						type: "spring",
						stiffness: 700,
						damping: 45,
					},
				});
				startAnim({
					id: it.id,
					animsByIdRef: refs.animsByIdRef,
					mv: node.motionValues.scale,
					to: 1,
					options: {
						type: "spring",
						stiffness: 700,
						damping: 45,
					},
				});
			},
		)
		.otherwise((action) => {
			console.warn("unknown action", action);
		});
}
