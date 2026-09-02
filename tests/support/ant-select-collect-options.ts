/**
 * Collects all option labels from an open Ant Design select dropdown element.
 * Self-contained for Playwright Locator.evaluate (helpers must live inside this function).
 */
export async function collectAntSelectDropdownOptionsInBrowser(root: Element): Promise<string[]> {
  const VIRTUAL_LIST_RENDER_WAIT_MS = 100;
  const STAGNANT_SCROLL_PASSES = 5;

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const scrollVirtualListHolder = async (holder: Element, scrollTop: number): Promise<void> => {
    const el = holder as HTMLElement;
    el.scrollTop = scrollTop;
    el.dispatchEvent(new Event('scroll', { bubbles: true }));
    await sleep(VIRTUAL_LIST_RENDER_WAIT_MS);
  };

  const seen = new Set<string>();
  const out: string[] = [];

  const collect = () => {
    root.querySelectorAll('.ant-select-item-option-content').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        out.push(text);
      }
    });
  };

  const holder = root.querySelector('.rc-virtual-list-holder');
  if (!holder) {
    collect();
    return out;
  }

  const holderEl = holder as HTMLElement;
  await scrollVirtualListHolder(holder, 0);
  collect();

  const step = Math.max(holderEl.clientHeight, 120);
  let stagnant = 0;

  while (stagnant < STAGNANT_SCROLL_PASSES) {
    const previousScrollTop = holderEl.scrollTop;
    const beforeCount = out.length;
    const maxScrollTop = Math.max(0, holderEl.scrollHeight - holderEl.clientHeight);
    const nextScrollTop = Math.min(previousScrollTop + step, maxScrollTop);

    await scrollVirtualListHolder(holder, nextScrollTop);
    collect();

    const atBottom = holderEl.scrollTop >= maxScrollTop - 1;
    if (atBottom) {
      await scrollVirtualListHolder(holder, holderEl.scrollHeight);
      collect();
    }

    if (holderEl.scrollTop <= previousScrollTop && out.length === beforeCount) {
      stagnant += 1;
    } else {
      stagnant = 0;
    }
  }

  await scrollVirtualListHolder(holder, 0);
  collect();

  return out;
}
