/** What the pane shows: the card opened, cards shown per column, the board picked. */
export type BoardViewState = {
  openId: string | null
  shown: Record<string, number>
  chosen: string | null
}

declare module 'claude-code' {
  interface PluginState {
    'board-view': { view: BoardViewState; stamp: number }
  }
}
