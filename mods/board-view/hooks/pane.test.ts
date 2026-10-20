import { expect, test } from 'claude-code/testing'
import type { FsEntry } from 'claude-code'

const ROOT = '/repo'
const TEXT = '# Job: board\n\n## Backlog\n- **A-1** First card · source: notes\n\n## Review\n- **A-2** Second card · commit: abc1234\n'

test('the lanes drag and key sideways, the picker jumps to a lane, and a card opens, on terminal and desktop', async ($, on) => {
  on('session.cwd', () => ({ value: ROOT }))
  on('fs.exists', (_$, e) => ({ value: String((e as { path: string }).path) === `${ROOT}/.git` }))
  on('fs.list', (_$, e) => {
    const path = String((e as { path?: string }).path)
    const dirs: Record<string, FsEntry[]> = {
      [`${ROOT}/docs/plans`]: [{ name: 'job', kind: 'dir', size: 0, mtimeMs: 0, isLink: false }],
      [`${ROOT}/docs/plans/job`]: [{ name: 'BOARD.md', kind: 'file', size: TEXT.length, mtimeMs: 5, isLink: false }],
    }
    return { value: dirs[path] ?? [] }
  })
  on('fs.stat', () => ({ value: { kind: 'file', size: TEXT.length, mtimeMs: 5, isLink: false } }))
  on('fs.read', () => ({ value: TEXT }))
  on('ui.panes', () => ({ value: [] }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'board-view', surface, component: 'Pane', requestId: 'board', props: { title: 'Board', isFocused: false, bodyColumns: 40, placement: 'dock' } } as never)
    expect(JSON.stringify(await (ui as any).find({}))).toContain('1/2')
    const lanes = async () => JSON.stringify(await (ui as any).drawn({ in: 'lanes' }))
    expect(await lanes()).toContain('A-1')
    expect(await lanes()).not.toContain('A-2')
    expect(await lanes()).toContain('⊙\u00a01')
    expect(await lanes()).not.toContain('Review 1')
    await (ui as any).key({ key: 'right', in: 'lanes' })
    await (ui as any).key({ key: 'right', in: 'lanes' })
    await (ui as any).key({ key: 'right', in: 'lanes' })
    expect(await lanes()).toContain('A-2')
    await (ui as any).pointer({ type: 'down', x: 30, y: 4, button: 'left' })
    await (ui as any).pointer({ type: 'move', x: 50, y: 4, button: 'left' })
    await (ui as any).pointer({ type: 'up', x: 50, y: 4, button: 'left' })
    expect(await lanes()).not.toContain('A-2')
    await (ui as any).pointer({ type: 'down', x: 25, y: 1, button: 'left' })
    await (ui as any).pointer({ type: 'up', x: 25, y: 1, button: 'left' })
    expect(await lanes()).toContain('A-2')
    await (ui as any).press({ key: 'lane-pick-backlog' })
    expect(await lanes()).not.toContain('A-2')
    await (ui as any).press({ key: 'lane-pick-review' })
    expect(await lanes()).toContain('A-2')
    await (ui as any).press({ key: 'card-A-2' })
    expect(await lanes()).toContain('Commit')
    expect(await lanes()).toContain('abc1234')
    await (ui as any).press({ key: 'back' })
    expect(await lanes()).not.toContain('Commit')
    expect(await lanes()).toContain('A-2')
    await ui.unmount()
  }
})
