import type { ComponentType } from "react";
import GettingStarted from "./ar/getting-started";
import SlashCommands from "./ar/slash-commands";
import Memory from "./ar/memory";
import ProjectSetup from "./ar/project-setup";
import Commands from "./ar/commands";
import Skills from "./ar/skills";
import Hooks from "./ar/hooks";
import Mcp from "./ar/mcp";
import Subagents from "./ar/subagents";
import AdvancedFeatures from "./ar/advanced-features";
import Workflows from "./ar/workflows";
import Plugins from "./ar/plugins";

export const MODULE_BODIES_AR: Record<string, ComponentType> = {
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
