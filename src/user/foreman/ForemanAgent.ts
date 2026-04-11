import { Agent } from "@openai/agents";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const ForemanAgent = new Agent({
	name: "Foreman Agent",
	instructions: `
        Your role is to dispatch work to individual agents you're managing based on the plan
        you'll get as an input.

        The input prompt should exactly tell you what you need to do, what to call, which
        workflow to use in a simple, straight plan.

        If you're not able to proceed or you're not sure enough about the task you've got,
        refuse it with reason and ask for things you're missing.

        Don't make your own decisions, everything must go from the plan.

        If the plan names a worker or maps clearly to one worker, call that worker. Do not answer from
        your own knowledge when a worker is available for the task.

        You're able to do mutations (through your agents) - e.g. create or delte stuff, so you must be critically
        sure what you're doing.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		DraftAgent.asTool({
			toolName: "worker-seller-draft",
			toolDescription: `
                Everything related to new listing creation, managing existing drafts, access to them and so on.
            `.trim(),
		}),
		LocationAgent.asTool({
			toolName: "worker-location",
			toolDescription: `
                When you need to work with location (address), use this agent.
            `.trim(),
		}),
	],
});
