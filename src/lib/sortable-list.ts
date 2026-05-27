export function initSortableList(
  container: HTMLElement | null,
  options: {
    itemSelector: string;
    handleSelector: string;
    onReorder: () => void | Promise<void>;
  },
) {
  if (!container) return;

  const { itemSelector, handleSelector, onReorder } = options;
  let draggingItem: HTMLElement | null = null;
  let pointerId: number | null = null;
  let savedOpacity = "";
  let activeHandle: HTMLElement | null = null;
  let startY = 0;
  let hasMoved = false;
  const dragThreshold = 6;

  function preventSelect(event: Event) {
    event.preventDefault();
  }

  function startDragLock() {
    document.body.classList.add("is-sorting");
    document.addEventListener("selectstart", preventSelect);
    document.addEventListener("dragstart", preventSelect);
  }

  function endDragLock() {
    document.body.classList.remove("is-sorting");
    document.removeEventListener("selectstart", preventSelect);
    document.removeEventListener("dragstart", preventSelect);
    window.getSelection()?.removeAllRanges();
  }

  function getAfterElement(y: number) {
    const items = [...container.querySelectorAll<HTMLElement>(itemSelector)].filter(
      (element) => element !== draggingItem,
    );

    return items.reduce<{ offset: number; element: HTMLElement | null }>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null },
    ).element;
  }

  function moveItem(clientY: number) {
    if (!draggingItem) return;
    const afterElement = getAfterElement(clientY);
    if (afterElement == null) container.appendChild(draggingItem);
    else container.insertBefore(draggingItem, afterElement);
  }

  function onPointerMove(event: PointerEvent) {
    if (!draggingItem || event.pointerId !== pointerId) return;
    event.preventDefault();

    if (!hasMoved && Math.abs(event.clientY - startY) < dragThreshold) return;

    hasMoved = true;
    moveItem(event.clientY);
  }

  async function onPointerEnd(event: PointerEvent) {
    if (!draggingItem || event.pointerId !== pointerId) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerEnd);
    document.removeEventListener("pointercancel", onPointerEnd);

    draggingItem.style.opacity = savedOpacity;
    activeHandle?.releasePointerCapture(event.pointerId);
    activeHandle = null;
    draggingItem = null;
    pointerId = null;
    savedOpacity = "";
    const shouldPersist = hasMoved;
    hasMoved = false;
    endDragLock();
    if (shouldPersist) await onReorder();
  }

  container.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const handle = target.closest(handleSelector);
    if (!handle || !container.contains(handle)) return;
    if (!(handle instanceof HTMLElement)) return;

    const item = handle.closest(itemSelector);
    if (!(item instanceof HTMLElement)) return;

    draggingItem = item;
    activeHandle = handle;
    pointerId = event.pointerId;
    startY = event.clientY;
    hasMoved = false;
    savedOpacity = item.style.opacity;
    item.style.opacity = "0.75";

    window.getSelection()?.removeAllRanges();
    startDragLock();
    handle.setPointerCapture(event.pointerId);

    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);

    event.preventDefault();
  });

  container.addEventListener("contextmenu", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(handleSelector)) event.preventDefault();
  });
}

function updateTapReorderButtons(
  container: HTMLElement,
  itemSelector: string,
  upSelector: string,
  downSelector: string,
) {
  const items = [...container.querySelectorAll<HTMLElement>(itemSelector)];

  items.forEach((item, index) => {
    const up = item.querySelector<HTMLButtonElement>(upSelector);
    const down = item.querySelector<HTMLButtonElement>(downSelector);
    if (up) up.disabled = index === 0;
    if (down) down.disabled = index === items.length - 1;
  });
}

export function initTapReorder(
  container: HTMLElement | null,
  options: {
    itemSelector: string;
    upSelector: string;
    downSelector: string;
    onReorder: () => void | Promise<void>;
  },
) {
  if (!container) return { refresh: () => undefined };

  const { itemSelector, upSelector, downSelector, onReorder } = options;

  const refresh = () => updateTapReorderButtons(container, itemSelector, upSelector, downSelector);

  container.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const isUp = target.closest(upSelector);
    const isDown = target.closest(downSelector);
    if (!isUp && !isDown) return;

    const item = target.closest(itemSelector);
    if (!(item instanceof HTMLElement)) return;

    if (isUp) {
      const previous = item.previousElementSibling;
      if (!(previous instanceof HTMLElement) || !previous.matches(itemSelector)) return;
      container.insertBefore(item, previous);
    } else {
      const next = item.nextElementSibling;
      if (!(next instanceof HTMLElement) || !next.matches(itemSelector)) return;
      container.insertBefore(next, item);
    }

    refresh();
    await onReorder();
  });

  refresh();
  return { refresh };
}
