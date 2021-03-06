const enterView = (data: {
  selector: string | HTMLElement | HTMLElement[];
  enter: (el: HTMLElement) => void;
  exit?: (el: HTMLElement) => void;
  progress?: (
    el: HTMLElement,
    progress: number
  ) => void;
  offset?: number;
  once?: boolean;
}) => {
  const {
    selector,
    enter = (el: HTMLElement) => {},
    exit = (el: HTMLElement) => {},
    progress = (
      el: HTMLElement,
      progress: number
    ) => {},
    offset = 0,
    once = true,
  } = data;

  let raf = null;
  let ticking = false;
  let elements = [];
  let height = 0;

  function setupRaf() {
    raf =
      window.requestAnimationFrame ||
      (window as any)
        .webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function (callback) {
        return setTimeout(callback, 1000 / 60);
      };
  }

  function getOffsetHeight() {
    if (offset && typeof offset === "number") {
      const fraction = Math.min(
        Math.max(0, offset),
        1
      );
      return height - fraction * height;
    }
    return height;
  }

  function updateHeight() {
    const cH =
      document.documentElement.clientHeight;
    const wH = window.innerHeight || 0;
    height = Math.max(cH, wH);
  }

  function updateScroll() {
    ticking = false;
    const targetFromTop = getOffsetHeight();

    elements = elements.filter((el: any) => {
      const { top, bottom, height } =
        el.getBoundingClientRect();
      const entered = top < targetFromTop;
      const exited = bottom < targetFromTop;

      // enter + exit
      if (entered && !el.__ev_entered) {
        enter(el);
        el.__ev_progress = 0;
        progress(el, el.__ev_progress);
        if (once) return false;
      } else if (!entered && el.__ev_entered) {
        el.__ev_progress = 0;
        progress(el, el.__ev_progress);
        exit(el);
      }

      // progress
      if (entered && !exited) {
        const delta =
          (targetFromTop - top) / height;
        el.__ev_progress = Math.min(
          1,
          Math.max(0, delta)
        );
        progress(el, el.__ev_progress);
      }

      if (
        entered &&
        exited &&
        el.__ev_progress !== 1
      ) {
        el.__ev_progress = 1;
        progress(el, el.__ev_progress);
      }

      el.__ev_entered = entered;
      return true;
    });

    if (!elements.length) {
      window.removeEventListener(
        "scroll",
        onScroll,
        true
      );
      window.removeEventListener(
        "resize",
        onResize,
        true
      );
      window.removeEventListener(
        "load",
        onLoad,
        true
      );
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      raf(updateScroll);
    }
  }

  function onResize() {
    updateHeight();
    updateScroll();
  }

  function onLoad() {
    updateHeight();
    updateScroll();
  }

  function selectionToArray(selection) {
    const len = selection.length;
    const result = [];
    for (let i = 0; i < len; i += 1) {
      result.push(selection[i]);
    }
    return result;
  }

  function selectAll(
    selector,
    parent = document
  ) {
    if (typeof selector === "string") {
      return selectionToArray(
        parent.querySelectorAll(selector)
      );
    } else if (selector instanceof NodeList) {
      return selectionToArray(selector);
    } else if (selector instanceof Array) {
      return selector;
    }
  }

  function setupElements() {
    elements = selectAll(selector);
  }

  function setupEvents() {
    window.addEventListener(
      "resize",
      onResize,
      true
    );
    window.addEventListener(
      "scroll",
      onScroll,
      true
    );
    window.addEventListener("load", onLoad, true);
    onResize();
  }

  function init() {
    if (!selector) {
      console.error("must pass a selector");
      return false;
    }

    setupElements();

    if (!elements || !elements.length) {
      console.error("no selector elements found");
      return false;
    }

    setupRaf();
    setupEvents();
    updateScroll();
  }

  init();
};

export default enterView;
