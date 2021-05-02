const observeOption = {
  childList: true,
  subtree: true,
};

export function onAppend(target: HTMLElement, callback: Function) {
  const observer = new MutationObserver((e) => {
    if (document.contains(target)) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(document, observeOption);
}

export function onRemove(target: HTMLElement, callback: Function) {
  // 当元素插入到页面后，才开始监听是否移除
  onAppend(target, () => {
    const observer = new MutationObserver(() => {
      if (!document.contains(target)) {
        observer.disconnect();
        callback();
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

export const onEntry = (
  target: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => any,
  { minHeight = "50px", root }: LazyEnterOptions = {}
) => {
  onAppend(target, () => {
    // let isNeedRemoveMinHeight = false;
    if (!target.style.minHeight) {
      // isNeedRemoveMinHeight = true;
      target.style.minHeight = minHeight;
    }

    if (!target.getAttribute("data-lazy")) {
      target.setAttribute("data-lazy", "1");
      const observer = new IntersectionObserver(
        (e) => {
          e.forEach((ent) => {
            target.setAttribute("data-lazy", "2");
            if (ent.isIntersecting) {
              observer.disconnect();
              callback(ent);
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
