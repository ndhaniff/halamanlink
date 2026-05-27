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
    moveItem(event.clientY);
  }

  async function onPointerEnd(event: PointerEvent) {
    if (!draggingItem || event.pointerId !== pointerId) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerEnd);
    document.removeEventListener("pointercancel", onPointerEnd);

    draggingItem.style.opacity = savedOpacity;
    draggingItem = null;
    pointerId = null;
    savedOpacity = "";
    await onReorder();
  }

  container.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const handle = target.closest(handleSelector);
    if (!handle || !container.contains(handle)) return;

    const item = handle.closest(itemSelector);
    if (!(item instanceof HTMLElement)) return;

    draggingItem = item;
    pointerId = event.pointerId;
    savedOpacity = item.style.opacity;
    item.style.opacity = "0.75";

    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);

    event.preventDefault();
  });
}
