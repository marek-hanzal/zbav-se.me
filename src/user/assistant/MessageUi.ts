import type { UIMessage } from "ai";
import type { Tools } from "~/user/assistant/server/Tools";

export type MessageUi = UIMessage<unknown, {}, Tools.Ui>;
