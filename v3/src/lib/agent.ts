// One agent, reached from the menu button or ⌘K. Components talk to it through window events.
export const openAgent = (question?: string) => window.dispatchEvent(new CustomEvent('agent:open', { detail: question }));
export const setAgentBusy = (busy: boolean) => window.dispatchEvent(new CustomEvent('agent:busy', { detail: busy }));
