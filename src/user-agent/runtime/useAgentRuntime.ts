import { useContext } from "react";
import { AgentRuntimeContext } from "~/user-agent/runtime/AgentRuntimeContext";

export const useAgentRuntime = () => {
	const context = useContext(AgentRuntimeContext);

	if (!context) {
		throw new Error("useAgentRuntime must be used inside AgentRuntimeProvider");
	}

	return context;
};
