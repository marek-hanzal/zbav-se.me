import type { Render } from "./Render";

export interface Toast {
	id: string;
    render: Render.Fn;
}
