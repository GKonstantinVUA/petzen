(() => {
    "use strict";
    const modules_flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function showMore() {
        window.addEventListener("load", (function(e) {
            const showMoreBlocks = document.querySelectorAll("[data-showmore]");
            let showMoreBlocksRegular;
            let mdQueriesArray;
            if (showMoreBlocks.length) {
                showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
                    return !item.dataset.showmoreMedia;
                }));
                showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                document.addEventListener("click", showMoreActions);
                window.addEventListener("resize", showMoreActions);
                mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
                if (mdQueriesArray && mdQueriesArray.length) {
                    mdQueriesArray.forEach((mdQueriesItem => {
                        mdQueriesItem.matchMedia.addEventListener("change", (function() {
                            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                        }));
                    }));
                    initItemsMedia(mdQueriesArray);
                }
            }
            function initItemsMedia(mdQueriesArray) {
                mdQueriesArray.forEach((mdQueriesItem => {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
            }
            function initItems(showMoreBlocks, matchMedia) {
                showMoreBlocks.forEach((showMoreBlock => {
                    initItem(showMoreBlock, matchMedia);
                }));
            }
            function initItem(showMoreBlock, matchMedia = false) {
                showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
                let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
                let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
                showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                    _slideUp(showMoreContent, 0, showMoreBlock.classList.contains("_showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
                    showMoreButton.hidden = false;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                }
            }
            function getHeight(showMoreBlock, showMoreContent) {
                let hiddenHeight = 0;
                const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
                const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
                if (showMoreType === "items") {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
                    const showMoreItems = showMoreContent.children;
                    for (let index = 1; index < showMoreItems.length; index++) {
                        const showMoreItem = showMoreItems[index - 1];
                        const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
                        const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
                        hiddenHeight += showMoreItem.offsetHeight + marginTop;
                        if (index == showMoreTypeValue) break;
                        hiddenHeight += marginBottom;
                    }
                    rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
                } else {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
                    hiddenHeight = showMoreTypeValue;
                }
                return hiddenHeight;
            }
            function getOriginalHeight(showMoreContent) {
                let parentHidden;
                let hiddenHeight = showMoreContent.offsetHeight;
                showMoreContent.style.removeProperty("height");
                if (showMoreContent.closest(`[hidden]`)) {
                    parentHidden = showMoreContent.closest(`[hidden]`);
                    parentHidden.hidden = false;
                }
                let originalHeight = showMoreContent.offsetHeight;
                parentHidden ? parentHidden.hidden = true : null;
                showMoreContent.style.height = `${hiddenHeight}px`;
                return originalHeight;
            }
            function showMoreActions(e) {
                const targetEvent = e.target;
                const targetType = e.type;
                if (targetType === "click") {
                    if (targetEvent.closest("[data-showmore-button]")) {
                        const showMoreButton = targetEvent.closest("[data-showmore-button]");
                        const showMoreBlock = showMoreButton.closest("[data-showmore]");
                        const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                        if (!showMoreContent.classList.contains("_slide")) {
                            showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                            showMoreBlock.classList.toggle("_showmore-active");
                        }
                    }
                } else if (targetType === "resize") {
                    showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                    mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
                }
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    document.addEventListener("DOMContentLoaded", (function() {
        const itemsToShow = 2;
 //!Можна вказати скільки скільки потрібно відображати за замовчуванням
                const itemArea = document.querySelectorAll(".card__cell");
 //! Яцейка з карткою
                const showMoreBtn = document.querySelector(".card__show-more");
 //! Кнопка яка буде виконувати функції Показати Ще/Сховати. За замовчуванням до неї призначено клас "назва контейнера"__show-more
                document.querySelector(".card");
 //!Загальний контейнер в якому містяться всі картки
                let itemsShown = itemsToShow;
 //! Початкова кількість показаних елементів
                function toggleItems() {
            if (window.innerWidth <= 760) //! Вказати розмір до якого не буде реалізації Показати Ще/Сховати 
            showMoreBtn.style.display = "block"; //! Показує кнопку, якщо розмір вікна менше ?px
             else showMoreBtn.style.display = "none";
 //! Приховує кнопку, якщо розмір вікна більше ?px
                        if (window.innerWidth <= 760) //!Вказати який підходить розмір для приховування 
            itemArea.forEach(((item, index) => {
                if (index < itemsShown) item.style.display = " block"; //! Показуємо елемент якщо потрібний flex, grid вказати flex/grid
                 else item.style.display = "none";
 //! Ховається елемент
                        })); else itemArea.forEach((item => {
                item.style.display = " block";
 //! Відображається елемент якщо потрібний flex/grid. Вказати flex/grid
                        }));
            //! ПЕревірка, чи всі елементи вже відображені. Відповідно змінюється текст кнопки 
                        if (itemsShown === itemArea.length) showMoreBtn.textContent = "Esconder"; //!Додається клас коли картки закінчились
             else showMoreBtn.textContent = "Mostre mais";
 //!Клас коли потрібно відорбажати картки
                }
        toggleItems();
 //! Викликаємо перевірку вікна при завантаженні сторінки
                showMoreBtn.addEventListener("click", (function() {
            if (itemsShown >= itemArea.length) 
            //! Якщо всі елементи вже видимі, ховаємо їх по одному, починаючи з останнього
            itemsShown = itemsToShow; else 
            //! Якщо ще є елементи, які не відображені, показуємо наступні елементи
            itemsShown = Math.min(itemsShown + 1, itemArea.length);
            toggleItems();
            //! Прокрутка до останнього показаного елемента
                        if (itemsShown <= itemArea.length) itemArea[itemsShown - 1].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }));
        window.addEventListener("resize", toggleItems);
 //!Викликаємо перевірку вікна при зміні розміру вікна
        }));
    window["FLS"] = true;
    menuInit();
    showMore();
    pageNavigation();
})();