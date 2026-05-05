import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-95GGkJgB.js";
import { h as heroImg } from "./router-BIRTkevo.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var version = "1.3.23";
function clamp(min, input, max) {
  return Math.max(min, Math.min(input, max));
}
function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}
function damp(x, y, lambda, deltaTime) {
  return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n, d) {
  return (n % d + d) % d;
}
var Animate = class {
  isRunning = false;
  value = 0;
  from = 0;
  to = 0;
  currentTime = 0;
  lerp;
  duration;
  easing;
  onUpdate;
  /**
  * Advance the animation by the given delta time
  *
  * @param deltaTime - The time in seconds to advance the animation
  */
  advance(deltaTime) {
    if (!this.isRunning) return;
    let completed = false;
    if (this.duration && this.easing) {
      this.currentTime += deltaTime;
      const linearProgress = clamp(0, this.currentTime / this.duration, 1);
      completed = linearProgress >= 1;
      const easedProgress = completed ? 1 : this.easing(linearProgress);
      this.value = this.from + (this.to - this.from) * easedProgress;
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
      if (Math.round(this.value) === Math.round(this.to)) {
        this.value = this.to;
        completed = true;
      }
    } else {
      this.value = this.to;
      completed = true;
    }
    if (completed) this.stop();
    this.onUpdate?.(this.value, completed);
  }
  /** Stop the animation */
  stop() {
    this.isRunning = false;
  }
  /**
  * Set up the animation from a starting value to an ending value
  * with optional parameters for lerping, duration, easing, and onUpdate callback
  *
  * @param from - The starting value
  * @param to - The ending value
  * @param options - Options for the animation
  */
  fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
    this.from = this.value = from;
    this.to = to;
    this.lerp = lerp2;
    this.duration = duration;
    this.easing = easing;
    this.currentTime = 0;
    this.isRunning = true;
    onStart?.();
    this.onUpdate = onUpdate;
  }
};
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(this, args);
    }, delay);
  };
}
var Dimensions = class {
  width = 0;
  height = 0;
  scrollHeight = 0;
  scrollWidth = 0;
  debouncedResize;
  wrapperResizeObserver;
  contentResizeObserver;
  constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
    this.wrapper = wrapper;
    this.content = content;
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceValue);
      if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize);
      else {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
        this.wrapperResizeObserver.observe(this.wrapper);
      }
      this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
      this.contentResizeObserver.observe(this.content);
    }
    this.resize();
  }
  destroy() {
    this.wrapperResizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize);
  }
  resize = () => {
    this.onWrapperResize();
    this.onContentResize();
  };
  onWrapperResize = () => {
    if (this.wrapper instanceof Window) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    } else {
      this.width = this.wrapper.clientWidth;
      this.height = this.wrapper.clientHeight;
    }
  };
  onContentResize = () => {
    if (this.wrapper instanceof Window) {
      this.scrollHeight = this.content.scrollHeight;
      this.scrollWidth = this.content.scrollWidth;
    } else {
      this.scrollHeight = this.wrapper.scrollHeight;
      this.scrollWidth = this.wrapper.scrollWidth;
    }
  };
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height
    };
  }
};
var Emitter = class {
  events = {};
  /**
  * Emit an event with the given data
  * @param event Event name
  * @param args Data to pass to the event handlers
  */
  emit(event, ...args) {
    const callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i]?.(...args);
  }
  /**
  * Add a callback to the event
  * @param event Event name
  * @param cb Callback function
  * @returns Unsubscribe function
  */
  on(event, cb) {
    if (this.events[event]) this.events[event].push(cb);
    else this.events[event] = [cb];
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }
  /**
  * Remove a callback from the event
  * @param event Event name
  * @param callback Callback function
  */
  off(event, callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i);
  }
  /**
  * Remove all event listeners and clean up
  */
  destroy() {
    this.events = {};
  }
};
const LINE_HEIGHT = 100 / 6;
const listenerOptions = { passive: false };
function getDeltaMultiplier(deltaMode, size) {
  if (deltaMode === 1) return LINE_HEIGHT;
  if (deltaMode === 2) return size;
  return 1;
}
var VirtualScroll = class {
  touchStart = {
    x: 0,
    y: 0
  };
  lastDelta = {
    x: 0,
    y: 0
  };
  window = {
    width: 0,
    height: 0
  };
  emitter = new Emitter();
  constructor(element, options = {
    wheelMultiplier: 1,
    touchMultiplier: 1
  }) {
    this.element = element;
    this.options = options;
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
    this.element.addEventListener("wheel", this.onWheel, listenerOptions);
    this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  /**
  * Add an event listener for the given event and callback
  *
  * @param event Event name
  * @param callback Callback function
  */
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  /** Remove all event listeners and clean up */
  destroy() {
    this.emitter.destroy();
    window.removeEventListener("resize", this.onWindowResize);
    this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
    this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  /**
  * Event handler for 'touchstart' event
  *
  * @param event Touch event
  */
  onTouchStart = (event) => {
    const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
    this.touchStart.x = clientX;
    this.touchStart.y = clientY;
    this.lastDelta = {
      x: 0,
      y: 0
    };
    this.emitter.emit("scroll", {
      deltaX: 0,
      deltaY: 0,
      event
    });
  };
  /** Event handler for 'touchmove' event */
  onTouchMove = (event) => {
    const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
    const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
    const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
    this.touchStart.x = clientX;
    this.touchStart.y = clientY;
    this.lastDelta = {
      x: deltaX,
      y: deltaY
    };
    this.emitter.emit("scroll", {
      deltaX,
      deltaY,
      event
    });
  };
  onTouchEnd = (event) => {
    this.emitter.emit("scroll", {
      deltaX: this.lastDelta.x,
      deltaY: this.lastDelta.y,
      event
    });
  };
  /** Event handler for 'wheel' event */
  onWheel = (event) => {
    let { deltaX, deltaY, deltaMode } = event;
    const multiplierX = getDeltaMultiplier(deltaMode, this.window.width);
    const multiplierY = getDeltaMultiplier(deltaMode, this.window.height);
    deltaX *= multiplierX;
    deltaY *= multiplierY;
    deltaX *= this.options.wheelMultiplier;
    deltaY *= this.options.wheelMultiplier;
    this.emitter.emit("scroll", {
      deltaX,
      deltaY,
      event
    });
  };
  onWindowResize = () => {
    this.window = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
};
const defaultEasing = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));
var Lenis = class {
  _isScrolling = false;
  _isStopped = false;
  _isLocked = false;
  _preventNextNativeScrollEvent = false;
  _resetVelocityTimeout = null;
  _rafId = null;
  /**
  * Whether or not the user is touching the screen
  */
  isTouching;
  /**
  * The time in ms since the lenis instance was created
  */
  time = 0;
  /**
  * User data that will be forwarded through the scroll event
  *
  * @example
  * lenis.scrollTo(100, {
  *   userData: {
  *     foo: 'bar'
  *   }
  * })
  */
  userData = {};
  /**
  * The last velocity of the scroll
  */
  lastVelocity = 0;
  /**
  * The current velocity of the scroll
  */
  velocity = 0;
  /**
  * The direction of the scroll
  */
  direction = 0;
  /**
  * The options passed to the lenis instance
  */
  options;
  /**
  * The target scroll value
  */
  targetScroll;
  /**
  * The animated scroll value
  */
  animatedScroll;
  animate = new Animate();
  emitter = new Emitter();
  dimensions;
  virtualScroll;
  constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = 0.075, touchInertiaExponent = 1.7, duration, easing, lerp: lerp2 = 0.1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false } = {}) {
    window.lenisVersion = version;
    if (!window.lenis) window.lenis = {};
    window.lenis.version = version;
    if (orientation === "horizontal") window.lenis.horizontal = true;
    if (syncTouch === true) window.lenis.touch = true;
    if (!wrapper || wrapper === document.documentElement) wrapper = window;
    if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
    else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
    this.options = {
      wrapper,
      content,
      eventsTarget,
      smoothWheel,
      syncTouch,
      syncTouchLerp,
      touchInertiaExponent,
      duration,
      easing,
      lerp: lerp2,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      autoResize,
      prevent,
      virtualScroll,
      overscroll,
      autoRaf,
      anchors,
      autoToggle,
      allowNestedScroll,
      naiveDimensions,
      stopInertiaOnNavigate
    };
    this.dimensions = new Dimensions(wrapper, content, { autoResize });
    this.updateClassName();
    this.targetScroll = this.animatedScroll = this.actualScroll;
    this.options.wrapper.addEventListener("scroll", this.onNativeScroll);
    this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
    if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick);
    this.options.wrapper.addEventListener("pointerdown", this.onPointerDown);
    this.virtualScroll = new VirtualScroll(eventsTarget, {
      touchMultiplier,
      wheelMultiplier
    });
    this.virtualScroll.on("scroll", this.onVirtualScroll);
    if (this.options.autoToggle) {
      this.checkOverflow();
      this.rootElement.addEventListener("transitionend", this.onTransitionEnd);
    }
    if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
  }
  /**
  * Destroy the lenis instance, remove all event listeners and clean up the class name
  */
  destroy() {
    this.emitter.destroy();
    this.options.wrapper.removeEventListener("scroll", this.onNativeScroll);
    this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
    this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown);
    if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick);
    this.virtualScroll.destroy();
    this.dimensions.destroy();
    this.cleanUpClassName();
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  off(event, callback) {
    return this.emitter.off(event, callback);
  }
  onScrollEnd = (e) => {
    if (!(e instanceof CustomEvent)) {
      if (this.isScrolling === "smooth" || this.isScrolling === false) e.stopPropagation();
    }
  };
  dispatchScrollendEvent = () => {
    this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
      bubbles: this.options.wrapper === window,
      detail: { lenisScrollEnd: true }
    }));
  };
  get overflow() {
    const property = this.isHorizontal ? "overflow-x" : "overflow-y";
    return getComputedStyle(this.rootElement)[property];
  }
  checkOverflow() {
    if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
    else this.internalStart();
  }
  onTransitionEnd = (event) => {
    if (event.propertyName?.includes("overflow") && event.target === this.rootElement) this.checkOverflow();
  };
  setScroll(scroll) {
    if (this.isHorizontal) this.options.wrapper.scrollTo({
      left: scroll,
      behavior: "instant"
    });
    else this.options.wrapper.scrollTo({
      top: scroll,
      behavior: "instant"
    });
  }
  onClick = (event) => {
    const linkElementsUrls = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.href).map((element) => new URL(element.href));
    const currentUrl = new URL(window.location.href);
    if (this.options.anchors) {
      const anchorElementUrl = linkElementsUrls.find((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname === targetUrl.pathname && targetUrl.hash);
      if (anchorElementUrl) {
        const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
        const target = `#${anchorElementUrl.hash.split("#")[1]}`;
        this.scrollTo(target, options);
        return;
      }
    }
    if (this.options.stopInertiaOnNavigate) {
      if (linkElementsUrls.some((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname !== targetUrl.pathname)) {
        this.reset();
        return;
      }
    }
  };
  onPointerDown = (event) => {
    if (event.button === 1) this.reset();
  };
  onVirtualScroll = (data) => {
    if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
    const { deltaX, deltaY, event } = data;
    this.emitter.emit("virtual-scroll", {
      deltaX,
      deltaY,
      event
    });
    if (event.ctrlKey) return;
    if (event.lenisStopPropagation) return;
    const isTouch = event.type.includes("touch");
    const isWheel = event.type.includes("wheel");
    this.isTouching = event.type === "touchstart" || event.type === "touchmove";
    const isClickOrTap = deltaX === 0 && deltaY === 0;
    if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
      this.reset();
      return;
    }
    const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
    if (isClickOrTap || isUnknownGesture) return;
    let composedPath = event.composedPath();
    composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
    const prevent = this.options.prevent;
    const gestureOrientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
    if (composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || gestureOrientation === "vertical" && node.hasAttribute?.("data-lenis-prevent-vertical") || gestureOrientation === "horizontal" && node.hasAttribute?.("data-lenis-prevent-horizontal") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(node, {
      deltaX,
      deltaY
    })))) return;
    if (this.isStopped || this.isLocked) {
      if (event.cancelable) event.preventDefault();
      return;
    }
    if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
      this.isScrolling = "native";
      this.animate.stop();
      event.lenisStopPropagation = true;
      return;
    }
    let delta = deltaY;
    if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
    if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
    if (event.cancelable) event.preventDefault();
    const isSyncTouch = isTouch && this.options.syncTouch;
    const hasTouchInertia = isTouch && event.type === "touchend";
    if (hasTouchInertia) delta = Math.sign(delta) * Math.abs(this.velocity) ** this.options.touchInertiaExponent;
    this.scrollTo(this.targetScroll + delta, {
      programmatic: false,
      ...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
        lerp: this.options.lerp,
        duration: this.options.duration,
        easing: this.options.easing
      }
    });
  };
  /**
  * Force lenis to recalculate the dimensions
  */
  resize() {
    this.dimensions.resize();
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  onNativeScroll = () => {
    if (this._resetVelocityTimeout !== null) {
      clearTimeout(this._resetVelocityTimeout);
      this._resetVelocityTimeout = null;
    }
    if (this._preventNextNativeScrollEvent) {
      this._preventNextNativeScrollEvent = false;
      return;
    }
    if (this.isScrolling === false || this.isScrolling === "native") {
      const lastScroll = this.animatedScroll;
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.lastVelocity = this.velocity;
      this.velocity = this.animatedScroll - lastScroll;
      this.direction = Math.sign(this.animatedScroll - lastScroll);
      if (!this.isStopped) this.isScrolling = "native";
      this.emit();
      if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
        this.lastVelocity = this.velocity;
        this.velocity = 0;
        this.isScrolling = false;
        this.emit();
      }, 400);
    }
  };
  reset() {
    this.isLocked = false;
    this.isScrolling = false;
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0;
    this.animate.stop();
  }
  /**
  * Start lenis scroll after it has been stopped
  */
  start() {
    if (!this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.removeProperty("overflow");
      return;
    }
    this.internalStart();
  }
  internalStart() {
    if (!this.isStopped) return;
    this.reset();
    this.isStopped = false;
    this.emit();
  }
  /**
  * Stop lenis scroll
  */
  stop() {
    if (this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.setProperty("overflow", "clip");
      return;
    }
    this.internalStop();
  }
  internalStop() {
    if (this.isStopped) return;
    this.reset();
    this.isStopped = true;
    this.emit();
  }
  /**
  * RequestAnimationFrame for lenis
  *
  * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
  */
  raf = (time) => {
    const deltaTime = time - (this.time || time);
    this.time = time;
    this.animate.advance(deltaTime * 1e-3);
    if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
  };
  /**
  * Scroll to a target value
  *
  * @param target The target value to scroll to
  * @param options The options for the scroll
  *
  * @example
  * lenis.scrollTo(100, {
  *   offset: 100,
  *   duration: 1,
  *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
  *   lerp: 0.1,
  *   onStart: () => {
  *     console.log('onStart')
  *   },
  *   onComplete: () => {
  *     console.log('onComplete')
  *   },
  * })
  */
  scrollTo(_target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp: lerp2 = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
    if ((this.isStopped || this.isLocked) && !force) return;
    let target = _target;
    let adjustedOffset = offset;
    if (typeof target === "string" && [
      "top",
      "left",
      "start",
      "#"
    ].includes(target)) target = 0;
    else if (typeof target === "string" && [
      "bottom",
      "right",
      "end"
    ].includes(target)) target = this.limit;
    else {
      let node = null;
      if (typeof target === "string") {
        node = document.querySelector(target);
        if (!node) if (target === "#top") target = 0;
        else console.warn("Lenis: Target not found", target);
      } else if (target instanceof HTMLElement && target?.nodeType) node = target;
      if (node) {
        if (this.options.wrapper !== window) {
          const wrapperRect = this.rootElement.getBoundingClientRect();
          adjustedOffset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
        }
        const rect = node.getBoundingClientRect();
        const targetStyle = getComputedStyle(node);
        const scrollMargin = this.isHorizontal ? Number.parseFloat(targetStyle.scrollMarginLeft) : Number.parseFloat(targetStyle.scrollMarginTop);
        const containerStyle = getComputedStyle(this.rootElement);
        const scrollPadding = this.isHorizontal ? Number.parseFloat(containerStyle.scrollPaddingLeft) : Number.parseFloat(containerStyle.scrollPaddingTop);
        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll - (Number.isNaN(scrollMargin) ? 0 : scrollMargin) - (Number.isNaN(scrollPadding) ? 0 : scrollPadding);
      }
    }
    if (typeof target !== "number") return;
    target += adjustedOffset;
    if (this.options.infinite) {
      if (programmatic) {
        this.targetScroll = this.animatedScroll = this.scroll;
        const distance = target - this.animatedScroll;
        if (distance > this.limit / 2) target -= this.limit;
        else if (distance < -this.limit / 2) target += this.limit;
      }
    } else target = clamp(0, target, this.limit);
    if (target === this.targetScroll) {
      onStart?.(this);
      onComplete?.(this);
      return;
    }
    this.userData = userData ?? {};
    if (immediate) {
      this.animatedScroll = this.targetScroll = target;
      this.setScroll(this.scroll);
      this.reset();
      this.preventNextNativeScrollEvent();
      this.emit();
      onComplete?.(this);
      this.userData = {};
      requestAnimationFrame(() => {
        this.dispatchScrollendEvent();
      });
      return;
    }
    if (!programmatic) this.targetScroll = target;
    if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
    else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
    this.animate.fromTo(this.animatedScroll, target, {
      duration,
      easing,
      lerp: lerp2,
      onStart: () => {
        if (lock) this.isLocked = true;
        this.isScrolling = "smooth";
        onStart?.(this);
      },
      onUpdate: (value, completed) => {
        this.isScrolling = "smooth";
        this.lastVelocity = this.velocity;
        this.velocity = value - this.animatedScroll;
        this.direction = Math.sign(this.velocity);
        this.animatedScroll = value;
        this.setScroll(this.scroll);
        if (programmatic) this.targetScroll = value;
        if (!completed) this.emit();
        if (completed) {
          this.reset();
          this.emit();
          onComplete?.(this);
          this.userData = {};
          requestAnimationFrame(() => {
            this.dispatchScrollendEvent();
          });
          this.preventNextNativeScrollEvent();
        }
      }
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNextNativeScrollEvent = true;
    requestAnimationFrame(() => {
      this._preventNextNativeScrollEvent = false;
    });
  }
  hasNestedScroll(node, { deltaX, deltaY }) {
    const time = Date.now();
    if (!node._lenis) node._lenis = {};
    const cache = node._lenis;
    let hasOverflowX;
    let hasOverflowY;
    let isScrollableX;
    let isScrollableY;
    let hasOverscrollBehaviorX;
    let hasOverscrollBehaviorY;
    let scrollWidth;
    let scrollHeight;
    let clientWidth;
    let clientHeight;
    if (time - (cache.time ?? 0) > 2e3) {
      cache.time = Date.now();
      const computedStyle = window.getComputedStyle(node);
      cache.computedStyle = computedStyle;
      hasOverflowX = [
        "auto",
        "overlay",
        "scroll"
      ].includes(computedStyle.overflowX);
      hasOverflowY = [
        "auto",
        "overlay",
        "scroll"
      ].includes(computedStyle.overflowY);
      hasOverscrollBehaviorX = ["auto"].includes(computedStyle.overscrollBehaviorX);
      hasOverscrollBehaviorY = ["auto"].includes(computedStyle.overscrollBehaviorY);
      cache.hasOverflowX = hasOverflowX;
      cache.hasOverflowY = hasOverflowY;
      if (!(hasOverflowX || hasOverflowY)) return false;
      scrollWidth = node.scrollWidth;
      scrollHeight = node.scrollHeight;
      clientWidth = node.clientWidth;
      clientHeight = node.clientHeight;
      isScrollableX = scrollWidth > clientWidth;
      isScrollableY = scrollHeight > clientHeight;
      cache.isScrollableX = isScrollableX;
      cache.isScrollableY = isScrollableY;
      cache.scrollWidth = scrollWidth;
      cache.scrollHeight = scrollHeight;
      cache.clientWidth = clientWidth;
      cache.clientHeight = clientHeight;
      cache.hasOverscrollBehaviorX = hasOverscrollBehaviorX;
      cache.hasOverscrollBehaviorY = hasOverscrollBehaviorY;
    } else {
      isScrollableX = cache.isScrollableX;
      isScrollableY = cache.isScrollableY;
      hasOverflowX = cache.hasOverflowX;
      hasOverflowY = cache.hasOverflowY;
      scrollWidth = cache.scrollWidth;
      scrollHeight = cache.scrollHeight;
      clientWidth = cache.clientWidth;
      clientHeight = cache.clientHeight;
      hasOverscrollBehaviorX = cache.hasOverscrollBehaviorX;
      hasOverscrollBehaviorY = cache.hasOverscrollBehaviorY;
    }
    if (!(hasOverflowX && isScrollableX || hasOverflowY && isScrollableY)) return false;
    const orientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
    let scroll;
    let maxScroll;
    let delta;
    let hasOverflow;
    let isScrollable;
    let hasOverscrollBehavior;
    if (orientation === "horizontal") {
      scroll = Math.round(node.scrollLeft);
      maxScroll = scrollWidth - clientWidth;
      delta = deltaX;
      hasOverflow = hasOverflowX;
      isScrollable = isScrollableX;
      hasOverscrollBehavior = hasOverscrollBehaviorX;
    } else if (orientation === "vertical") {
      scroll = Math.round(node.scrollTop);
      maxScroll = scrollHeight - clientHeight;
      delta = deltaY;
      hasOverflow = hasOverflowY;
      isScrollable = isScrollableY;
      hasOverscrollBehavior = hasOverscrollBehaviorY;
    } else return false;
    if (!hasOverscrollBehavior && (scroll >= maxScroll || scroll <= 0)) return true;
    return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
  }
  /**
  * The root element on which lenis is instanced
  */
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  /**
  * The limit which is the maximum scroll value
  */
  get limit() {
    if (this.options.naiveDimensions) {
      if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
      return this.rootElement.scrollHeight - this.rootElement.clientHeight;
    }
    return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  /**
  * Whether or not the scroll is horizontal
  */
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  /**
  * The actual scroll value
  */
  get actualScroll() {
    const wrapper = this.options.wrapper;
    return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
  }
  /**
  * The current scroll value
  */
  get scroll() {
    return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  /**
  * The progress of the scroll relative to the limit
  */
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  /**
  * Current scroll state
  */
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(value) {
    if (this._isScrolling !== value) {
      this._isScrolling = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is stopped
  */
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(value) {
    if (this._isStopped !== value) {
      this._isStopped = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is locked
  */
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(value) {
    if (this._isLocked !== value) {
      this._isLocked = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is smooth scrolling
  */
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  /**
  * The class name applied to the wrapper element
  */
  get className() {
    let className = "lenis";
    if (this.options.autoToggle) className += " lenis-autoToggle";
    if (this.isStopped) className += " lenis-stopped";
    if (this.isLocked) className += " lenis-locked";
    if (this.isScrolling) className += " lenis-scrolling";
    if (this.isScrolling === "smooth") className += " lenis-smooth";
    return className;
  }
  updateClassName() {
    this.cleanUpClassName();
    this.className.split(" ").forEach((className) => {
      this.rootElement.classList.add(className);
    });
  }
  cleanUpClassName() {
    for (const className of Array.from(this.rootElement.classList)) if (className === "lenis" || className.startsWith("lenis-")) this.rootElement.classList.remove(className);
  }
};
function useLenis() {
  reactExports.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    const onClick = (e) => {
      const target = e.target;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
const aboutImg = "/mulier-cafe-landing/assets/barista-8jmEUaNi.jpg";
const espresso = "/mulier-cafe-landing/assets/menu-espresso-BRRjfIg-.jpg";
const latte = "/mulier-cafe-landing/assets/menu-latte-CWWlUp1U.jpg";
const coldbrew = "/mulier-cafe-landing/assets/menu-coldbrew-BZyoPjbv.jpg";
const cappuccino = "/mulier-cafe-landing/assets/menu-cappuccino-DHYxihtV.jpg";
const g1 = "/mulier-cafe-landing/assets/gallery-1-CPVDrw5u.jpg";
const g2 = "/mulier-cafe-landing/assets/gallery-2-DMfsJ9vP.jpg";
const g3 = "/mulier-cafe-landing/assets/gallery-3-tEzhz0vL.jpg";
const g4 = "/mulier-cafe-landing/assets/gallery-4-DBto4CTW.jpg";
const logo = "/mulier-cafe-landing/assets/logom-CcBxJots.png";
const logoAlt = "/mulier-cafe-landing/assets/logo-alt-C4pE4xHu.jpg";
function Index() {
  useLenis();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Marquee, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(About, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Testimonials, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Gallery, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Nav() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: `fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "flex items-center gap-2.5 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Mulier Hogar de Café", className: "h-10 w-auto object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl", children: [
        "Mulier",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cobalt", children: "." }),
        " Hogar de Café"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#menu", className: "hover:text-cobalt transition-colors", children: "Menú" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "hover:text-cobalt transition-colors", children: "Nosotros" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#gallery", className: "hover:text-cobalt transition-colors", children: "Galería" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#visit", className: "hover:text-cobalt transition-colors", children: "Visítanos" })
    ] })
  ] }) });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex items-end pt-24 pb-16 px-6 md:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Latte Mulier sobre fondo azul cobalto", width: 1536, height: 1536, className: "w-full h-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-10 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-8 animate-fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAlt, alt: "Mulier Hogar de Café", className: "h-20 md:h-24 w-auto mb-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.25em] text-cobalt", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 h-px bg-cobalt" }),
          " Zacatecas Centro · Desde 2024"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6", children: [
          "Hogar de café,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-cobalt", children: "arte" }),
          " y comunidad."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Café de especialidad" }),
          " tostado con paciencia. Un espacio azul para encontrarse, leer, estudiar o simplemente respirar."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#menu", className: "inline-flex items-center gap-2 bg-cobalt text-primary-foreground px-7 py-4 rounded-full font-medium shadow-soft hover:scale-[1.02] transition-transform", children: [
          "Ver el menú",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "→" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-4 md:text-right animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-block bg-cobalt text-primary-foreground p-6 rounded-2xl shadow-sharp max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest opacity-80 mb-2", children: "Edición de temporada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl mb-1", children: "Cold Brew de Naranja" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Disponible hasta agotar existencias." })
      ] }) })
    ] })
  ] });
}
function Marquee() {
  const items = ["Café de especialidad", "Tueste artesanal", "Arte local", "Zacatecas Centro", "Comunidad", "Granos de origen"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-y border-border bg-cobalt text-primary-foreground py-5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-12 animate-marquee whitespace-nowrap font-display text-2xl italic", children: [...items, ...items, ...items].map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-12", children: [
    it,
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-50", children: "✦" })
  ] }, i)) }) });
}
function About() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "about", className: "py-28 px-6 md:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: aboutImg, alt: "Barista preparando café en Mulier", loading: "lazy", width: 1280, height: 1600, className: "w-full h-[600px] object-cover rounded-2xl shadow-sharp" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-6 -right-6 bg-cobalt text-primary-foreground p-6 rounded-2xl max-w-[220px] hidden md:block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl", children: "02" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest opacity-80 mt-1", children: [
          "Años tostando",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "historias"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-cobalt mb-4", children: "Nuestra historia" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-5xl leading-tight mb-6", children: [
        "Un rincón azul donde el café ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-cobalt not-italic", children: "se vuelve hogar" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-muted-foreground leading-relaxed mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Mulier" }),
        " tiene su origen en el latín que significa mujer, se usa con la finalidad de que quién lo representa es una mujer."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-muted-foreground leading-relaxed mb-8", children: [
        "Más que una cafetería, somos un punto de encuentro para estudiantes, parejas, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "mascotas" }),
        " y todos los que creen que el arte y la comunidad caben en una taza."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6 pt-8 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "100%", l: "Granos organicos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "12+", l: "Variedades" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "4.9★", l: "Google reviews" })
      ] })
    ] })
  ] }) });
}
function Stat({
  n,
  l
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-cobalt", children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mt-1", children: l })
  ] });
}
function Menu() {
  const items = [{
    img: espresso,
    name: "Espresso",
    desc: "Doble shot, cuerpo intenso, notas de chocolate amargo.",
    price: "$45"
  }, {
    img: latte,
    name: "Latte de la Casa",
    desc: "Espresso, leche cremosa y arte en cada taza.",
    price: "$65"
  }, {
    img: coldbrew,
    name: "Cold Brew 18h",
    desc: "Extracción lenta en frío, dulce y refrescante.",
    price: "$70"
  }, {
    img: cappuccino,
    name: "Cappuccino",
    desc: "Equilibrio perfecto entre espresso y espuma sedosa.",
    price: "$60"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "menu", className: "py-28 px-6 md:px-10 bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between mb-16 flex-wrap gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-cobalt mb-4", children: "Nuestro menú" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-6xl leading-tight max-w-2xl", children: [
        "Bebidas pensadas, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-cobalt not-italic", children: "una por una" }),
        "."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group bg-card rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-500 hover:-translate-y-1 animate-fade-up", style: {
      animationDelay: `${i * 80}ms`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.img, alt: it.name, loading: "lazy", width: 1024, height: 1024, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl", children: it.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cobalt font-medium", children: it.price })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: it.desc })
      ] })
    ] }, it.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#menu", className: "mt-10 inline-flex items-center gap-5 bg-cobalt text-primary-foreground px-7 py-4 rounded-full font-medium shadow-soft hover:scale-[1.02] transition-transform", children: [
      "Ver el menú completo",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "→" })
    ] })
  ] }) });
}
function Testimonials() {
  const reviews = [{
    name: "Ana Sofía R.",
    text: "El mejor café de Zacatecas. El latte de cardamomo es una experiencia. Y el espacio… puro arte.",
    role: "Estudiante"
  }, {
    name: "Diego M.",
    text: "Vinimos en una cita y terminamos quedándonos tres horas. La atención y el café son impecables.",
    role: "Visitante"
  }, {
    name: "Renata L.",
    text: "Mi rincón favorito para estudiar. Wifi rápido, baristas que saben y un cold brew que enamora.",
    role: "Universitaria"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-28 px-6 md:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-cobalt mb-5", children: "La comunidad opina con" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-6xl leading-tight", children: [
        "Más de ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-cobalt not-italic", children: "50 reseñas" }),
        " con 4.9★"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: reviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "bg-card border border-border p-8 rounded-2xl flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cobalt mb-4 text-lg tracking-widest", children: "★★★★★" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "font-display text-xl leading-snug mb-6 flex-1", children: [
        '"',
        r.text,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: r.role })
      ] })
    ] }, r.name)) })
  ] }) });
}
function Gallery() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "gallery", className: "py-28 px-6 md:px-10 bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-cobalt mb-4", children: "El espacio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-6xl leading-tight", children: [
        "Un lugar pensado para ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-cobalt not-italic", children: "quedarse" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: g1, alt: "Interior del café", loading: "lazy", width: 1280, height: 1600, className: "col-span-2 row-span-2 w-full h-full object-cover rounded-2xl aspect-[4/5]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: g3, alt: "Taza humeante", loading: "lazy", width: 1280, height: 1600, className: "w-full h-full object-cover rounded-2xl aspect-square" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: g2, alt: "Pareja conversando", loading: "lazy", width: 1280, height: 1280, className: "w-full h-full object-cover rounded-2xl aspect-square" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: g4, alt: "Granos tostándose", loading: "lazy", width: 1280, height: 1280, className: "col-span-2 w-full h-full object-cover rounded-2xl aspect-[2/1]" })
    ] })
  ] }) });
}
function CTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "visit", className: "py-28 px-6 md:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto bg-cobalt text-primary-foreground rounded-3xl p-10 md:p-20 text-center shadow-sharp relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.25em] opacity-80 mb-5", children: "Te esperamos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-6", children: [
        "Tu próxima taza",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "ya tiene ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "not-italic", children: "nombre" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg opacity-90 max-w-xl mx-auto mb-10", children: [
        "Visítanos en Zacatecas Centro! Mostrando este sitio: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "10% off" }),
        " en tu primera bebida."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://maps.app.goo.gl/B3SzaRs4A55oMP6t9", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 border border-primary-foreground/40 px-7 py-4 rounded-full font-medium hover:bg-primary-foreground hover:text-cobalt transition-colors", children: "Cómo llegar" }) })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border px-6 md:px-10 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto grid md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Mulier Hogar de Café", className: "h-10 w-auto object-contain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl", children: [
            "Mulier",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cobalt", children: "." }),
            " Hogar de Café"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: "Café de especialidad, arte y comunidad en el corazón de Zacatecas." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-cobalt mb-3", children: "Visítanos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Zacatecas Centro",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Zacatecas, México"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-3", children: [
          "Lun – Vie · 8am – 9pm",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Sáb – Dom · 9am – 10pm"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-cobalt mb-3", children: "Síguenos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-cobalt", children: "Instagram" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-cobalt", children: "TikTok" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto mt-14 pt-8 border-t border-border flex flex-wrap gap-3 justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Mulier. Hogar de Café."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hecho con cariño en Zacatecas." })
    ] })
  ] });
}
export {
  Index as component
};
