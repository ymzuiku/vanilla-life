const observeOption = {
  childList: true,
  subtree: true,
};

const appendWeak = new WeakMap<Element, Function[]>();
const removeWeak = new WeakMap<Element, Function[]>();
const entryWeak = new WeakMap<Element, Function[]>();

export function onAppend<T extends Element>(
  target: T,
  callback: (ele: T) => any
) {
  if (appendWeak.has(target)) {
    const fns = appendWeak.get(target)!;
    fns.push(callback);
    return;
  }

  appendWeak.set(target, [callback]);

  const observer = new MutationObserver((_e) => {
    if (document.contains(target)) {
      observer.disconnect();
      const fns = appendWeak.get(target);
      if (fns) {
        fns.forEach((fn) => fn(target));
      }
      appendWeak.delete(target);
    }
  });

  observer.observe(document, observeOption);
}

export function onRemove<T extends Element>(
  target: T,
  callback: (ele: T) => any
) {
  if (removeWeak.has(target)) {
    const fns = removeWeak.get(target)!;
    fns.push(callback);
    return;
  }

  removeWeak.set(target, [callback]);

  // 当元素插入到页面后，才开始监听是否移除
  onAppend(target, () => {
    const observer = new MutationObserver(() => {
      if (!document.contains(target)) {
        observer.disconnect();
        const fns = removeWeak.get(target);
        if (fns) {
          fns.forEach((fn) => fn(target));
        }
        removeWeak.delete(target);
      }
    });

    observer.observe(document, observeOption);
  });
}

export interface LazyEnterOptions {
  // 随着某个元素的消亡而取消订阅
  minHeight?: string;
  root?: Element;
}

export const onEntry = <T extends Element>(
  target: T,
  callback: (target: T, entry: IntersectionObserverEntry) => any,
  { minHeight = "50px", root }: LazyEnterOptions = {}
) => {
  if (entryWeak.has(target)) {
    const fns = entryWeak.get(target)!;
    fns.push(callback);
    return;
  }

  entryWeak.set(target, [callback]);

  onAppend(target, () => {
    // let isNeedRemoveMinHeight = false;
    if (!(target as any).style.minHeight) {
      // isNeedRemoveMinHeight = true;
      (target as any).style.minHeight = minHeight;
    }

    if (!target.getAttribute("data-lazy")) {
      target.setAttribute("data-lazy", "1");
      const observer = new IntersectionObserver(
        (e) => {
          e.forEach((ent) => {
            target.setAttribute("data-lazy", "2");
            if (ent.isIntersecting) {
              observer.disconnect();
              const fns = entryWeak.get(target);
              if (fns) {
                fns.forEach((fn) => fn(ent));
              }
              entryWeak.delete(target);
            }
          });
        },
        { root, rootMargin: window.innerHeight / 2 + "px" }
      );

      observer.observe(target);
      onRemove(target, () => {
        observer.disconnect();
      });
    }
  });
};
