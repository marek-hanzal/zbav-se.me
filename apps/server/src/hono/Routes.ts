import type { withHono } from "./withHono";
import type { withSessionHono } from "./withSessionHono";
import type { withTokenHono } from "./withTokenHono";

export namespace Routes {
	export type Fn = (routes: Routes) => void;
}

export interface Routes {
	public: withHono;
	session: withSessionHono;
	token: withTokenHono;
}
