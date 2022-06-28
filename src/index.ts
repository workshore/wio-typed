import Typed, { TypedOptions } from "typed.js";
import enterView from "./enterView";
function getAllWioTyped() {
  const allWioTyped =
    document.querySelectorAll<HTMLElement>(
      "[data-wio-typed]"
    );
  return Array.from(allWioTyped);
}

/**
 * Initialize all wio-typed elements
      data-wio-typed="true" boolean
      data-wio-typed-speed="10" number
      data-wio-typed-start-delay="10" number
      data-wio-typed-back-speed="10" number
      data-wio-typed-back-delay="10" number
      data-wio-typed-smart-backspace="true" boolean
      data-wio-typed-fade-out="true" boolean
      data-wio-typed-fade-out-class="fadeclass" string
      data-wio-typed-fade-out-delay="10" number
      data-wio-typed-fade-out-delay="10" number
      data-wio-typed-loop="-1" -1 or number
      data-wio-typed-cursor="none" none or string
      data-wio-typed-auto-cursor-css="true" boolean
      data-wio-typed-content-type="html" html or text
      data-wio-typed-enter-view="true" boolean
      data-wio-typed-enter-view-offset="0.5" float
      data-wio-typed-enter-view-once="true" boolean
 */

function convertDataSetToTypedOptions(
  el: HTMLElement
) {
  const options = {};
  const dataSet = el.dataset;
  for (const key in dataSet) {
    switch (key) {
      case "wioTypedSpeed":
        options["typeSpeed"] = parseInt(
          dataSet[key],
          0
        );
        break;
      case "wioTypedStartDelay":
        options["startDelay"] = parseInt(
          dataSet[key],
          0
        );
        break;
      case "wioTypedBackSpeed":
        options["backSpeed"] = parseInt(
          dataSet[key],
          0
        );
        break;
      case "wioTypedBackDelay":
        options["backDelay"] = parseInt(
          dataSet[key],
          0
        );
        break;
      case "wioTypedSmartBackspace":
        options["smartBackspace"] =
          dataSet[key] === "true";
        break;
      case "wioTypedFadeOut":
        options["fadeOut"] =
          dataSet[key] === "true";
        break;
      case "wioTypedFadeOutClass":
        options["fadeOutClass"] = dataSet[key];
        break;
      case "wioTypedFadeOutDelay":
        options["fadeOutDelay"] = parseInt(
          dataSet[key],
          0
        );
        break;
      case "wioTypedLoop":
        options["loop"] =
          parseInt(dataSet[key], 0) === 0
            ? false
            : true;
        options["loopCount"] =
          parseInt(dataSet[key], 0) === -1
            ? Infinity
            : parseInt(dataSet[key], 0);
        break;
      case "wioTypedCursor":
        options["showCursor"] =
          dataSet[key] !== "none";
        options["cursorChar"] = dataSet[key];
        break;
      case "wioTypedAutoCursorCss":
        options["autoInsertCss"] =
          dataSet[key] === "true";
        break;
      case "wioTypedContentType":
        options["contentType"] =
          dataSet[key] === "html"
            ? "html"
            : "null";

        break;
      default:
        break;
    }
  }
  if (options["contentType"] === "html") {
    options["strings"] = [el.innerHTML];
  } else {
    options["strings"] = [el.innerText];
  }
  const defaultOptions = {
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 500,
    startDelay: 100,
    loop: false,
    fadeOut: true,
    showCursor: false,
  };
  for (const key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key];
    }
  }

  return options as TypedOptions;
}

function initializeEnterView(
  el: HTMLElement,
  typed: Typed
) {
  if (el.dataset.wioTypedEnterView) {
    let isPlayed = false;
    typed.reset(true);
    typed.stop();
    enterView({
      selector: [el],
      enter: () => {
        if (
          el.dataset.wioTypedEnterViewOnce !==
            "true" &&
          isPlayed
        ) {
          return;
        }

        isPlayed = true;
        typed.reset(true);
        typed.start();
      },
      exit: () => {
        if (
          el.dataset.wioTypedEnterViewOnce !==
          "true"
        )
          typed.stop();
      },
      offset:
        parseFloat(
          el.dataset.wioTypedEnterViewOffset
        ) || 0,
      once:
        el.dataset.wioTypedEnterViewOnce ===
        "true",
    });
  } else {
    typed.reset(true);
    typed.stop();
    typed.start();
  }
}

function initializeTyped(el: HTMLElement) {
  const options =
    convertDataSetToTypedOptions(el);

  const typed = new Typed(el, {
    ...options,
    onStart: () => {
      el.classList.remove("wio-typed-reset");
      // console.log("remvoved", el);
    },
  });

  return typed;
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const typeds = getAllWioTyped().map((el) => {
      const t = initializeTyped(el);
      initializeEnterView(el, t);
      return t;
    });
  }
);
