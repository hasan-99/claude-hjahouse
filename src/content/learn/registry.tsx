import type { ComponentType } from "react";
import GettingStarted from "./getting-started";
import SlashCommands from "./slash-commands";
import Memory from "./memory";
import ProjectSetup from "./project-setup";
import Commands from "./commands";
import Skills from "./skills";
import Hooks from "./hooks";
import Mcp from "./mcp";
import Subagents from "./subagents";
import AdvancedFeatures from "./advanced-features";
import Workflows from "./workflows";
import Plugins from "./plugins";

// slug → module body component. Builder agents overwrite the individual
// content files above; this registry stays stable.
export const MODULE_BODIES: Record<string, ComponentType> = {
  "getting-started": GettingStarted,
  "slash-commands": SlashCommands,
  memory: Memory,
  "project-setup": ProjectSetup,
  commands: Commands,
  skills: Skills,
  hooks: Hooks,
  mcp: Mcp,
  subagents: Subagents,
  "advanced-features": AdvancedFeatures,
  workflows: Workflows,
  plugins: Plugins,
};
