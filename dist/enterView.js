var enterView = function (data) {
    var selector = data.selector, _a = data.enter, enter = _a === void 0 ? function (el) { } : _a, _b = data.exit, exit = _b === void 0 ? function (el) { } : _b, _c = data.progress, progress = _c === void 0 ? function (el, progress) { } : _c, _d = data.offset, offset = _d === void 0 ? 0 : _d, _e = data.once, once = _e === void 0 ? true : _e;
    var raf = null;
    var ticking = false;
    var elements = [];
    var height = 0;
    function setupRaf() {
        raf =
            window.requestAnimationFrame ||
                window
                    .webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return setTimeout(callback, 1000 / 60);
                };
    }
    function getOffsetHeight() {
        if (offset && typeof offset === "number") {
            var fraction = Math.min(Math.max(0, offset), 1);
            return height - fraction * height;
        }
        return height;
    }
    function updateHeight() {
        var cH = document.documentElement.clientHeight;
        var wH = window.innerHeight || 0;
        height = Math.max(cH, wH);
    }
    function updateScroll() {
        ticking = false;
        var targetFromTop = getOffsetHeight();
        elements = elements.filter(function (el) {
            var _a = el.getBoundingClientRect(), top = _a.top, bottom = _a.bottom, height = _a.height;
            var entered = top < targetFromTop;
            var exited = bottom < targetFromTop;
            // enter + exit
            if (entered && !el.__ev_entered) {
                enter(el);
                el.__ev_progress = 0;
                progress(el, el.__ev_progress);
                if (once)
                    return false;
            }
            else if (!entered && el.__ev_entered) {
                el.__ev_progress = 0;
                progress(el, el.__ev_progress);
                exit(el);
            }
            // progress
            if (entered && !exited) {
                var delta = (targetFromTop - top) / height;
                el.__ev_progress = Math.min(1, Math.max(0, delta));
                progress(el, el.__ev_progress);
            }
            if (entered &&
                exited &&
                el.__ev_progress !== 1) {
                el.__ev_progress = 1;
                progress(el, el.__ev_progress);
            }
            el.__ev_entered = entered;
            return true;
        });
        if (!elements.length) {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize, true);
            window.removeEventListener("load", onLoad, true);
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
        var len = selection.length;
        var result = [];
        for (var i = 0; i < len; i += 1) {
            result.push(selection[i]);
        }
        return result;
    }
    function selectAll(selector, parent) {
        if (parent === void 0) { parent = document; }
        if (typeof selector === "string") {
            return selectionToArray(parent.querySelectorAll(selector));
        }
        else if (selector instanceof NodeList) {
            return selectionToArray(selector);
        }
        else if (selector instanceof Array) {
            return selector;
        }
    }
    function setupElements() {
        elements = selectAll(selector);
    }
    function setupEvents() {
        window.addEventListener("resize", onResize, true);
        window.addEventListener("scroll", onScroll, true);
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
