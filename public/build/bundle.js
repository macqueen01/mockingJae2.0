
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc) {
        const info = { style_element: element('style'), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { style_element, rules } = managed_styles.get(doc) || create_style_information(doc);
        if (!rules[name]) {
            const stylesheet = append_stylesheet(doc, style_element);
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { style_element } = info;
                detach(style_element);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Navbar.svelte generated by Svelte v3.50.0 */

    const file$e = "src/Navbar.svelte";

    // (62:9) {:else}
    function create_else_block$8(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Jae_footer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "27");
    			attr_dev(img, "alt", "JAE");
    			add_location(img, file$e, 62, 4, 1173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(62:9) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:3) {#if !loggedIn}
    function create_if_block_1$b(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Me.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "30");
    			attr_dev(img, "alt", "JAE");
    			add_location(img, file$e, 60, 13, 1099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(60:3) {#if !loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#if !loggedIn}
    function create_if_block$b(ctx) {
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t;
    	let div1;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img0 = element("img");
    			t = space();
    			div1 = element("div");
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/Home.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "28");
    			attr_dev(img0, "alt", "home");
    			add_location(img0, file$e, 68, 20, 1372);
    			attr_dev(div0, "class", "home-wrap");
    			add_location(div0, file$e, 67, 16, 1328);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/Global.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "28");
    			attr_dev(img1, "alt", "global");
    			add_location(img1, file$e, 71, 20, 1513);
    			attr_dev(div1, "class", "global-wrap");
    			add_location(div1, file$e, 70, 16, 1467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(67:12) {#if !loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let t1;
    	let div1;
    	let img;
    	let img_src_value;

    	function select_block_type(ctx, dirty) {
    		if (!/*loggedIn*/ ctx[0]) return create_if_block_1$b;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*loggedIn*/ ctx[0] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(div0, "class", "logo-wrap svelte-u9wn43");
    			add_location(div0, file$e, 58, 8, 1043);
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Dm.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "28");
    			attr_dev(img, "alt", "dm");
    			add_location(img, file$e, 75, 16, 1664);
    			attr_dev(div1, "class", "dm-wrap");
    			add_location(div1, file$e, 74, 12, 1626);
    			attr_dev(div2, "class", "menu-wrap svelte-u9wn43");
    			add_location(div2, file$e, 65, 8, 1260);
    			attr_dev(div3, "class", "nav-content-wrap svelte-u9wn43");
    			add_location(div3, file$e, 57, 4, 1004);
    			attr_dev(div4, "class", "navbar svelte-u9wn43");
    			add_location(div4, file$e, 56, 0, 979);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			if_block0.m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (!/*loggedIn*/ ctx[0]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$b(ctx);
    					if_block1.c();
    					if_block1.m(div2, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let { loggedIn } = $$props;
    	const writable_props = ['loggedIn'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    	};

    	$$self.$capture_state = () => ({ loggedIn });

    	$$self.$inject_state = $$props => {
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loggedIn];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { loggedIn: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*loggedIn*/ ctx[0] === undefined && !('loggedIn' in props)) {
    			console.warn("<Navbar> was created without expected prop 'loggedIn'");
    		}
    	}

    	get loggedIn() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loggedIn(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/Login.svelte generated by Svelte v3.50.0 */

    const { console: console_1$9 } = globals;
    const file$d = "src/forms/Login.svelte";

    function create_fragment$e(ctx) {
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div7;
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let label0_class_value;
    	let t2;
    	let input0;
    	let t3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let div2;
    	let label1;
    	let t5;
    	let label1_class_value;
    	let t6;
    	let input1;
    	let t7;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let div6;
    	let div3;
    	let button0;
    	let t9;
    	let div4;
    	let hr0;
    	let t10;
    	let p;
    	let t12;
    	let hr1;
    	let t13;
    	let div5;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div7 = element("div");
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			t1 = text("Your email");
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			img1 = element("img");
    			t4 = space();
    			div2 = element("div");
    			label1 = element("label");
    			t5 = text("Password");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			img2 = element("img");
    			t8 = space();
    			div6 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			t9 = space();
    			div4 = element("div");
    			hr0 = element("hr");
    			t10 = space();
    			p = element("p");
    			p.textContent = "OR";
    			t12 = space();
    			hr1 = element("hr");
    			t13 = space();
    			div5 = element("div");
    			button1 = element("button");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/Jae.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "55");
    			add_location(img0, file$d, 238, 20, 4921);
    			attr_dev(div0, "class", "login-title svelte-o82d3k");
    			add_location(div0, file$d, 237, 16, 4875);
    			attr_dev(label0, "for", "username");

    			attr_dev(label0, "class", label0_class_value = "" + (null_to_empty(/*email*/ ctx[0].length == 0
    			? 'username-label'
    			: 'username-label-filled') + " svelte-o82d3k"));

    			add_location(label0, file$d, 243, 28, 5164);
    			attr_dev(input0, "class", "email-input svelte-o82d3k");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "username");
    			input0.required = true;
    			add_location(input0, file$d, 244, 28, 5306);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/crop_bar.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "4");
    			attr_dev(img1, "width", "200");
    			add_location(img1, file$d, 245, 28, 5418);
    			attr_dev(div1, "class", "login-input svelte-o82d3k");
    			add_location(div1, file$d, 242, 24, 5110);
    			attr_dev(label1, "for", "password");

    			attr_dev(label1, "class", label1_class_value = "" + (null_to_empty(/*password*/ ctx[1].length == 0
    			? 'password-label'
    			: 'password-label-filled') + " svelte-o82d3k"));

    			add_location(label1, file$d, 248, 28, 5583);
    			attr_dev(input1, "class", "password-input svelte-o82d3k");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$d, 249, 28, 5765);
    			if (!src_url_equal(img2.src, img2_src_value = "/icons/crop_bar.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "height", "4");
    			attr_dev(img2, "width", "200");
    			add_location(img2, file$d, 250, 28, 5887);
    			attr_dev(div2, "class", "login-input svelte-o82d3k");
    			add_location(div2, file$d, 247, 24, 5529);
    			attr_dev(button0, "class", "login-button svelte-o82d3k");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$d, 254, 30, 6137);
    			attr_dev(div3, "class", "login-button-wrap svelte-o82d3k");
    			add_location(div3, file$d, 253, 26, 6045);
    			attr_dev(hr0, "class", "first svelte-o82d3k");
    			add_location(hr0, file$d, 257, 30, 6326);
    			attr_dev(p, "class", "middle svelte-o82d3k");
    			add_location(p, file$d, 258, 30, 6375);
    			attr_dev(hr1, "class", "second svelte-o82d3k");
    			add_location(hr1, file$d, 259, 30, 6430);
    			attr_dev(div4, "class", "or svelte-o82d3k");
    			add_location(div4, file$d, 256, 26, 6279);
    			attr_dev(button1, "class", "signin-button svelte-o82d3k");
    			add_location(button1, file$d, 262, 30, 6572);
    			attr_dev(div5, "class", "signin-button-wrap svelte-o82d3k");
    			add_location(div5, file$d, 261, 26, 6509);
    			attr_dev(div6, "class", "actions svelte-o82d3k");
    			add_location(div6, file$d, 252, 24, 5997);
    			attr_dev(form, "action", "/login");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$d, 241, 20, 5049);
    			attr_dev(div7, "class", "login-form svelte-o82d3k");
    			add_location(div7, file$d, 240, 16, 5004);
    			attr_dev(div8, "class", "login svelte-o82d3k");
    			add_location(div8, file$d, 236, 12, 4839);
    			attr_dev(div9, "class", "login-wrap svelte-o82d3k");
    			add_location(div9, file$d, 235, 16, 4802);
    			attr_dev(div10, "class", "login-container svelte-o82d3k");
    			add_location(div10, file$d, 234, 4, 4756);
    			attr_dev(div11, "class", "content-wrap svelte-o82d3k");
    			add_location(div11, file$d, 233, 0, 4725);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div0, img0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, form);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(label0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, input0);
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(div1, t3);
    			append_dev(div1, img1);
    			append_dev(form, t4);
    			append_dev(form, div2);
    			append_dev(div2, label1);
    			append_dev(label1, t5);
    			append_dev(div2, t6);
    			append_dev(div2, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div2, t7);
    			append_dev(div2, img2);
    			append_dev(form, t8);
    			append_dev(form, div6);
    			append_dev(div6, div3);
    			append_dev(div3, button0);
    			append_dev(div6, t9);
    			append_dev(div6, div4);
    			append_dev(div4, hr0);
    			append_dev(div4, t10);
    			append_dev(div4, p);
    			append_dev(div4, t12);
    			append_dev(div4, hr1);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(button1, "click", /*switchToSignIn*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && label0_class_value !== (label0_class_value = "" + (null_to_empty(/*email*/ ctx[0].length == 0
    			? 'username-label'
    			: 'username-label-filled') + " svelte-o82d3k"))) {
    				attr_dev(label0, "class", label0_class_value);
    			}

    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && label1_class_value !== (label1_class_value = "" + (null_to_empty(/*password*/ ctx[1].length == 0
    			? 'password-label'
    			: 'password-label-filled') + " svelte-o82d3k"))) {
    				attr_dev(label1, "class", label1_class_value);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	var dispatch = createEventDispatcher();
    	let email = "";
    	let password = "";

    	function switchToSignIn() {
    		console.log("switching to signIn");
    		dispatch('mode', { signIn: true });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		email,
    		password,
    		switchToSignIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [email, password, switchToSignIn, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/forms/SignInComponents/SetName.svelte generated by Svelte v3.50.0 */

    const { console: console_1$8 } = globals;
    const file$c = "src/forms/SignInComponents/SetName.svelte";

    // (238:12) {:else}
    function create_else_block$7(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Name is not valid enough...";
    			add_location(h2, file$c, 238, 16, 5204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(238:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (235:40) 
    function create_if_block_7$2(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let h2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "are you sure?";
    			add_location(h1, file$c, 235, 16, 5113);
    			add_location(h2, file$c, 236, 16, 5145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(235:40) ",
    		ctx
    	});

    	return block;
    }

    // (233:13) {#if name == ""}
    function create_if_block_6$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "What are you called?";
    			add_location(h2, file$c, 233, 16, 5026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(233:13) {#if name == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (252:12) {#if !name_rule_detail.is_long_enough}
    function create_if_block_5$4(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Too short! Make it longer than 2 letters.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$c, 254, 24, 5788);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$c, 253, 20, 5740);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$c, 256, 20, 5896);
    			attr_dev(div1, "class", "requirement-wrap svelte-1x4d1sa");
    			add_location(div1, file$c, 252, 16, 5689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$4.name,
    		type: "if",
    		source: "(252:12) {#if !name_rule_detail.is_long_enough}",
    		ctx
    	});

    	return block;
    }

    // (260:12) {#if !name_rule_detail.is_short_enough}
    function create_if_block_4$6(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Too long! Make it shorter than 11 letters.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$c, 262, 24, 6153);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$c, 261, 20, 6105);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$c, 264, 20, 6261);
    			attr_dev(div1, "class", "requirement-wrap svelte-1x4d1sa");
    			add_location(div1, file$c, 260, 16, 6054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$6.name,
    		type: "if",
    		source: "(260:12) {#if !name_rule_detail.is_short_enough}",
    		ctx
    	});

    	return block;
    }

    // (268:12) {#if !name_rule_detail.no_whitespace}
    function create_if_block_3$6(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "No whitespace is allowed.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$c, 270, 24, 6517);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$c, 269, 20, 6469);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$c, 272, 16, 6621);
    			attr_dev(div1, "class", "requirement-wrap svelte-1x4d1sa");
    			add_location(div1, file$c, 268, 16, 6418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$6.name,
    		type: "if",
    		source: "(268:12) {#if !name_rule_detail.no_whitespace}",
    		ctx
    	});

    	return block;
    }

    // (276:12) {#if name_rule_result}
    function create_if_block_2$8(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Good to go!";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$c, 278, 24, 6851);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$c, 277, 20, 6803);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$c, 280, 16, 6955);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-1x4d1sa");
    			add_location(div1, file$c, 276, 16, 6746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(276:12) {#if name_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (290:8) {#if stage != 0}
    function create_if_block_1$a(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-1x4d1sa");
    			add_location(button, file$c, 290, 12, 7162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(290:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (295:8) {#if (stage == 0) && (name != "") && name_rule_result}
    function create_if_block$a(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-1x4d1sa");
    			add_location(button, file$c, 295, 8, 7329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*bubbleUpName*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(295:8) {#if (stage == 0) && (name != \\\"\\\") && name_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let input;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div3;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div8;
    	let div6;
    	let t7;
    	let div7;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*name*/ ctx[0] == "") return create_if_block_6$2;
    		if (/*name_rule_result*/ ctx[3]) return create_if_block_7$2;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*name_rule_detail*/ ctx[2].is_long_enough && create_if_block_5$4(ctx);
    	let if_block2 = !/*name_rule_detail*/ ctx[2].is_short_enough && create_if_block_4$6(ctx);
    	let if_block3 = !/*name_rule_detail*/ ctx[2].no_whitespace && create_if_block_3$6(ctx);
    	let if_block4 = /*name_rule_result*/ ctx[3] && create_if_block_2$8(ctx);
    	let if_block5 = /*stage*/ ctx[1] != 0 && create_if_block_1$a(ctx);
    	let if_block6 = /*stage*/ ctx[1] == 0 && /*name*/ ctx[0] != "" && /*name_rule_result*/ ctx[3] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			div8 = element("div");
    			div6 = element("div");
    			if (if_block5) if_block5.c();
    			t7 = space();
    			div7 = element("div");
    			if (if_block6) if_block6.c();
    			attr_dev(div0, "class", "questionair-container svelte-1x4d1sa");
    			add_location(div0, file$c, 231, 8, 4944);
    			attr_dev(input, "id", "name");
    			attr_dev(input, "name", "name");
    			attr_dev(input, "class", "name-field svelte-1x4d1sa");
    			add_location(input, file$c, 244, 16, 5367);
    			attr_dev(div1, "class", "field-wrap svelte-1x4d1sa");
    			add_location(div1, file$c, 243, 12, 5326);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$c, 247, 12, 5490);
    			attr_dev(div2, "class", "form-wrap svelte-1x4d1sa");
    			add_location(div2, file$c, 242, 8, 5290);
    			attr_dev(div3, "class", "name-requirement-container svelte-1x4d1sa");
    			add_location(div3, file$c, 250, 8, 5581);
    			attr_dev(div4, "class", "container svelte-1x4d1sa");
    			add_location(div4, file$c, 230, 4, 4912);
    			attr_dev(div5, "class", "set-user-name-wrap svelte-1x4d1sa");
    			add_location(div5, file$c, 229, 0, 4875);
    			attr_dev(div6, "class", "sub-navbar-left svelte-1x4d1sa");
    			add_location(div6, file$c, 288, 4, 7095);
    			attr_dev(div7, "class", "sub-navbar-right svelte-1x4d1sa");
    			add_location(div7, file$c, 293, 4, 7227);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-1x4d1sa");
    			add_location(div8, file$c, 287, 0, 7061);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			if_block0.m(div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*name*/ ctx[0]);
    			append_dev(div2, t1);
    			append_dev(div2, img);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t3);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t4);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block4) if_block4.m(div3, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			if (if_block5) if_block5.m(div6, null);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			if (if_block6) if_block6.m(div7, null);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}

    			if (!/*name_rule_detail*/ ctx[2].is_long_enough) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_5$4(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!/*name_rule_detail*/ ctx[2].is_short_enough) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_4$6(ctx);
    					if_block2.c();
    					if_block2.m(div3, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*name_rule_detail*/ ctx[2].no_whitespace) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_3$6(ctx);
    					if_block3.c();
    					if_block3.m(div3, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name_rule_result*/ ctx[3]) {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_2$8(ctx);
    					if_block4.c();
    					if_block4.m(div3, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*stage*/ ctx[1] != 0) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_1$a(ctx);
    					if_block5.c();
    					if_block5.m(div6, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*stage*/ ctx[1] == 0 && /*name*/ ctx[0] != "" && /*name_rule_result*/ ctx[3]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block$a(ctx);
    					if_block6.c();
    					if_block6.m(div7, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div8);
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetName', slots, []);
    	let { stage = 0 } = $$props;
    	let { name } = $$props;
    	var dispatch = createEventDispatcher();

    	function bubbleUpName() {
    		console.log("bubble up name...");
    		$$invalidate(1, stage = 1);
    		dispatch('userName', { name, stage });
    	}

    	let name_rule_detail = {
    		is_long_enough: false,
    		is_short_enough: true,
    		no_whitespace: true
    	};

    	let name_rule_result = false;

    	function name_rule(name) {
    		let whitespace = /\s/;
    		let name_regex_result = !whitespace.test(name);
    		let min_len = 3;
    		let max_len = 10;
    		let name_len = name.length;
    		let detail = {};
    		detail.is_long_enough = name_len >= min_len;
    		detail.is_short_enough = name_len <= max_len;
    		detail.no_whitespace = name_regex_result;
    		$$invalidate(2, name_rule_detail = detail);
    		console.log(name);
    	}

    	const writable_props = ['stage', 'name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<SetName> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		stage,
    		name,
    		createEventDispatcher,
    		dispatch,
    		bubbleUpName,
    		name_rule_detail,
    		name_rule_result,
    		name_rule
    	});

    	$$self.$inject_state = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('name_rule_detail' in $$props) $$invalidate(2, name_rule_detail = $$props.name_rule_detail);
    		if ('name_rule_result' in $$props) $$invalidate(3, name_rule_result = $$props.name_rule_result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name, name_rule_detail*/ 5) {
    			{
    				name_rule(name);
    				$$invalidate(3, name_rule_result = name_rule_detail.is_long_enough && name_rule_detail.is_short_enough && name_rule_detail.no_whitespace);
    			}
    		}
    	};

    	return [
    		name,
    		stage,
    		name_rule_detail,
    		name_rule_result,
    		bubbleUpName,
    		input_input_handler
    	];
    }

    class SetName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { stage: 1, name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetName",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1$8.warn("<SetName> was created without expected prop 'name'");
    		}
    	}

    	get stage() {
    		throw new Error("<SetName>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<SetName>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<SetName>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<SetName>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/SignInComponents/SetEmail.svelte generated by Svelte v3.50.0 */

    const { console: console_1$7 } = globals;
    const file$b = "src/forms/SignInComponents/SetEmail.svelte";

    // (224:12) {:else}
    function create_else_block$6(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Email is not valid enough...";
    			add_location(h2, file$b, 224, 16, 4955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(224:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (222:41) 
    function create_if_block_5$3(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "You sure this is your email?";
    			add_location(h2, file$b, 222, 16, 4881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(222:41) ",
    		ctx
    	});

    	return block;
    }

    // (220:13) {#if email == ""}
    function create_if_block_4$5(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "What email address do you use?";
    			add_location(h2, file$b, 220, 16, 4783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$5.name,
    		type: "if",
    		source: "(220:13) {#if email == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (238:12) {#if !email_rule_result}
    function create_if_block_3$5(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "This is not a valid email format.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$b, 240, 24, 5531);
    			attr_dev(div0, "class", "icon-wrap svelte-1e2qs0c");
    			add_location(div0, file$b, 239, 20, 5483);
    			attr_dev(p, "class", "svelte-1e2qs0c");
    			add_location(p, file$b, 242, 20, 5639);
    			attr_dev(div1, "class", "requirement-wrap svelte-1e2qs0c");
    			add_location(div1, file$b, 238, 16, 5432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(238:12) {#if !email_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (246:12) {#if email_rule_result}
    function create_if_block_2$7(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Good to go!";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$b, 248, 24, 5878);
    			attr_dev(div0, "class", "icon-wrap svelte-1e2qs0c");
    			add_location(div0, file$b, 247, 20, 5830);
    			attr_dev(p, "class", "svelte-1e2qs0c");
    			add_location(p, file$b, 250, 20, 5986);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-1e2qs0c");
    			add_location(div1, file$b, 246, 16, 5773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(246:12) {#if email_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (260:8) {#if stage != 0}
    function create_if_block_1$9(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-1e2qs0c");
    			add_location(button, file$b, 260, 12, 6193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goBack*/ ctx[4], { once: true }, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(260:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (265:8) {#if (stage == 1) && (email != "") && email_rule_result}
    function create_if_block$9(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-1e2qs0c");
    			add_location(button, file$b, 265, 12, 6389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*bubbleUpEmail*/ ctx[3], { once: true }, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(265:8) {#if (stage == 1) && (email != \\\"\\\") && email_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let input;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div3;
    	let t3;
    	let t4;
    	let div8;
    	let div6;
    	let t5;
    	let div7;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*email*/ ctx[0] == "") return create_if_block_4$5;
    		if (/*email_rule_result*/ ctx[2]) return create_if_block_5$3;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*email_rule_result*/ ctx[2] && create_if_block_3$5(ctx);
    	let if_block2 = /*email_rule_result*/ ctx[2] && create_if_block_2$7(ctx);
    	let if_block3 = /*stage*/ ctx[1] != 0 && create_if_block_1$9(ctx);
    	let if_block4 = /*stage*/ ctx[1] == 1 && /*email*/ ctx[0] != "" && /*email_rule_result*/ ctx[2] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div8 = element("div");
    			div6 = element("div");
    			if (if_block3) if_block3.c();
    			t5 = space();
    			div7 = element("div");
    			if (if_block4) if_block4.c();
    			attr_dev(div0, "class", "questionair-container svelte-1e2qs0c");
    			add_location(div0, file$b, 218, 8, 4700);
    			attr_dev(input, "id", "email");
    			attr_dev(input, "name", "email");
    			attr_dev(input, "class", "email-field svelte-1e2qs0c");
    			add_location(input, file$b, 230, 16, 5119);
    			attr_dev(div1, "class", "field-wrap svelte-1e2qs0c");
    			add_location(div1, file$b, 229, 12, 5078);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$b, 233, 12, 5246);
    			attr_dev(div2, "class", "form-wrap svelte-1e2qs0c");
    			add_location(div2, file$b, 228, 8, 5042);
    			attr_dev(div3, "class", "email-requirement-container svelte-1e2qs0c");
    			add_location(div3, file$b, 236, 8, 5337);
    			attr_dev(div4, "class", "container svelte-1e2qs0c");
    			add_location(div4, file$b, 217, 4, 4668);
    			attr_dev(div5, "class", "set-user-email-wrap svelte-1e2qs0c");
    			add_location(div5, file$b, 216, 0, 4630);
    			attr_dev(div6, "class", "sub-navbar-left svelte-1e2qs0c");
    			add_location(div6, file$b, 258, 4, 6126);
    			attr_dev(div7, "class", "sub-navbar-right svelte-1e2qs0c");
    			add_location(div7, file$b, 263, 4, 6281);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-1e2qs0c");
    			add_location(div8, file$b, 257, 0, 6092);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			if_block0.m(div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*email*/ ctx[0]);
    			append_dev(div2, t1);
    			append_dev(div2, img);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t3);
    			if (if_block2) if_block2.m(div3, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			if (if_block3) if_block3.m(div6, null);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			if (if_block4) if_block4.m(div7, null);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*email*/ 1 && input.value !== /*email*/ ctx[0]) {
    				set_input_value(input, /*email*/ ctx[0]);
    			}

    			if (!/*email_rule_result*/ ctx[2]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_3$5(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*email_rule_result*/ ctx[2]) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_2$7(ctx);
    					if_block2.c();
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*stage*/ ctx[1] != 0) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$9(ctx);
    					if_block3.c();
    					if_block3.m(div6, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*stage*/ ctx[1] == 1 && /*email*/ ctx[0] != "" && /*email_rule_result*/ ctx[2]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$9(ctx);
    					if_block4.c();
    					if_block4.m(div7, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div8);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let email_rule_result;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetEmail', slots, []);
    	let { stage = 1 } = $$props;
    	let { email } = $$props;
    	var dispatch = createEventDispatcher();

    	function bubbleUpEmail() {
    		console.log("bubble up email...");
    		$$invalidate(1, stage = 2);
    		dispatch('userEmail', { email, stage });
    	}

    	function goBack() {
    		console.log("Go back to stage", stage - 1);
    		$$invalidate(1, stage = stage - 1);
    		dispatch('userEmail', { email, stage });
    	}

    	function email_rule(email) {
    		let rule = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
    		let email_regex_result = rule.test(email);
    		$$invalidate(2, email_rule_result = email_regex_result);
    	}

    	const writable_props = ['stage', 'email'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<SetEmail> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    	};

    	$$self.$capture_state = () => ({
    		stage,
    		email,
    		createEventDispatcher,
    		dispatch,
    		bubbleUpEmail,
    		goBack,
    		email_rule,
    		email_rule_result
    	});

    	$$self.$inject_state = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('email_rule_result' in $$props) $$invalidate(2, email_rule_result = $$props.email_rule_result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*email, email_rule_result*/ 5) {
    			{
    				email_rule(email);
    				console.log("email:", email);
    				console.log("email rule result:", email_rule_result);
    			}
    		}
    	};

    	$$invalidate(2, email_rule_result = false);
    	return [email, stage, email_rule_result, bubbleUpEmail, goBack, input_input_handler];
    }

    class SetEmail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { stage: 1, email: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetEmail",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*email*/ ctx[0] === undefined && !('email' in props)) {
    			console_1$7.warn("<SetEmail> was created without expected prop 'email'");
    		}
    	}

    	get stage() {
    		throw new Error("<SetEmail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<SetEmail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<SetEmail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<SetEmail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/SignInComponents/SetPassword.svelte generated by Svelte v3.50.0 */

    const { console: console_1$6 } = globals;
    const file$a = "src/forms/SignInComponents/SetPassword.svelte";

    // (283:12) {:else}
    function create_else_block_2$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Mode Error. Something went wrong ...";
    			add_location(h2, file$a, 283, 16, 7499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(283:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (275:47) 
    function create_if_block_10(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*password_container*/ ctx[4] == "") return create_if_block_11;
    		if (/*password*/ ctx[3] == /*password_container*/ ctx[4]) return create_if_block_12;
    		return create_else_block_1$3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(275:47) ",
    		ctx
    	});

    	return block;
    }

    // (267:12) {#if check_password_mode == 0}
    function create_if_block_7$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*password_container*/ ctx[4] == "") return create_if_block_8$1;
    		if (/*password_rule_result*/ ctx[2]) return create_if_block_9$1;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(267:12) {#if check_password_mode == 0}",
    		ctx
    	});

    	return block;
    }

    // (280:16) {:else}
    function create_else_block_1$3(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Password doesn't seem to match ... You sure ?";
    			add_location(h2, file$a, 280, 20, 7386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(280:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (278:57) 
    function create_if_block_12(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "LASTLY !";
    			add_location(h2, file$a, 278, 20, 7324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(278:57) ",
    		ctx
    	});

    	return block;
    }

    // (276:16) {#if password_container == ""}
    function create_if_block_11(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Now is time to check. Type again !";
    			add_location(h2, file$a, 276, 20, 7202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(276:16) {#if password_container == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (272:16) {:else}
    function create_else_block$5(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Password not strong enough ...";
    			add_location(h2, file$a, 272, 20, 7025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(272:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (270:47) 
    function create_if_block_9$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Make sure you internalize this magic password";
    			add_location(h2, file$a, 270, 20, 6926);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(270:47) ",
    		ctx
    	});

    	return block;
    }

    // (268:16) {#if password_container == ""}
    function create_if_block_8$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Set a magic password !";
    			add_location(h2, file$a, 268, 20, 6826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(268:16) {#if password_container == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (297:12) {#if !password_rule_result && !password_rule_detail.has_uppercase}
    function create_if_block_6$1(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "You need at least one uppercase.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$a, 299, 24, 8166);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$a, 298, 20, 8118);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$a, 301, 20, 8274);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$a, 297, 16, 8067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(297:12) {#if !password_rule_result && !password_rule_detail.has_uppercase}",
    		ctx
    	});

    	return block;
    }

    // (305:12) {#if !password_rule_result && !password_rule_detail.long_enough}
    function create_if_block_5$2(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Password need to be longer than nine characters.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$a, 307, 24, 8547);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$a, 306, 20, 8499);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$a, 309, 20, 8655);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$a, 305, 16, 8448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(305:12) {#if !password_rule_result && !password_rule_detail.long_enough}",
    		ctx
    	});

    	return block;
    }

    // (313:12) {#if !password_rule_result && !password_rule_detail.has_specialcase}
    function create_if_block_4$4(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "You need at least one special case.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$a, 315, 24, 8948);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$a, 314, 20, 8900);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$a, 317, 20, 9056);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$a, 313, 16, 8849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(313:12) {#if !password_rule_result && !password_rule_detail.has_specialcase}",
    		ctx
    	});

    	return block;
    }

    // (321:12) {#if !password_rule_result && !password_rule_detail.no_whitespace}
    function create_if_block_3$4(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "No whitespace is allowed!";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$a, 323, 24, 9334);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$a, 322, 20, 9286);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$a, 325, 20, 9442);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$a, 321, 16, 9235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(321:12) {#if !password_rule_result && !password_rule_detail.no_whitespace}",
    		ctx
    	});

    	return block;
    }

    // (329:12) {#if password_rule_result}
    function create_if_block_2$6(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Good to go!";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$a, 331, 24, 9676);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$a, 330, 20, 9628);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$a, 333, 16, 9780);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-2z43ps");
    			add_location(div1, file$a, 329, 16, 9571);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(329:12) {#if password_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (343:8) {#if stage != 0}
    function create_if_block_1$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-2z43ps");
    			add_location(button, file$a, 343, 12, 9987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goBack*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(343:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (348:8) {#if (stage == 2) && (password_container != "") && password_rule_result}
    function create_if_block$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-2z43ps");
    			add_location(button, file$a, 348, 12, 10194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*bubbleUpPassword*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(348:8) {#if (stage == 2) && (password_container != \\\"\\\") && password_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let input;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div3;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let div8;
    	let div6;
    	let t8;
    	let div7;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*check_password_mode*/ ctx[5] == 0) return create_if_block_7$1;
    		if (/*check_password_mode*/ ctx[5] == 1) return create_if_block_10;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_uppercase && create_if_block_6$1(ctx);
    	let if_block2 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].long_enough && create_if_block_5$2(ctx);
    	let if_block3 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_specialcase && create_if_block_4$4(ctx);
    	let if_block4 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].no_whitespace && create_if_block_3$4(ctx);
    	let if_block5 = /*password_rule_result*/ ctx[2] && create_if_block_2$6(ctx);
    	let if_block6 = /*stage*/ ctx[0] != 0 && create_if_block_1$8(ctx);
    	let if_block7 = /*stage*/ ctx[0] == 2 && /*password_container*/ ctx[4] != "" && /*password_rule_result*/ ctx[2] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			div8 = element("div");
    			div6 = element("div");
    			if (if_block6) if_block6.c();
    			t8 = space();
    			div7 = element("div");
    			if (if_block7) if_block7.c();
    			attr_dev(div0, "class", "questionair-container svelte-2z43ps");
    			add_location(div0, file$a, 265, 8, 6680);
    			attr_dev(input, "id", "password");
    			attr_dev(input, "name", "password");
    			attr_dev(input, "class", "password-field svelte-2z43ps");
    			attr_dev(input, "type", "password");
    			add_location(input, file$a, 289, 16, 7671);
    			attr_dev(div1, "class", "field-wrap svelte-2z43ps");
    			add_location(div1, file$a, 288, 12, 7630);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$a, 292, 12, 7836);
    			attr_dev(div2, "class", "form-wrap svelte-2z43ps");
    			add_location(div2, file$a, 287, 8, 7594);
    			attr_dev(div3, "class", "password-requirement-container svelte-2z43ps");
    			add_location(div3, file$a, 295, 8, 7927);
    			attr_dev(div4, "class", "container svelte-2z43ps");
    			add_location(div4, file$a, 264, 4, 6648);
    			attr_dev(div5, "class", "set-user-password-wrap svelte-2z43ps");
    			add_location(div5, file$a, 263, 0, 6607);
    			attr_dev(div6, "class", "sub-navbar-left svelte-2z43ps");
    			add_location(div6, file$a, 341, 4, 9920);
    			attr_dev(div7, "class", "sub-navbar-right svelte-2z43ps");
    			add_location(div7, file$a, 346, 4, 10070);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-2z43ps");
    			add_location(div8, file$a, 340, 0, 9886);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			if_block0.m(div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*password_container*/ ctx[4]);
    			append_dev(div2, t1);
    			append_dev(div2, img);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t3);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t4);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block4) if_block4.m(div3, null);
    			append_dev(div3, t6);
    			if (if_block5) if_block5.m(div3, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			if (if_block6) if_block6.m(div6, null);
    			append_dev(div8, t8);
    			append_dev(div8, div7);
    			if (if_block7) if_block7.m(div7, null);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*password_container*/ 16 && input.value !== /*password_container*/ ctx[4]) {
    				set_input_value(input, /*password_container*/ ctx[4]);
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_uppercase) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_6$1(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].long_enough) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_5$2(ctx);
    					if_block2.c();
    					if_block2.m(div3, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_specialcase) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_4$4(ctx);
    					if_block3.c();
    					if_block3.m(div3, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].no_whitespace) {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_3$4(ctx);
    					if_block4.c();
    					if_block4.m(div3, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*password_rule_result*/ ctx[2]) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_2$6(ctx);
    					if_block5.c();
    					if_block5.m(div3, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*stage*/ ctx[0] != 0) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_1$8(ctx);
    					if_block6.c();
    					if_block6.m(div6, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*stage*/ ctx[0] == 2 && /*password_container*/ ctx[4] != "" && /*password_rule_result*/ ctx[2]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block$8(ctx);
    					if_block7.c();
    					if_block7.m(div7, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div8);
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let check_password_mode;
    	let password;
    	let password_container;
    	let password_rule_result;
    	let password_rule_detail;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetPassword', slots, []);
    	let { stage = 2 } = $$props;
    	var dispatch = createEventDispatcher();

    	function bubbleUpPassword() {
    		if (stage == 2 && check_password_mode == 0) {
    			console.log("password initialized to", password_container);
    			$$invalidate(3, password = password_container);
    			$$invalidate(4, password_container = "");
    			$$invalidate(5, check_password_mode = 1);
    		} else if (stage == 2 && check_password_mode == 1) {
    			console.log("checking if password matches ...");

    			if (password_container == password && password != "") {
    				console.log("password matches");
    				$$invalidate(0, stage = 3);
    				dispatch("userPassword", { password, stage });
    				$$invalidate(4, password_container = "");
    			} else {
    				console.log("password match failed");
    				$$invalidate(5, check_password_mode = 0);
    				$$invalidate(4, password_container = "");
    				$$invalidate(3, password = "");
    			}
    		}
    	}

    	function goBack() {
    		if (check_password_mode == 0 && stage == 2) {
    			console.log("Go back to stage", stage - 1);
    			$$invalidate(0, stage = stage - 1);
    			dispatch('goBack', { stage });
    		} else if (check_password_mode == 1 && stage == 2) {
    			console.log("Go back to change the draft password");
    			$$invalidate(5, check_password_mode = 0);
    			$$invalidate(4, password_container = "");
    			$$invalidate(3, password = "");
    		}
    	}

    	function password_rule(password) {
    		let uppercase_rule = /[A-Z]/;
    		let min_rule = password.length >= 9;
    		let specialcase_rule = /[^A-Za-z0-9]/;
    		let no_whitespace_rule = /\s/;
    		let detail = {};
    		detail.has_uppercase = uppercase_rule.test(password);
    		detail.long_enough = min_rule;
    		detail.has_specialcase = specialcase_rule.test(password);
    		detail.no_whitespace = !no_whitespace_rule.test(password);
    		$$invalidate(1, password_rule_detail = detail);
    	}

    	const writable_props = ['stage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<SetPassword> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		password_container = this.value;
    		$$invalidate(4, password_container);
    	}

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    	};

    	$$self.$capture_state = () => ({
    		stage,
    		createEventDispatcher,
    		dispatch,
    		bubbleUpPassword,
    		goBack,
    		password_rule,
    		password_rule_detail,
    		password_rule_result,
    		password,
    		password_container,
    		check_password_mode
    	});

    	$$self.$inject_state = $$props => {
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('password_rule_detail' in $$props) $$invalidate(1, password_rule_detail = $$props.password_rule_detail);
    		if ('password_rule_result' in $$props) $$invalidate(2, password_rule_result = $$props.password_rule_result);
    		if ('password' in $$props) $$invalidate(3, password = $$props.password);
    		if ('password_container' in $$props) $$invalidate(4, password_container = $$props.password_container);
    		if ('check_password_mode' in $$props) $$invalidate(5, check_password_mode = $$props.check_password_mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*password_rule_detail*/ 2) {
    			$$invalidate(2, password_rule_result = password_rule_detail.has_uppercase && password_rule_detail.long_enough && password_rule_detail.has_specialcase && password_rule_detail.no_whitespace);
    		}

    		if ($$self.$$.dirty & /*password_container, password, password_rule_result, password_rule_detail*/ 30) {
    			{
    				password_rule(password_container);
    				console.log("password:", password);
    				console.log("password rule result:", password_rule_result);
    				$$invalidate(2, password_rule_result = password_rule_detail.has_uppercase && password_rule_detail.long_enough && password_rule_detail.has_specialcase && password_rule_detail.no_whitespace);
    			}
    		}
    	};

    	$$invalidate(5, check_password_mode = 0);
    	$$invalidate(3, password = "");
    	$$invalidate(4, password_container = "");

    	$$invalidate(1, password_rule_detail = {
    		has_uppercase: false,
    		long_enough: false,
    		has_specialcase: false,
    		no_whitespace: true
    	});

    	return [
    		stage,
    		password_rule_detail,
    		password_rule_result,
    		password,
    		password_container,
    		check_password_mode,
    		bubbleUpPassword,
    		goBack,
    		input_input_handler
    	];
    }

    class SetPassword extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { stage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetPassword",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get stage() {
    		throw new Error("<SetPassword>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<SetPassword>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/SignIn.svelte generated by Svelte v3.50.0 */

    const { console: console_1$5 } = globals;
    const file$9 = "src/forms/SignIn.svelte";

    // (106:8) {:else}
    function create_else_block$4(ctx) {
    	let h3;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "WELCOME TO";
    			t1 = space();
    			img = element("img");
    			attr_dev(h3, "class", "svelte-1pasrog");
    			add_location(h3, file$9, 106, 12, 2468);
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Jae.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "60");
    			add_location(img, file$9, 107, 12, 2500);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(106:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (104:29) 
    function create_if_block_2$5(ctx) {
    	let setpassword;
    	let current;

    	setpassword = new SetPassword({
    			props: { stage: /*stage*/ ctx[0] },
    			$$inline: true
    		});

    	setpassword.$on("userPassword", /*resetPassword*/ ctx[5]);
    	setpassword.$on("goBack", /*goBackHandler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(setpassword.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(setpassword, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const setpassword_changes = {};
    			if (dirty & /*stage*/ 1) setpassword_changes.stage = /*stage*/ ctx[0];
    			setpassword.$set(setpassword_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setpassword.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setpassword.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setpassword, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(104:29) ",
    		ctx
    	});

    	return block;
    }

    // (102:29) 
    function create_if_block_1$7(ctx) {
    	let setemail;
    	let current;

    	setemail = new SetEmail({
    			props: {
    				email: /*email*/ ctx[2],
    				stage: /*stage*/ ctx[0]
    			},
    			$$inline: true
    		});

    	setemail.$on("userEmail", /*resetEmail*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(setemail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(setemail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const setemail_changes = {};
    			if (dirty & /*email*/ 4) setemail_changes.email = /*email*/ ctx[2];
    			if (dirty & /*stage*/ 1) setemail_changes.stage = /*stage*/ ctx[0];
    			setemail.$set(setemail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setemail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setemail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setemail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(102:29) ",
    		ctx
    	});

    	return block;
    }

    // (100:8) {#if stage == 0}
    function create_if_block$7(ctx) {
    	let setname;
    	let current;

    	setname = new SetName({
    			props: {
    				name: /*name*/ ctx[1],
    				stage: /*stage*/ ctx[0]
    			},
    			$$inline: true
    		});

    	setname.$on("userName", /*resetName*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(setname.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(setname, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const setname_changes = {};
    			if (dirty & /*name*/ 2) setname_changes.name = /*name*/ ctx[1];
    			if (dirty & /*stage*/ 1) setname_changes.stage = /*stage*/ ctx[0];
    			setname.$set(setname_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setname.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setname.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setname, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(100:8) {#if stage == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$7, create_if_block_1$7, create_if_block_2$5, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*stage*/ ctx[0] == 0) return 0;
    		if (/*stage*/ ctx[0] == 1) return 1;
    		if (/*stage*/ ctx[0] == 2) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "signin-container svelte-1pasrog");
    			add_location(div0, file$9, 98, 4, 2071);
    			attr_dev(div1, "class", "content-wrap svelte-1pasrog");
    			add_location(div1, file$9, 97, 0, 2040);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let stage;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SignIn', slots, []);
    	let name = "";
    	let email = "";
    	let password = "";
    	var dispatch = createEventDispatcher();

    	function resetName(e) {
    		$$invalidate(1, name = e.detail.name);
    		$$invalidate(0, stage = e.detail.stage);
    		console.log("name reset:", name);
    	}

    	function resetEmail(e) {
    		$$invalidate(2, email = e.detail.email);
    		$$invalidate(0, stage = e.detail.stage);
    		console.log("email reset:", email);
    	}

    	function resetPassword(e) {
    		password = e.detail.password;
    		$$invalidate(0, stage = e.detail.stage);
    		console.log("password reset:", password);
    	}

    	function goBackHandler(e) {
    		$$invalidate(0, stage = e.detail.stage);
    		console.log("going back from password stage");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<SignIn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		SetName,
    		SetEmail,
    		SetPassword,
    		name,
    		email,
    		password,
    		dispatch,
    		resetName,
    		resetEmail,
    		resetPassword,
    		goBackHandler,
    		stage
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('password' in $$props) password = $$props.password;
    		if ('dispatch' in $$props) $$invalidate(8, dispatch = $$props.dispatch);
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*stage*/ 1) {
    			{
    				if (stage == 3) {
    					setTimeout(
    						() => {
    							dispatch('mode', { signIn: false });
    						},
    						5000
    					);
    				}
    			}
    		}
    	};

    	$$invalidate(0, stage = 0);
    	return [stage, name, email, resetName, resetEmail, resetPassword, goBackHandler];
    }

    class SignIn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SignIn",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintIn(t) {
        return t * t * t * t * t;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    /* src/Loading.svelte generated by Svelte v3.50.0 */
    const file$8 = "src/Loading.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/pizzaSpinner.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "60");
    			attr_dev(img, "width", "60");
    			attr_dev(img, "class", "pizza-spinner svelte-rykrrj");
    			add_location(img, file$8, 21, 4, 352);
    			attr_dev(div, "class", "pizza-spinner-wrap");
    			add_location(div, file$8, 20, 0, 315);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ scale });
    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Content_views/Home_views/Frame.svelte generated by Svelte v3.50.0 */
    const file$7 = "src/Content_views/Home_views/Frame.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (451:8) {#if visible}
    function create_if_block_5$1(ctx) {
    	let div;
    	let h3;
    	let t;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t = text(/*title*/ ctx[1]);
    			attr_dev(h3, "class", "title svelte-4tpnkt");
    			add_location(h3, file$7, 452, 16, 15880);
    			attr_dev(div, "class", "extended-title svelte-4tpnkt");
    			add_location(div, file$7, 451, 12, 15778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { duration: 300, x: 0, y: 0, opacity: 0 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { duration: 300, x: 0, y: 0, opacity: 0 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(451:8) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (576:4) {:else}
    function create_else_block$3(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*memes*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1$2(ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t0 = space();
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t1 = space();
    			a1 = element("a");
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/addWithOutBorder.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "30");
    			add_location(img0, file$7, 588, 16, 23025);
    			add_location(a0, file$7, 587, 12, 22978);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/more.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "30");
    			add_location(img1, file$7, 591, 16, 23131);
    			add_location(a1, file$7, 590, 12, 23111);
    			attr_dev(div0, "class", "add-meme-in-show-meme svelte-4tpnkt");
    			add_location(div0, file$7, 586, 8, 22930);
    			attr_dev(div1, "class", "show-memes svelte-4tpnkt");
    			add_location(div1, file$7, 576, 4, 22541);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(a1, img1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a0, "click", /*bubbleUpAddMode*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*memes*/ 4) {
    				each_value = /*memes*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1$2(ctx);
    					each_1_else.c();
    					each_1_else.m(div1, t0);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div1_transition) div1_transition = create_bidirectional_transition(
    						div1,
    						slide,
    						{
    							delay: 200,
    							duration: 400,
    							easing: quintOut
    						},
    						true
    					);

    					div1_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(
    					div1,
    					slide,
    					{
    						delay: 200,
    						duration: 400,
    						easing: quintOut
    					},
    					false
    				);

    				div1_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(576:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (460:4) {#if add_mode == false}
    function create_if_block$6(ctx) {
    	let div5;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let t4;
    	let div4;
    	let a;
    	let img1;
    	let img1_src_value;
    	let div5_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*first*/ ctx[11] && create_if_block_4$3(ctx);
    	let if_block1 = /*second*/ ctx[10] && create_if_block_3$3(ctx);
    	let if_block2 = /*third*/ ctx[9] && create_if_block_2$4(ctx);
    	let if_block3 = /*forth*/ ctx[8] && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div3 = element("div");
    			if (if_block3) if_block3.c();
    			t4 = space();
    			div4 = element("div");
    			a = element("a");
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/star.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "100%");
    			add_location(img0, file$7, 462, 12, 16290);
    			attr_dev(div0, "class", "first-meme svelte-4tpnkt");
    			add_location(div0, file$7, 461, 8, 16148);
    			attr_dev(div1, "class", "second-meme svelte-4tpnkt");
    			add_location(div1, file$7, 491, 8, 17843);
    			attr_dev(div2, "class", "third-meme svelte-4tpnkt");
    			add_location(div2, file$7, 517, 8, 19342);
    			attr_dev(div3, "class", "forth-meme svelte-4tpnkt");
    			add_location(div3, file$7, 543, 8, 20838);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/addWithOutBorder.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "40");
    			add_location(img1, file$7, 571, 16, 22425);
    			add_location(a, file$7, 570, 12, 22369);
    			attr_dev(div4, "class", "add-meme svelte-4tpnkt");
    			add_location(div4, file$7, 569, 8, 22334);
    			attr_dev(div5, "class", "memes svelte-4tpnkt");
    			add_location(div5, file$7, 460, 4, 16062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div5, t2);
    			append_dev(div5, div2);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, a);
    			append_dev(a, img1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler_1*/ ctx[16], false, false, false),
    					listen_dev(div1, "click", /*click_handler_2*/ ctx[17], false, false, false),
    					listen_dev(div2, "click", /*click_handler_3*/ ctx[18], false, false, false),
    					listen_dev(div3, "click", /*click_handler_4*/ ctx[19], false, false, false),
    					listen_dev(a, "click", /*click_handler_5*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*first*/ ctx[11]) {
    				if (if_block0) {
    					if (dirty & /*first*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*second*/ ctx[10]) {
    				if (if_block1) {
    					if (dirty & /*second*/ 1024) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*third*/ ctx[9]) {
    				if (if_block2) {
    					if (dirty & /*third*/ 512) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2$4(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*forth*/ ctx[8]) {
    				if (if_block3) {
    					if (dirty & /*forth*/ 256) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_1$6(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);

    			if (local) {
    				add_render_callback(() => {
    					if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fade, { duration: 200, easing: quintOut }, true);
    					div5_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);

    			if (local) {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fade, { duration: 200, easing: quintOut }, false);
    				div5_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching && div5_transition) div5_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(460:4) {#if add_mode == false}",
    		ctx
    	});

    	return block;
    }

    // (582:8) {:else}
    function create_else_block_1$2(ctx) {
    	let div;
    	let h3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Add a first meme!";
    			add_location(h3, file$7, 583, 16, 22860);
    			attr_dev(div, "class", "no-meme-placeholder");
    			add_location(div, file$7, 582, 12, 22810);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(582:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (578:8) {#each memes as meme}
    function create_each_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/star.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "100%");
    			add_location(img, file$7, 579, 16, 22716);
    			attr_dev(div, "class", "rest-meme svelte-4tpnkt");
    			add_location(div, file$7, 578, 12, 22676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(578:8) {#each memes as meme}",
    		ctx
    	});

    	return block;
    }

    // (464:12) {#if first}
    function create_if_block_4$3(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let a;
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			a = element("a");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Dm.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "30");
    			add_location(img, file$7, 465, 20, 16450);
    			attr_dev(path0, "d", "M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87\n-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156\n111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227\n-396 351 -671 292z");
    			add_location(path0, file$7, 473, 32, 16856);
    			attr_dev(path1, "d", "M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200\n-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242\n230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110\n-426 77z");
    			add_location(path1, file$7, 477, 32, 17133);
    			attr_dev(path2, "d", "M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110\n-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520\n-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19\n151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z");
    			add_location(path2, file$7, 481, 32, 17395);
    			attr_dev(g, "transform", "translate(0.000000,792.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#f5f5f5");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file$7, 471, 28, 16722);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "viewBox", "0 0 792.000000 792.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file$7, 467, 24, 16541);
    			add_location(a, file$7, 466, 20, 16513);
    			attr_dev(div, "class", "meme svelte-4tpnkt");
    			add_location(div, file$7, 464, 16, 16377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    			append_dev(div, a);
    			append_dev(a, svg);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(464:12) {#if first}",
    		ctx
    	});

    	return block;
    }

    // (493:12) {#if second}
    function create_if_block_3$3(ctx) {
    	let div;
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87\n-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156\n111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227\n-396 351 -671 292z");
    			add_location(path0, file$7, 500, 28, 18396);
    			attr_dev(path1, "d", "M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200\n-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242\n230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110\n-426 77z");
    			add_location(path1, file$7, 504, 28, 18669);
    			attr_dev(path2, "d", "M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110\n-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520\n-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19\n151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z");
    			add_location(path2, file$7, 508, 28, 18927);
    			attr_dev(g, "transform", "translate(0.000000,792.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#f5f5f5");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file$7, 498, 24, 18266);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "viewBox", "0 0 792.000000 792.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file$7, 494, 20, 18089);
    			attr_dev(div, "class", "meme svelte-4tpnkt");
    			add_location(div, file$7, 493, 16, 18016);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(493:12) {#if second}",
    		ctx
    	});

    	return block;
    }

    // (519:12) {#if third}
    function create_if_block_2$4(ctx) {
    	let div;
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87\n-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156\n111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227\n-396 351 -671 292z");
    			add_location(path0, file$7, 526, 28, 19892);
    			attr_dev(path1, "d", "M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200\n-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242\n230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110\n-426 77z");
    			add_location(path1, file$7, 530, 28, 20165);
    			attr_dev(path2, "d", "M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110\n-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520\n-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19\n151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z");
    			add_location(path2, file$7, 534, 28, 20423);
    			attr_dev(g, "transform", "translate(0.000000,792.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#f5f5f5");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file$7, 524, 24, 19762);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "viewBox", "0 0 792.000000 792.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file$7, 520, 20, 19585);
    			attr_dev(div, "class", "meme svelte-4tpnkt");
    			add_location(div, file$7, 519, 16, 19512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(519:12) {#if third}",
    		ctx
    	});

    	return block;
    }

    // (545:12) {#if forth}
    function create_if_block_1$6(ctx) {
    	let div;
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87\n-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156\n111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227\n-396 351 -671 292z");
    			add_location(path0, file$7, 552, 28, 21388);
    			attr_dev(path1, "d", "M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200\n-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242\n230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110\n-426 77z");
    			add_location(path1, file$7, 556, 28, 21661);
    			attr_dev(path2, "d", "M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110\n-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520\n-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19\n151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z");
    			add_location(path2, file$7, 560, 28, 21919);
    			attr_dev(g, "transform", "translate(0.000000,792.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#f5f5f5");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file$7, 550, 24, 21258);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "viewBox", "0 0 792.000000 792.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file$7, 546, 20, 21081);
    			attr_dev(div, "class", "meme svelte-4tpnkt");
    			add_location(div, file$7, 545, 16, 21008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(545:12) {#if forth}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div10;
    	let div8;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let div7;
    	let div5;
    	let div3;
    	let div2;
    	let t2;
    	let t3;
    	let div4;
    	let t4;
    	let t5;
    	let div6;
    	let svg;
    	let g;
    	let path;
    	let t6;
    	let t7;
    	let div9;
    	let img;
    	let img_src_value;
    	let t8;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*visible*/ ctx[6] && create_if_block_5$1(ctx);
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*add_mode*/ ctx[7] == false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*blogger*/ ctx[0]);
    			t1 = space();
    			div7 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			t2 = text(/*title*/ ctx[1]);
    			t3 = space();
    			div4 = element("div");
    			t4 = text(/*date*/ ctx[4]);
    			t5 = space();
    			div6 = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			div9 = element("div");
    			img = element("img");
    			t8 = space();
    			if_block1.c();
    			attr_dev(div0, "class", "blogger-default blogger svelte-4tpnkt");
    			add_location(div0, file$7, 306, 10, 5993);
    			attr_dev(div1, "class", "bloggers svelte-4tpnkt");
    			add_location(div1, file$7, 305, 8, 5960);
    			attr_dev(div2, "class", "title-container-long svelte-4tpnkt");
    			add_location(div2, file$7, 313, 20, 6313);
    			attr_dev(div3, "class", "title-wrap svelte-4tpnkt");
    			add_location(div3, file$7, 312, 16, 6191);
    			attr_dev(div4, "class", "date-wrap svelte-4tpnkt");
    			add_location(div4, file$7, 317, 16, 6464);
    			attr_dev(div5, "class", "title-date-wrap svelte-4tpnkt");
    			add_location(div5, file$7, 311, 12, 6145);
    			attr_dev(path, "d", "M7210 15188 c-167 -19 -310 -145 -397 -352 -100 -236 -218 -746 -238\n-1031 -4 -44 -10 -84 -15 -89 -6 -6 -94 31 -227 96 -469 228 -647 289 -853\n290 -107 1 -123 -1 -224 -36 -60 -20 -139 -41 -175 -46 -107 -17 -210 -49\n-306 -95 -136 -65 -135 -62 -141 -246 -6 -173 3 -254 55 -459 40 -154 85 -284\n163 -463 43 -98 58 -141 50 -149 -6 -6 -104 -14 -249 -19 -131 -4 -265 -10\n-298 -13 -33 -4 -134 -13 -225 -22 -209 -20 -259 -31 -455 -104 -88 -32 -322\n-117 -520 -189 -731 -263 -937 -348 -1375 -567 -658 -329 -885 -488 -983 -689\n-58 -117 -68 -152 -71 -245 -3 -73 -8 -95 -39 -160 -69 -146 -123 -386 -221\n-980 -173 -1047 -211 -1340 -266 -2020 -11 -135 -31 -380 -45 -545 -13 -165\n-31 -406 -40 -535 -8 -129 -17 -266 -20 -305 -14 -206 -20 -724 -20 -1615 1\n-1049 7 -1241 46 -1449 49 -255 152 -477 286 -617 92 -96 129 -104 179 -39 14\n19 31 35 38 35 11 0 106 -177 106 -198 0 -6 -13 -38 -29 -72 -37 -77 -46 -142\n-31 -217 46 -226 252 -353 660 -407 163 -22 581 -71 810 -96 431 -46 772 -92\n1175 -156 685 -110 684 -110 945 -138 146 -17 364 -36 755 -67 244 -19 720\n-59 1180 -99 127 -11 345 -29 485 -40 140 -11 302 -24 360 -30 58 -6 195 -19\n305 -30 177 -17 404 -41 665 -71 479 -53 940 -59 1877 -23 l153 6 47 -42 c128\n-113 206 -134 653 -182 192 -20 781 -17 936 5 245 34 411 93 544 193 53 39 84\n53 168 76 151 41 226 82 707 385 260 163 575 343 1415 806 80 44 195 108 256\n143 61 35 117 64 124 64 8 0 39 -17 70 -39 69 -48 116 -63 194 -64 201 -2 360\n203 380 489 3 43 8 504 12 1024 3 520 10 1157 14 1415 4 259 8 916 9 1460 1\n992 7 1299 36 1775 24 392 32 618 34 940 1 165 10 422 21 585 26 376 25 583\n-1 881 -24 267 -28 234 39 354 136 244 41 525 -220 653 -140 68 -338 112 -688\n152 -80 9 -242 32 -361 50 -319 50 -613 87 -979 124 -128 13 -416 34 -850 61\n-179 11 -377 25 -440 30 -488 43 -1449 112 -1880 135 -128 7 -160 13 -160 29\n0 6 44 99 98 206 183 365 308 731 357 1045 25 156 17 373 -18 506 -85 327\n-301 555 -597 634 -98 25 -294 31 -410 11 -380 -66 -784 -334 -1150 -761 -52\n-60 -101 -110 -109 -110 -10 0 -29 45 -61 140 -56 167 -83 232 -162 389 -177\n352 -422 634 -616 706 -72 27 -160 37 -242 28z m823 -1035 c36 -41 20 -92 -40\n-133 -67 -45 -262 -264 -283 -317 -5 -12 -21 -41 -37 -65 -15 -24 -38 -65 -51\n-93 -31 -65 -74 -150 -89 -178 -11 -19 -10 -24 5 -37 52 -43 216 -275 224\n-316 4 -20 28 -32 28 -13 0 12 20 60 60 144 11 22 24 51 30 65 5 14 14 32 19\n40 5 8 22 40 36 70 38 76 92 148 124 164 14 7 39 10 56 6 51 -10 40 -64 -48\n-244 -41 -83 -89 -185 -107 -226 -18 -41 -36 -79 -40 -85 -4 -5 -13 -26 -19\n-46 -6 -20 -20 -53 -31 -74 -11 -22 -20 -45 -20 -53 0 -8 -7 -26 -15 -40 -17\n-33 -78 -215 -100 -300 -9 -34 -13 -77 -10 -95 3 -18 -1 -57 -8 -87 -10 -44\n-17 -56 -38 -64 -34 -11 -75 -1 -84 21 -30 74 -23 160 32 366 20 75 33 140 29\n144 -4 4 -36 8 -71 8 -134 2 -284 94 -313 191 -20 68 -15 174 13 271 24 80 52\n155 75 193 5 8 48 92 95 185 48 94 105 199 127 235 76 122 258 324 324 359 49\n25 106 27 127 4z m2321 -274 c19 -15 26 -30 26 -53 0 -49 -27 -67 -122 -82\n-65 -10 -107 -25 -193 -68 -221 -112 -440 -258 -584 -392 -143 -132 -131 -116\n-113 -149 21 -41 20 -279 -3 -385 -22 -104 -66 -194 -107 -220 -31 -20 -42\n-21 -199 -15 -171 6 -229 14 -254 35 -18 15 -18 15 -157 -170 -111 -149 -131\n-169 -167 -170 -51 0 -76 55 -51 112 41 91 225 328 439 568 110 122 443 456\n531 531 181 155 360 274 575 384 155 79 196 92 291 94 48 1 67 -4 88 -20z\nm-4608 -341 c11 -13 26 -36 35 -53 87 -161 138 -246 237 -390 65 -95 217 -300\n232 -315 3 -3 28 -32 55 -65 96 -115 130 -151 300 -320 179 -177 201 -197 325\n-305 41 -36 77 -68 80 -71 3 -3 50 -39 105 -81 118 -89 133 -104 141 -145 8\n-42 -22 -73 -72 -73 -62 0 -292 184 -622 499 -198 188 -309 312 -540 606 -73\n92 -255 377 -313 490 -33 64 -60 132 -65 160 -6 43 -4 51 16 67 30 24 62 23\n86 -4z m1036 -60 c54 -43 261 -339 302 -432 51 -116 55 -231 7 -231 -19 0 -43\n31 -135 175 -98 153 -158 240 -198 289 -72 87 -96 162 -62 195 19 19 64 21 86\n4z m-151 -674 c89 -26 216 -94 254 -136 36 -39 47 -89 23 -104 -31 -19 -103\n-5 -192 39 -51 25 -120 51 -156 57 -86 16 -106 25 -125 53 -19 30 -5 79 28 95\n33 16 106 14 168 -4z m-1348 -417 c12 -13 71 -78 130 -145 136 -152 211 -222\n357 -331 205 -155 350 -238 575 -331 135 -55 145 -63 145 -105 0 -48 -29 -75\n-80 -75 -22 0 -48 4 -58 9 -9 5 -46 21 -82 37 -219 92 -386 187 -572 325 -213\n158 -528 496 -528 567 0 67 68 96 113 49z m4442 -478 c143 -4 310 -13 370 -19\n99 -10 493 -52 605 -65 25 -3 119 -12 210 -20 618 -57 742 -72 1160 -137 249\n-39 434 -64 635 -88 551 -64 618 -74 745 -115 58 -18 146 -45 195 -60 225 -66\n302 -107 328 -175 23 -57 7 -93 -64 -141 -34 -23 -70 -50 -81 -61 -30 -30\n-167 -122 -223 -150 -77 -39 -231 -86 -331 -102 -102 -16 -107 -16 -389 49\n-544 124 -748 167 -810 171 -38 2 -180 11 -315 20 -269 16 -533 44 -710 74\n-216 36 -589 81 -1165 140 -165 17 -365 37 -445 46 -236 24 -498 44 -600 44\n-246 0 -384 107 -385 295 0 154 110 268 285 294 79 11 627 11 985 0z m-5075\n-49 c293 -18 487 -38 738 -75 145 -21 229 -72 280 -169 22 -42 27 -65 27 -126\n0 -65 -4 -82 -30 -128 -76 -138 -200 -176 -490 -153 -248 21 -1781 43 -2060\n30 -131 -5 -183 12 -267 89 -92 85 -116 156 -86 255 17 55 106 150 173 182 92\n46 301 73 590 76 99 2 257 8 350 15 213 14 585 16 775 4z m3563 -136 c103 -35\n174 -135 198 -281 16 -96 0 -171 -52 -250 -64 -97 -271 -300 -422 -414 -204\n-153 -251 -183 -367 -232 -85 -36 -113 -44 -150 -40 -109 10 -344 46 -449 69\n-222 48 -237 74 -126 224 65 87 164 189 320 328 72 64 132 119 135 122 62 66\n412 322 540 395 130 74 185 94 261 95 36 0 86 -7 112 -16z m6974 -412 c84 -43\n140 -128 150 -227 10 -98 -61 -222 -161 -280 -23 -13 -90 -45 -151 -71 -147\n-62 -153 -65 -434 -198 -134 -64 -245 -116 -248 -116 -10 0 -347 -173 -423\n-217 -47 -28 -150 -88 -230 -135 -606 -354 -807 -467 -1042 -584 -103 -52\n-189 -98 -193 -103 -3 -5 -1 -21 5 -36 34 -89 29 -267 -14 -585 -28 -202 -33\n-270 -42 -550 -3 -113 -7 -225 -9 -250 -2 -25 -6 -153 -10 -285 -3 -132 -12\n-460 -20 -730 -11 -361 -12 -589 -6 -865 5 -206 7 -463 5 -570 -15 -885 -23\n-1182 -44 -1535 -45 -762 -49 -1026 -25 -1540 33 -693 16 -851 -100 -971 -68\n-69 -139 -93 -222 -74 -68 15 -130 62 -161 122 -25 48 -28 75 -46 368 -3 47\n-14 207 -26 355 -11 149 -24 335 -29 415 -11 174 -6 859 8 1090 44 709 60\n1556 49 2490 -3 250 -2 529 2 620 4 91 11 298 14 460 4 162 11 399 16 525 6\n127 14 349 20 495 10 272 16 343 49 560 11 69 22 168 26 220 9 137 22 196 63\n273 57 107 74 101 -314 108 -562 11 -1050 57 -1442 135 -325 64 -444 153 -430\n320 6 72 44 126 114 160 49 24 65 26 158 26 58 -1 187 -8 288 -16 605 -51 822\n-60 1368 -58 479 1 521 -2 599 -44 24 -13 49 -24 57 -24 27 0 398 210 1049\n593 331 195 460 265 705 377 69 32 168 78 220 103 52 25 149 70 215 102 251\n118 390 171 470 177 59 4 127 -8 172 -30z m-13647 -657 c63 -3 180 -10 260\n-16 80 -5 435 -14 790 -19 355 -5 715 -13 800 -19 85 -6 272 -18 415 -26 143\n-9 361 -24 485 -35 124 -10 284 -22 355 -25 251 -11 564 -30 700 -40 238 -19\n576 -47 770 -64 434 -38 919 -67 1275 -76 118 -4 292 -13 385 -21 196 -16 419\n-18 520 -4 39 6 178 14 310 20 132 5 297 14 368 21 160 16 217 6 297 -50 76\n-53 105 -111 105 -206 -1 -81 -21 -128 -82 -188 -100 -101 -242 -134 -638\n-149 -437 -16 -786 -17 -980 -3 -99 8 -279 14 -400 13 l-220 0 70 -22 c39 -13\n88 -34 110 -48 51 -32 121 -108 165 -178 18 -30 49 -72 68 -94 66 -75 76 -112\n81 -301 9 -376 6 -444 -30 -785 -27 -254 -85 -721 -113 -901 -84 -556 -167\n-1518 -190 -2210 -16 -467 -13 -2071 4 -2339 23 -361 43 -587 71 -815 21 -166\n23 -318 4 -381 -30 -108 -85 -172 -190 -226 -33 -16 -73 -40 -90 -53 -75 -56\n-170 -89 -304 -106 -251 -31 -389 -11 -551 81 -47 27 -104 51 -127 55 -94 15\n-195 106 -223 203 -6 20 -15 111 -20 202 -5 91 -15 248 -22 350 -7 121 -11\n422 -10 865 2 595 6 728 27 1065 14 212 32 457 40 545 9 88 20 210 26 270 5\n61 18 187 29 280 23 199 37 403 45 640 16 464 61 893 159 1535 25 162 52 342\n61 400 100 699 183 1081 310 1430 9 25 43 100 75 168 49 102 70 134 122 186\n113 111 212 163 333 174 88 7 55 16 -97 26 -505 31 -630 39 -813 57 -547 51\n-840 76 -1050 89 -526 30 -702 43 -920 65 -216 22 -421 38 -840 65 -169 11\n-545 27 -825 35 -113 3 -227 8 -255 10 -27 3 -113 10 -190 16 -404 31 -713 91\n-825 160 -112 69 -140 205 -61 300 52 62 138 90 256 83 33 -2 112 -6 175 -9z\nm12884 -502 c107 -39 186 -147 205 -284 10 -76 -3 -622 -18 -724 -5 -38 -13\n-144 -16 -235 -3 -91 -11 -253 -16 -360 -5 -107 -14 -280 -19 -385 -5 -104\n-11 -293 -15 -420 -8 -343 -18 -550 -37 -790 -7 -87 -10 -379 -9 -765 2 -722\n-2 -776 -94 -1455 -57 -424 -80 -607 -95 -765 -5 -58 -18 -195 -29 -305 -25\n-250 -38 -455 -46 -705 -18 -597 -46 -744 -162 -850 -67 -61 -138 -86 -220\n-76 -75 9 -126 37 -206 115 -78 75 -111 126 -126 192 -11 47 -19 968 -9 985 3\n5 9 90 13 189 3 98 8 182 10 185 2 3 6 116 10 250 6 248 28 601 45 720 13 94\n21 710 25 1888 2 568 6 1036 9 1041 3 4 6 91 6 194 1 102 8 275 15 384 8 109\n16 236 19 283 3 47 12 180 20 295 8 116 20 300 26 410 29 537 35 595 71 690\n11 29 38 71 61 95 42 42 126 90 160 90 10 0 61 24 115 53 54 30 112 59 128 65\n46 16 125 14 179 -5z");
    			add_location(path, file$7, 328, 24, 6910);
    			attr_dev(g, "transform", "translate(0.000000,1584.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#59545f");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file$7, 326, 20, 6783);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "27");
    			attr_dev(svg, "height", "27");
    			attr_dev(svg, "viewBox", "0 0 1584.000000 1584.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file$7, 322, 16, 6608);
    			attr_dev(div6, "class", "dm-wrap svelte-4tpnkt");
    			add_location(div6, file$7, 321, 12, 6570);
    			attr_dev(div7, "class", "title-date-dm-container svelte-4tpnkt");
    			add_location(div7, file$7, 310, 8, 6095);
    			attr_dev(div8, "class", "blog-header svelte-4tpnkt");
    			add_location(div8, file$7, 304, 4, 5926);
    			if (!src_url_equal(img.src, img_src_value = /*blog*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "sample svelte-4tpnkt");
    			add_location(img, file$7, 457, 8, 15986);
    			attr_dev(div9, "class", "blog svelte-4tpnkt");
    			add_location(div9, file$7, 456, 4, 15959);
    			attr_dev(div10, "class", "home-container svelte-4tpnkt");
    			add_location(div10, file$7, 303, 0, 5893);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div8);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div8, t1);
    			append_dev(div8, div7);
    			append_dev(div7, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div2, t2);
    			/*div2_binding*/ ctx[14](div2);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, t4);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, svg);
    			append_dev(svg, g);
    			append_dev(g, path);
    			append_dev(div8, t6);
    			if (if_block0) if_block0.m(div8, null);
    			append_dev(div10, t7);
    			append_dev(div10, div9);
    			append_dev(div9, img);
    			append_dev(div10, t8);
    			if_blocks[current_block_type_index].m(div10, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", /*click_handler*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*blogger*/ 1) set_data_dev(t0, /*blogger*/ ctx[0]);
    			if (!current || dirty & /*title*/ 2) set_data_dev(t2, /*title*/ ctx[1]);
    			if (!current || dirty & /*date*/ 16) set_data_dev(t4, /*date*/ ctx[4]);

    			if (/*visible*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*visible*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div8, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*blog*/ 8 && !src_url_equal(img.src, img_src_value = /*blog*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div10, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			/*div2_binding*/ ctx[14](null);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let first;
    	let second;
    	let third;
    	let forth;
    	let add_mode;
    	let visible;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Frame', slots, []);
    	let { blogger = "Jae" } = $$props;
    	let { title = "mocking jae mocking jay" } = $$props;
    	let { memes = [1, 2, 3, 4] } = $$props;
    	let { blog = "/icons/svgs/Global_panel.svg" } = $$props;
    	let { date = "2022.12.12" } = $$props;
    	let { meme_id = 1 } = $$props;
    	let TITLE;
    	let EXTENDEDTITLE;
    	var dispatch = createEventDispatcher();

    	onMount(() => {
    		if (title.length >= 30) {
    			$$invalidate(5, TITLE.innerHTML = title.slice(0, 30) + '...', TITLE);
    		} else {
    			$$invalidate(5, TITLE.innerHTML = title, TITLE);
    		}
    	});

    	function bubbleUpAddMode() {
    		dispatch('add-meme', { meme_id, add_mode: true });
    	}

    	const writable_props = ['blogger', 'title', 'memes', 'blog', 'date', 'meme_id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Frame> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			TITLE = $$value;
    			$$invalidate(5, TITLE);
    		});
    	}

    	const click_handler = () => {
    		$$invalidate(6, visible = true);

    		setTimeout(
    			() => {
    				$$invalidate(6, visible = false);
    			},
    			8000
    		);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(11, first = true);
    		$$invalidate(10, second = $$invalidate(9, third = $$invalidate(8, forth = false)));

    		setTimeout(
    			() => {
    				$$invalidate(11, first = false);
    			},
    			2000
    		);
    	};

    	const click_handler_2 = () => {
    		$$invalidate(10, second = true);
    		$$invalidate(11, first = $$invalidate(9, third = $$invalidate(8, forth = false)));

    		setTimeout(
    			() => {
    				$$invalidate(10, second = false);
    			},
    			2000
    		);
    	};

    	const click_handler_3 = () => {
    		$$invalidate(9, third = true);
    		$$invalidate(10, second = $$invalidate(11, first = $$invalidate(8, forth = false)));

    		setTimeout(
    			() => {
    				$$invalidate(9, third = false);
    			},
    			2000
    		);
    	};

    	const click_handler_4 = () => {
    		$$invalidate(8, forth = true);
    		$$invalidate(10, second = $$invalidate(9, third = $$invalidate(11, first = false)));

    		setTimeout(
    			() => {
    				$$invalidate(8, forth = false);
    			},
    			2000
    		);
    	};

    	const click_handler_5 = () => {
    		$$invalidate(7, add_mode = true);
    	};

    	$$self.$$set = $$props => {
    		if ('blogger' in $$props) $$invalidate(0, blogger = $$props.blogger);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('memes' in $$props) $$invalidate(2, memes = $$props.memes);
    		if ('blog' in $$props) $$invalidate(3, blog = $$props.blog);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    		if ('meme_id' in $$props) $$invalidate(13, meme_id = $$props.meme_id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		fly,
    		slide,
    		scale,
    		quintOut,
    		createEventDispatcher,
    		blogger,
    		title,
    		memes,
    		blog,
    		date,
    		meme_id,
    		TITLE,
    		EXTENDEDTITLE,
    		dispatch,
    		bubbleUpAddMode,
    		visible,
    		add_mode,
    		forth,
    		third,
    		second,
    		first
    	});

    	$$self.$inject_state = $$props => {
    		if ('blogger' in $$props) $$invalidate(0, blogger = $$props.blogger);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('memes' in $$props) $$invalidate(2, memes = $$props.memes);
    		if ('blog' in $$props) $$invalidate(3, blog = $$props.blog);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    		if ('meme_id' in $$props) $$invalidate(13, meme_id = $$props.meme_id);
    		if ('TITLE' in $$props) $$invalidate(5, TITLE = $$props.TITLE);
    		if ('EXTENDEDTITLE' in $$props) EXTENDEDTITLE = $$props.EXTENDEDTITLE;
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('visible' in $$props) $$invalidate(6, visible = $$props.visible);
    		if ('add_mode' in $$props) $$invalidate(7, add_mode = $$props.add_mode);
    		if ('forth' in $$props) $$invalidate(8, forth = $$props.forth);
    		if ('third' in $$props) $$invalidate(9, third = $$props.third);
    		if ('second' in $$props) $$invalidate(10, second = $$props.second);
    		if ('first' in $$props) $$invalidate(11, first = $$props.first);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(11, first = false);
    	$$invalidate(10, second = false);
    	$$invalidate(9, third = false);
    	$$invalidate(8, forth = false);
    	$$invalidate(7, add_mode = false);
    	$$invalidate(6, visible = false);

    	return [
    		blogger,
    		title,
    		memes,
    		blog,
    		date,
    		TITLE,
    		visible,
    		add_mode,
    		forth,
    		third,
    		second,
    		first,
    		bubbleUpAddMode,
    		meme_id,
    		div2_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Frame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			blogger: 0,
    			title: 1,
    			memes: 2,
    			blog: 3,
    			date: 4,
    			meme_id: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Frame",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get blogger() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blogger(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get memes() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set memes(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blog() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blog(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meme_id() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meme_id(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Content_views/Home_views/Home.svelte generated by Svelte v3.50.0 */
    const file$6 = "src/Content_views/Home_views/Home.svelte";

    // (205:22) 
    function create_if_block_1$5(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/pizzaSpinner.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "25");
    			attr_dev(img, "width", "25");
    			attr_dev(img, "class", "pizza-spinner-refresh svelte-7ulvb7");
    			add_location(img, file$6, 207, 16, 5321);
    			attr_dev(div0, "class", "refresher-inner-wrap svelte-7ulvb7");
    			add_location(div0, file$6, 206, 12, 5270);
    			attr_dev(div1, "class", "refresher svelte-7ulvb7");
    			add_location(div1, file$6, 205, 8, 5171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div1_transition) div1_transition = create_bidirectional_transition(div1, scale, { duration: 300, opacity: 0, start: 0 }, true);
    					div1_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, scale, { duration: 300, opacity: 0, start: 0 }, false);
    				div1_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(205:22) ",
    		ctx
    	});

    	return block;
    }

    // (199:4) {#if !refresh}
    function create_if_block$5(ctx) {
    	let div1;
    	let div0;
    	let h41;
    	let t;
    	let h40;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h41 = element("h4");
    			t = text("Pull to load more");
    			h40 = element("h4");
    			add_location(h40, file$6, 201, 55, 5101);
    			attr_dev(h41, "class", "pull-line svelte-7ulvb7");
    			add_location(h41, file$6, 201, 16, 5062);
    			attr_dev(div0, "class", "pull-wrap svelte-7ulvb7");
    			add_location(div0, file$6, 200, 12, 5022);
    			attr_dev(div1, "class", "pull-container svelte-7ulvb7");
    			add_location(div1, file$6, 199, 8, 4918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h41);
    			append_dev(h41, t);
    			append_dev(h41, h40);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div1_transition) div1_transition = create_bidirectional_transition(div1, scale, { duration: 400, opacity: 0, start: 0 }, true);
    					div1_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, scale, { duration: 400, opacity: 0, start: 0 }, false);
    				div1_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(199:4) {#if !refresh}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div4;
    	let frame0;
    	let t0;
    	let frame1;
    	let t1;
    	let frame2;
    	let t2;
    	let frame3;
    	let t3;
    	let frame4;
    	let t4;
    	let div1;
    	let div0;
    	let h41;
    	let t5;
    	let h40;
    	let t6;
    	let frame5;
    	let t7;
    	let frame6;
    	let t8;
    	let div3;
    	let div2;
    	let h43;
    	let t9;
    	let h42;
    	let t10;
    	let frame7;
    	let t11;
    	let frame8;
    	let t12;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	frame0 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame0.$on("add-meme", /*addMemeHandler*/ ctx[8]);

    	frame1 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame2 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame3 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame4 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame5 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame6 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame7 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	frame8 = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[2],
    				title: /*title*/ ctx[3],
    				date: /*date*/ ctx[6],
    				memes: /*memes*/ ctx[4],
    				blog: /*blog*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$5, create_if_block_1$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*refresh*/ ctx[0]) return 0;
    		if (/*refresh*/ ctx[0]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(frame0.$$.fragment);
    			t0 = space();
    			create_component(frame1.$$.fragment);
    			t1 = space();
    			create_component(frame2.$$.fragment);
    			t2 = space();
    			create_component(frame3.$$.fragment);
    			t3 = space();
    			create_component(frame4.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h41 = element("h4");
    			t5 = text("June 3 2020");
    			h40 = element("h4");
    			t6 = space();
    			create_component(frame5.$$.fragment);
    			t7 = space();
    			create_component(frame6.$$.fragment);
    			t8 = space();
    			div3 = element("div");
    			div2 = element("div");
    			h43 = element("h4");
    			t9 = text("June. 4. 2020");
    			h42 = element("h4");
    			t10 = space();
    			create_component(frame7.$$.fragment);
    			t11 = space();
    			create_component(frame8.$$.fragment);
    			t12 = space();
    			if (if_block) if_block.c();
    			add_location(h40, file$6, 180, 46, 4356);
    			attr_dev(h41, "class", "date-line svelte-7ulvb7");
    			add_location(h41, file$6, 180, 12, 4322);
    			attr_dev(div0, "class", "date-line-wrap svelte-7ulvb7");
    			add_location(div0, file$6, 179, 8, 4281);
    			attr_dev(div1, "class", "date-line-container svelte-7ulvb7");
    			add_location(div1, file$6, 178, 4, 4239);
    			add_location(h42, file$6, 190, 48, 4685);
    			attr_dev(h43, "class", "date-line svelte-7ulvb7");
    			add_location(h43, file$6, 190, 12, 4649);
    			attr_dev(div2, "class", "date-line-wrap svelte-7ulvb7");
    			add_location(div2, file$6, 189, 8, 4608);
    			attr_dev(div3, "class", "date-line-container svelte-7ulvb7");
    			add_location(div3, file$6, 188, 4, 4566);
    			attr_dev(div4, "class", "home-wrap svelte-7ulvb7");
    			add_location(div4, file$6, 171, 0, 3687);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(frame0, div4, null);
    			append_dev(div4, t0);
    			mount_component(frame1, div4, null);
    			append_dev(div4, t1);
    			mount_component(frame2, div4, null);
    			append_dev(div4, t2);
    			mount_component(frame3, div4, null);
    			append_dev(div4, t3);
    			mount_component(frame4, div4, null);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h41);
    			append_dev(h41, t5);
    			append_dev(h41, h40);
    			append_dev(div4, t6);
    			mount_component(frame5, div4, null);
    			append_dev(div4, t7);
    			mount_component(frame6, div4, null);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h43);
    			append_dev(h43, t9);
    			append_dev(h43, h42);
    			append_dev(div4, t10);
    			mount_component(frame7, div4, null);
    			append_dev(div4, t11);
    			mount_component(frame8, div4, null);
    			append_dev(div4, t12);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div4, null);
    			}

    			/*div4_binding*/ ctx[13](div4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div4, "wheel", /*updateHandler*/ ctx[7], false, false, false),
    					listen_dev(div4, "touchmove", /*updateHandler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div4, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(frame0.$$.fragment, local);
    			transition_in(frame1.$$.fragment, local);
    			transition_in(frame2.$$.fragment, local);
    			transition_in(frame3.$$.fragment, local);
    			transition_in(frame4.$$.fragment, local);
    			transition_in(frame5.$$.fragment, local);
    			transition_in(frame6.$$.fragment, local);
    			transition_in(frame7.$$.fragment, local);
    			transition_in(frame8.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(frame0.$$.fragment, local);
    			transition_out(frame1.$$.fragment, local);
    			transition_out(frame2.$$.fragment, local);
    			transition_out(frame3.$$.fragment, local);
    			transition_out(frame4.$$.fragment, local);
    			transition_out(frame5.$$.fragment, local);
    			transition_out(frame6.$$.fragment, local);
    			transition_out(frame7.$$.fragment, local);
    			transition_out(frame8.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(frame0);
    			destroy_component(frame1);
    			destroy_component(frame2);
    			destroy_component(frame3);
    			destroy_component(frame4);
    			destroy_component(frame5);
    			destroy_component(frame6);
    			destroy_component(frame7);
    			destroy_component(frame8);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			/*div4_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let height_from_bottom;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let blogger = "jae";
    	let title = "When you went back home and saw mom and dad having sex";
    	let memes = [1, 2, 3, 4];
    	let blog = "/icons/svgs/Global_panel.svg";
    	let date = "4 hours ago";
    	let refresh = false;
    	let add_mode = false;
    	let add_mode_meme_id = null;
    	let HOME;
    	let height;
    	let status;

    	onMount(() => {
    		$$invalidate(11, height = HOME.offsetHeight);
    		$$invalidate(12, height_from_bottom = height - window.scrollY);
    	});

    	afterUpdate(() => {
    		$$invalidate(11, height = HOME.offsetHeight);
    	});

    	function updateHandler(e) {
    		if (HOME) {
    			$$invalidate(12, height_from_bottom = height - window.scrollY);
    		}
    	}

    	function addMemeHandler(e) {
    		$$invalidate(9, add_mode = e.detail.add_mode);
    		$$invalidate(10, add_mode_meme_id = e.detail.meme_id);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			HOME = $$value;
    			$$invalidate(1, HOME);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		scale,
    		fade,
    		Frame,
    		blogger,
    		title,
    		memes,
    		blog,
    		date,
    		refresh,
    		add_mode,
    		add_mode_meme_id,
    		HOME,
    		height,
    		status,
    		updateHandler,
    		addMemeHandler,
    		height_from_bottom
    	});

    	$$self.$inject_state = $$props => {
    		if ('blogger' in $$props) $$invalidate(2, blogger = $$props.blogger);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('memes' in $$props) $$invalidate(4, memes = $$props.memes);
    		if ('blog' in $$props) $$invalidate(5, blog = $$props.blog);
    		if ('date' in $$props) $$invalidate(6, date = $$props.date);
    		if ('refresh' in $$props) $$invalidate(0, refresh = $$props.refresh);
    		if ('add_mode' in $$props) $$invalidate(9, add_mode = $$props.add_mode);
    		if ('add_mode_meme_id' in $$props) $$invalidate(10, add_mode_meme_id = $$props.add_mode_meme_id);
    		if ('HOME' in $$props) $$invalidate(1, HOME = $$props.HOME);
    		if ('height' in $$props) $$invalidate(11, height = $$props.height);
    		if ('status' in $$props) status = $$props.status;
    		if ('height_from_bottom' in $$props) $$invalidate(12, height_from_bottom = $$props.height_from_bottom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*height_from_bottom, refresh, height*/ 6145) {
    			{
    				// loads more blogs
    				// fetches blogs from server then updates HOME
    				if (height_from_bottom <= 840 && !refresh) {
    					$$invalidate(0, refresh = true);
    					$$invalidate(12, height_from_bottom = 1000);

    					setTimeout(
    						() => {
    							window.scrollTo(0, height - 900);
    							$$invalidate(0, refresh = false);
    						},
    						3000
    					);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*add_mode, add_mode_meme_id*/ 1536) ;
    	};

    	$$invalidate(12, height_from_bottom = 10000);

    	return [
    		refresh,
    		HOME,
    		blogger,
    		title,
    		memes,
    		blog,
    		date,
    		updateHandler,
    		addMemeHandler,
    		add_mode,
    		add_mode_meme_id,
    		height,
    		height_from_bottom,
    		div4_binding
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/forms/PostComponents/SetTitle.svelte generated by Svelte v3.50.0 */

    const { console: console_1$4 } = globals;
    const file$5 = "src/forms/PostComponents/SetTitle.svelte";

    // (236:13) {:else}
    function create_else_block$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Too long for a meme...";
    			add_location(h2, file$5, 236, 16, 5166);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(236:13) {:else}",
    		ctx
    	});

    	return block;
    }

    // (234:13) {#if title_rule_result}
    function create_if_block_4$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Now it deserves a good title";
    			add_location(h2, file$5, 234, 16, 5089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(234:13) {#if title_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (250:12) {#if !title_rule_detail.is_short_enough}
    function create_if_block_3$2(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Too long! Make it shorter than 35 letters including whitespace.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$5, 252, 24, 5768);
    			attr_dev(div0, "class", "icon-wrap svelte-kj2q5i");
    			add_location(div0, file$5, 251, 20, 5719);
    			attr_dev(p, "class", "svelte-kj2q5i");
    			add_location(p, file$5, 254, 20, 5878);
    			attr_dev(div1, "class", "requirement-wrap svelte-kj2q5i");
    			add_location(div1, file$5, 250, 16, 5667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(250:12) {#if !title_rule_detail.is_short_enough}",
    		ctx
    	});

    	return block;
    }

    // (258:12) {#if title_rule_result}
    function create_if_block_2$3(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Good to go!";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$5, 260, 24, 6153);
    			attr_dev(div0, "class", "icon-wrap svelte-kj2q5i");
    			add_location(div0, file$5, 259, 20, 6104);
    			attr_dev(p, "class", "svelte-kj2q5i");
    			add_location(p, file$5, 262, 16, 6259);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-kj2q5i");
    			add_location(div1, file$5, 258, 16, 6046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(258:12) {#if title_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (272:8) {#if stage != 0}
    function create_if_block_1$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-kj2q5i");
    			add_location(button, file$5, 272, 12, 6476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goBack*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(272:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (277:8) {#if (stage == 1) && title_rule_result}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-kj2q5i");
    			add_location(button, file$5, 277, 8, 6651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*bubbleUpTitle*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(277:8) {#if (stage == 1) && title_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let input;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div3;
    	let t3;
    	let t4;
    	let div8;
    	let div6;
    	let t5;
    	let div7;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*title_rule_result*/ ctx[3]) return create_if_block_4$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*title_rule_detail*/ ctx[2].is_short_enough && create_if_block_3$2(ctx);
    	let if_block2 = /*title_rule_result*/ ctx[3] && create_if_block_2$3(ctx);
    	let if_block3 = /*stage*/ ctx[1] != 0 && create_if_block_1$4(ctx);
    	let if_block4 = /*stage*/ ctx[1] == 1 && /*title_rule_result*/ ctx[3] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div8 = element("div");
    			div6 = element("div");
    			if (if_block3) if_block3.c();
    			t5 = space();
    			div7 = element("div");
    			if (if_block4) if_block4.c();
    			attr_dev(div0, "class", "questionair-container svelte-kj2q5i");
    			add_location(div0, file$5, 232, 8, 4998);
    			attr_dev(input, "id", "title");
    			attr_dev(input, "name", "title");
    			attr_dev(input, "class", "title-field svelte-kj2q5i");
    			add_location(input, file$5, 242, 16, 5330);
    			attr_dev(div1, "class", "field-wrap svelte-kj2q5i");
    			add_location(div1, file$5, 241, 12, 5288);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$5, 245, 12, 5460);
    			attr_dev(div2, "class", "form-wrap svelte-kj2q5i");
    			add_location(div2, file$5, 240, 8, 5251);
    			attr_dev(div3, "class", "title-requirement-container svelte-kj2q5i");
    			add_location(div3, file$5, 248, 8, 5554);
    			attr_dev(div4, "class", "container svelte-kj2q5i");
    			add_location(div4, file$5, 231, 4, 4965);
    			attr_dev(div5, "class", "set-post-title-wrap svelte-kj2q5i");
    			add_location(div5, file$5, 230, 0, 4926);
    			attr_dev(div6, "class", "sub-navbar-left svelte-kj2q5i");
    			add_location(div6, file$5, 270, 4, 6407);
    			attr_dev(div7, "class", "sub-navbar-right svelte-kj2q5i");
    			add_location(div7, file$5, 275, 4, 6562);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-kj2q5i");
    			add_location(div8, file$5, 269, 0, 6372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			if_block0.m(div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*title*/ ctx[0]);
    			append_dev(div2, t1);
    			append_dev(div2, img);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t3);
    			if (if_block2) if_block2.m(div3, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			if (if_block3) if_block3.m(div6, null);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			if (if_block4) if_block4.m(div7, null);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*title*/ 1 && input.value !== /*title*/ ctx[0]) {
    				set_input_value(input, /*title*/ ctx[0]);
    			}

    			if (!/*title_rule_detail*/ ctx[2].is_short_enough) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*title_rule_result*/ ctx[3]) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_2$3(ctx);
    					if_block2.c();
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*stage*/ ctx[1] != 0) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$4(ctx);
    					if_block3.c();
    					if_block3.m(div6, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*stage*/ ctx[1] == 1 && /*title_rule_result*/ ctx[3]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$4(ctx);
    					if_block4.c();
    					if_block4.m(div7, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div8);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetTitle', slots, []);
    	let { stage = 0 } = $$props;
    	let { title } = $$props;
    	var dispatch = createEventDispatcher();

    	function bubbleUpTitle() {
    		console.log("bubble up title...");
    		$$invalidate(1, stage = 1);
    		dispatch('postTitle', { title, stage });
    	}

    	let title_rule_detail = { is_short_enough: true };
    	let title_rule_result = false;

    	function title_rule(title) {
    		let max_len = 40;
    		let title_len = title.length;
    		let detail = {};
    		detail.is_short_enough = title_len <= max_len;
    		$$invalidate(2, title_rule_detail = detail);
    		console.log(title);
    	}

    	function goBack() {
    		$$invalidate(1, stage -= 1);
    		dispatch('postTitle', { title, stage });
    	}

    	const writable_props = ['stage', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<SetTitle> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		title = this.value;
    		$$invalidate(0, title);
    	}

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		stage,
    		title,
    		createEventDispatcher,
    		dispatch,
    		bubbleUpTitle,
    		title_rule_detail,
    		title_rule_result,
    		title_rule,
    		goBack
    	});

    	$$self.$inject_state = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('title_rule_detail' in $$props) $$invalidate(2, title_rule_detail = $$props.title_rule_detail);
    		if ('title_rule_result' in $$props) $$invalidate(3, title_rule_result = $$props.title_rule_result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*title, title_rule_detail*/ 5) {
    			{
    				title_rule(title);
    				$$invalidate(3, title_rule_result = title_rule_detail.is_short_enough);
    			}
    		}
    	};

    	return [
    		title,
    		stage,
    		title_rule_detail,
    		title_rule_result,
    		bubbleUpTitle,
    		goBack,
    		input_input_handler
    	];
    }

    class SetTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { stage: 1, title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetTitle",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console_1$4.warn("<SetTitle> was created without expected prop 'title'");
    		}
    	}

    	get stage() {
    		throw new Error("<SetTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<SetTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SetTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SetTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/PostComponents/SetFile.svelte generated by Svelte v3.50.0 */

    const { console: console_1$3 } = globals;
    const file_1 = "src/forms/PostComponents/SetFile.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (523:0) {#if meme_house_open}
    function create_if_block_4$1(ctx) {
    	let div9;
    	let div5;
    	let div1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let svg;
    	let g;
    	let path;
    	let t1;
    	let div4;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let t3;
    	let div8;
    	let div6;
    	let h40;
    	let t4;
    	let h41;
    	let t5;
    	let div7;
    	let div9_intro;
    	let div9_outro;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*memes*/ ctx[5]) return create_if_block_8;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*memes*/ ctx[5] && /*meme_house_open*/ ctx[3]) return create_if_block_6;
    		return create_else_block_3;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*memes*/ ctx[5] && /*meme_house_open*/ ctx[3]) return create_if_block_5;
    		return create_else_block_2;
    	}

    	let current_block_type_2 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_2(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			img1 = element("img");
    			t2 = space();
    			if_block0.c();
    			t3 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h40 = element("h4");
    			if_block1.c();
    			t4 = space();
    			h41 = element("h4");
    			if_block2.c();
    			t5 = space();
    			div7 = element("div");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/arrowToLeft.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "30px");
    			add_location(img0, file_1, 527, 20, 11917);
    			attr_dev(div0, "class", "meme-nav-left svelte-nqo8nj");
    			add_location(div0, file_1, 526, 16, 11851);
    			attr_dev(div1, "class", "left-nav-wrap svelte-nqo8nj");
    			add_location(div1, file_1, 525, 12, 11807);
    			attr_dev(path, "d", "M7172 14295 c-72 -23 -165 -101 -482 -401 -36 -34 -83 -78 -105 -99\n-22 -20 -94 -89 -160 -153 -560 -540 -631 -609 -785 -752 -323 -300 -775 -686\n-1282 -1094 -65 -52 -173 -141 -323 -266 -585 -486 -1069 -878 -1340 -1086\n-427 -327 -709 -534 -1375 -1012 -236 -170 -399 -289 -440 -322 -25 -20 -106\n-83 -180 -141 -321 -248 -557 -472 -620 -589 -31 -59 -34 -73 -34 -145 0 -96\n20 -142 88 -202 85 -75 209 -121 546 -204 113 -27 234 -57 270 -65 36 -8 83\n-19 105 -24 22 -5 67 -15 100 -21 33 -6 94 -17 135 -26 114 -22 228 -43 300\n-54 36 -5 72 -11 80 -14 19 -6 180 -30 470 -70 58 -8 146 -21 195 -29 50 -8\n122 -19 160 -25 39 -6 88 -16 110 -21 l40 -11 1 -147 c1 -81 7 -160 13 -175\n14 -36 15 -374 1 -592 -10 -162 -23 -418 -40 -780 -5 -110 -14 -267 -19 -350\n-6 -82 -18 -274 -26 -425 -9 -151 -20 -342 -26 -425 -23 -353 -41 -1087 -35\n-1435 14 -885 61 -1164 223 -1328 59 -59 131 -97 219 -113 66 -13 354 -6 444\n11 110 20 469 30 740 20 146 -5 279 -12 297 -15 37 -7 324 -29 638 -51 238\n-16 703 -33 721 -27 12 4 12 11 33 1008 16 744 34 902 167 1480 130 564 182\n730 331 1045 102 216 328 572 420 662 80 79 348 267 458 321 158 79 176 82\n455 80 287 -3 351 -13 485 -78 138 -67 196 -125 347 -345 106 -155 205 -325\n238 -410 17 -44 44 -138 61 -208 16 -70 47 -199 69 -287 35 -144 52 -236 120\n-660 23 -144 64 -482 80 -655 14 -150 41 -316 74 -448 35 -138 52 -239 80\n-467 52 -414 79 -573 141 -825 18 -74 41 -172 50 -217 17 -80 19 -83 49 -87\n121 -19 2769 -23 3276 -5 415 14 528 73 605 316 38 120 45 250 55 1008 15\n1074 4 1541 -55 2450 -21 325 -43 806 -50 1105 -6 245 -30 873 -39 1031 l-5\n77 31 6 c17 3 117 11 222 16 105 5 263 14 351 20 88 5 279 17 425 25 1282 74\n1550 149 1528 423 -4 39 -13 65 -39 102 -63 90 -359 393 -654 670 -165 155\n-546 491 -708 623 -55 45 -119 98 -141 117 -23 19 -60 49 -82 66 -415 332\n-520 417 -620 500 -119 98 -325 274 -334 284 -3 3 -54 48 -115 100 -118 101\n-154 134 -250 220 -33 30 -101 91 -150 135 -49 44 -119 107 -155 140 -36 33\n-99 89 -140 125 -41 36 -99 88 -130 115 -30 28 -84 75 -120 105 -35 30 -85 73\n-110 95 -64 58 -238 205 -276 235 -64 50 -279 225 -284 231 -6 7 -295 222\n-365 271 -324 226 -670 445 -955 605 -56 32 -200 112 -260 145 -161 90 -498\n266 -820 431 -564 287 -747 391 -1186 673 -110 71 -209 134 -220 141 -79 50\n-214 117 -279 138 -86 28 -164 31 -233 10z");
    			add_location(path, file_1, 537, 24, 12387);
    			attr_dev(g, "transform", "translate(0.000000,1584.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#59545f");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file_1, 535, 20, 12260);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "30px");
    			attr_dev(svg, "height", "30px");
    			attr_dev(svg, "viewBox", "0 0 1584.000000 1584.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file_1, 531, 16, 12081);
    			attr_dev(div2, "class", "meme-house-icon-container svelte-nqo8nj");
    			add_location(div2, file_1, 530, 12, 12025);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/arrowToLeft.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "30px");
    			add_location(img1, file_1, 573, 20, 14843);
    			attr_dev(div3, "class", "meme-nav-right svelte-nqo8nj");
    			add_location(div3, file_1, 572, 16, 14775);
    			attr_dev(div4, "class", "right-nav-wrap svelte-nqo8nj");
    			add_location(div4, file_1, 571, 12, 14730);
    			attr_dev(div5, "class", "meme-house-nav-bar svelte-nqo8nj");
    			add_location(div5, file_1, 524, 8, 11762);
    			attr_dev(h40, "class", "meme-title svelte-nqo8nj");
    			add_location(h40, file_1, 637, 16, 18823);
    			attr_dev(div6, "class", "title-wrap svelte-nqo8nj");
    			add_location(div6, file_1, 636, 12, 18782);
    			attr_dev(h41, "class", "meme-crafter svelte-nqo8nj");
    			add_location(h41, file_1, 689, 12, 22262);
    			attr_dev(div7, "class", "requirement-wrap svelte-nqo8nj");
    			add_location(div7, file_1, 696, 12, 22516);
    			attr_dev(div8, "class", "meme-house-panel svelte-nqo8nj");
    			add_location(div8, file_1, 635, 8, 18739);
    			attr_dev(div9, "class", "meme-house-menu svelte-nqo8nj");
    			add_location(div9, file_1, 523, 4, 11636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div5);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div5, t0);
    			append_dev(div5, div2);
    			append_dev(div2, svg);
    			append_dev(svg, g);
    			append_dev(g, path);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, img1);
    			append_dev(div9, t2);
    			if_block0.m(div9, null);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h40);
    			if_block1.m(h40, null);
    			append_dev(div8, t4);
    			append_dev(div8, h41);
    			if_block2.m(h41, null);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*goBack*/ ctx[9], false, false, false),
    					listen_dev(div3, "click", /*goForth*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if_block0.p(ctx, dirty);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(h40, null);
    				}
    			}

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_2(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(h41, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div9_outro) div9_outro.end(1);
    				div9_intro = create_in_transition(div9, slide, { duration: 600, easing: quintOut });
    				div9_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div9_intro) div9_intro.invalidate();
    			div9_outro = create_out_transition(div9, slide, { duration: 600, easing: quintIn });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if_block0.d();
    			if_block1.d();
    			if_block2.d();
    			if (detaching && div9_outro) div9_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(523:0) {#if meme_house_open}",
    		ctx
    	});

    	return block;
    }

    // (632:8) {:else}
    function create_else_block_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "meme-container-no-meme");
    			add_location(div, file_1, 632, 12, 18661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(632:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (578:8) {#if memes}
    function create_if_block_8(ctx) {
    	let div;
    	let each_value = /*memes*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "meme-container svelte-nqo8nj");
    			add_location(div, file_1, 578, 12, 14986);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectMeme, memes, quintOut, meme_selected_index*/ 292) {
    				each_value = /*memes*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(578:8) {#if memes}",
    		ctx
    	});

    	return block;
    }

    // (583:24) {#if meme_selected_index == index}
    function create_if_block_9(ctx) {
    	let div;
    	let svg;
    	let g;
    	let path0;
    	let path0_transition;
    	let path1;
    	let path1_transition;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M8128 15401 c-90 -30 -160 -103 -173 -181 -19 -110 55 -220 167 -248\n24 -6 174 -13 333 -16 310 -6 454 -15 715 -47 1439 -173 2790 -790 3842 -1755\n53 -49 185 -170 294 -269 417 -378 608 -596 857 -976 342 -522 672 -1247 862\n-1894 146 -498 280 -1210 316 -1685 15 -204 6 -756 -15 -950 -94 -831 -314\n-1626 -681 -2455 -145 -327 -378 -750 -613 -1110 -351 -539 -870 -1104 -1409\n-1536 -311 -249 -780 -582 -1038 -736 -590 -354 -1247 -608 -2039 -788 -409\n-92 -598 -117 -1016 -135 -739 -30 -1299 11 -2005 146 -609 118 -1231 335\n-1800 628 -797 412 -1374 877 -2031 1636 -918 1062 -1474 2309 -1648 3700 -44\n348 -51 462 -51 810 1 333 8 479 46 850 69 685 220 1277 511 2000 351 871 800\n1589 1405 2245 169 184 493 498 658 640 684 588 1403 992 2393 1346 464 166\n1208 350 1637 404 105 13 202 28 216 34 14 5 38 24 53 42 38 45 33 110 -12\n150 -44 40 -92 43 -334 25 -445 -34 -787 -80 -1045 -141 -168 -40 -545 -149\n-722 -210 -1000 -344 -2119 -1059 -2931 -1874 -721 -724 -1368 -1701 -1724\n-2604 -266 -673 -462 -1537 -516 -2272 -21 -297 -9 -922 25 -1298 161 -1737\n991 -3482 2184 -4591 575 -535 1284 -1024 1945 -1341 726 -348 1556 -596 2261\n-674 314 -35 511 -45 860 -45 454 1 650 21 1290 134 555 97 897 190 1380 372\n612 232 1345 610 1803 930 729 511 1481 1298 2050 2149 426 638 786 1437 962\n2139 106 424 179 868 216 1320 21 262 30 1033 15 1341 -26 546 -107 1003 -277\n1567 -232 770 -547 1390 -1100 2172 -432 611 -660 892 -902 1114 -1222 1118\n-2712 1772 -4382 1921 -199 18 -791 29 -832 16z");
    			add_location(path0, file_1, 590, 40, 15791);
    			attr_dev(path1, "d", "M12795 11610 c-116 -25 -259 -95 -387 -192 -270 -204 -1025 -895\n-1453 -1329 -769 -781 -1516 -1719 -2300 -2889 -539 -805 -1140 -1822 -1805\n-3055 -371 -689 -749 -1364 -805 -1438 -10 -14 -20 -17 -37 -12 -35 11 -332\n316 -424 435 -223 287 -437 638 -888 1448 -553 995 -857 1614 -1231 2507 -161\n382 -225 566 -285 810 -28 114 -60 225 -70 246 -53 104 -138 154 -249 147\n-153 -9 -224 -83 -508 -525 -295 -459 -410 -658 -628 -1088 -184 -363 -275\n-580 -275 -658 0 -72 19 -119 69 -168 72 -72 156 -88 247 -45 68 31 108 84\n140 181 82 246 408 872 681 1305 75 118 147 234 162 258 14 23 30 41 35 39 5\n-2 34 -77 66 -167 71 -205 119 -324 308 -765 333 -778 636 -1384 1160 -2325\n603 -1083 834 -1431 1182 -1781 160 -162 276 -254 390 -308 70 -33 82 -36 170\n-36 83 0 101 3 145 26 100 53 200 183 372 484 144 252 436 782 676 1226 451\n835 689 1254 1163 2040 753 1249 1611 2425 2459 3369 236 262 801 820 1165\n1150 695 629 752 685 829 814 40 66 76 163 86 228 6 39 4 49 -14 67 -25 25\n-30 25 -146 1z");
    			add_location(path1, file_1, 610, 40, 17370);
    			attr_dev(g, "transform", "translate(0.000000,1584.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#f5f5f5");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file_1, 588, 36, 15648);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "50px");
    			attr_dev(svg, "height", "50px");
    			attr_dev(svg, "viewBox", "0 0 1584.000000 1584.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file_1, 584, 32, 15453);
    			attr_dev(div, "class", "facad svelte-nqo8nj");
    			add_location(div, file_1, 583, 28, 15343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!path0_transition) path0_transition = create_bidirectional_transition(
    						path0,
    						draw,
    						{
    							duration: 1200,
    							delay: 3000,
    							easing: quintOut
    						},
    						true
    					);

    					path0_transition.run(1);
    				});
    			}

    			if (local) {
    				add_render_callback(() => {
    					if (!path1_transition) path1_transition = create_bidirectional_transition(
    						path1,
    						draw,
    						{
    							duration: 1200,
    							delay: 900,
    							easing: quintOut
    						},
    						true
    					);

    					path1_transition.run(1);
    				});
    			}

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 500, easing: quintOut }, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!path0_transition) path0_transition = create_bidirectional_transition(
    					path0,
    					draw,
    					{
    						duration: 1200,
    						delay: 3000,
    						easing: quintOut
    					},
    					false
    				);

    				path0_transition.run(0);
    			}

    			if (local) {
    				if (!path1_transition) path1_transition = create_bidirectional_transition(
    					path1,
    					draw,
    					{
    						duration: 1200,
    						delay: 900,
    						easing: quintOut
    					},
    					false
    				);

    				path1_transition.run(0);
    			}

    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 500, easing: quintOut }, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && path0_transition) path0_transition.end();
    			if (detaching && path1_transition) path1_transition.end();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(583:24) {#if meme_selected_index == index}",
    		ctx
    	});

    	return block;
    }

    // (580:16) {#each memes as meme, index}
    function create_each_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*meme_selected_index*/ ctx[2] == /*index*/ ctx[20] && create_if_block_9(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[15](/*index*/ ctx[20], /*meme*/ ctx[18]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			if (!src_url_equal(img.src, img_src_value = /*meme*/ ctx[18].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "150px");
    			attr_dev(img, "width", "150px");
    			attr_dev(img, "alt", /*meme*/ ctx[18].title);
    			add_location(img, file_1, 581, 24, 15187);
    			attr_dev(div, "class", "meme svelte-nqo8nj");
    			attr_dev(div, "id", "meme-" + /*index*/ ctx[20]);
    			add_location(div, file_1, 580, 20, 15080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*meme_selected_index*/ ctx[2] == /*index*/ ctx[20]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*meme_selected_index*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(580:16) {#each memes as meme, index}",
    		ctx
    	});

    	return block;
    }

    // (685:20) {:else}
    function create_else_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Quite Quiet isn't it...?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(685:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (639:20) {#if memes && meme_house_open}
    function create_if_block_6(ctx) {
    	let t0_value = /*memes*/ ctx[5][/*meme_selected_index*/ ctx[2]].title + "";
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let if_block = /*memes*/ ctx[5][/*meme_selected_index*/ ctx[2]].approved && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meme_selected_index*/ 4 && t0_value !== (t0_value = /*memes*/ ctx[5][/*meme_selected_index*/ ctx[2]].title + "")) set_data_dev(t0, t0_value);

    			if (/*memes*/ ctx[5][/*meme_selected_index*/ ctx[2]].approved) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*meme_selected_index*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(639:20) {#if memes && meme_house_open}",
    		ctx
    	});

    	return block;
    }

    // (641:24) {#if memes[meme_selected_index].approved}
    function create_if_block_7(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path0_transition;
    	let path1;
    	let path1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M8128 15401 c-90 -30 -160 -103 -173 -181 -19 -110 55 -220 167 -248\n24 -6 174 -13 333 -16 310 -6 454 -15 715 -47 1439 -173 2790 -790 3842 -1755\n53 -49 185 -170 294 -269 417 -378 608 -596 857 -976 342 -522 672 -1247 862\n-1894 146 -498 280 -1210 316 -1685 15 -204 6 -756 -15 -950 -94 -831 -314\n-1626 -681 -2455 -145 -327 -378 -750 -613 -1110 -351 -539 -870 -1104 -1409\n-1536 -311 -249 -780 -582 -1038 -736 -590 -354 -1247 -608 -2039 -788 -409\n-92 -598 -117 -1016 -135 -739 -30 -1299 11 -2005 146 -609 118 -1231 335\n-1800 628 -797 412 -1374 877 -2031 1636 -918 1062 -1474 2309 -1648 3700 -44\n348 -51 462 -51 810 1 333 8 479 46 850 69 685 220 1277 511 2000 351 871 800\n1589 1405 2245 169 184 493 498 658 640 684 588 1403 992 2393 1346 464 166\n1208 350 1637 404 105 13 202 28 216 34 14 5 38 24 53 42 38 45 33 110 -12\n150 -44 40 -92 43 -334 25 -445 -34 -787 -80 -1045 -141 -168 -40 -545 -149\n-722 -210 -1000 -344 -2119 -1059 -2931 -1874 -721 -724 -1368 -1701 -1724\n-2604 -266 -673 -462 -1537 -516 -2272 -21 -297 -9 -922 25 -1298 161 -1737\n991 -3482 2184 -4591 575 -535 1284 -1024 1945 -1341 726 -348 1556 -596 2261\n-674 314 -35 511 -45 860 -45 454 1 650 21 1290 134 555 97 897 190 1380 372\n612 232 1345 610 1803 930 729 511 1481 1298 2050 2149 426 638 786 1437 962\n2139 106 424 179 868 216 1320 21 262 30 1033 15 1341 -26 546 -107 1003 -277\n1567 -232 770 -547 1390 -1100 2172 -432 611 -660 892 -902 1114 -1222 1118\n-2712 1772 -4382 1921 -199 18 -791 29 -832 16z");
    			add_location(path0, file_1, 647, 36, 19381);
    			attr_dev(path1, "d", "M12795 11610 c-116 -25 -259 -95 -387 -192 -270 -204 -1025 -895\n-1453 -1329 -769 -781 -1516 -1719 -2300 -2889 -539 -805 -1140 -1822 -1805\n-3055 -371 -689 -749 -1364 -805 -1438 -10 -14 -20 -17 -37 -12 -35 11 -332\n316 -424 435 -223 287 -437 638 -888 1448 -553 995 -857 1614 -1231 2507 -161\n382 -225 566 -285 810 -28 114 -60 225 -70 246 -53 104 -138 154 -249 147\n-153 -9 -224 -83 -508 -525 -295 -459 -410 -658 -628 -1088 -184 -363 -275\n-580 -275 -658 0 -72 19 -119 69 -168 72 -72 156 -88 247 -45 68 31 108 84\n140 181 82 246 408 872 681 1305 75 118 147 234 162 258 14 23 30 41 35 39 5\n-2 34 -77 66 -167 71 -205 119 -324 308 -765 333 -778 636 -1384 1160 -2325\n603 -1083 834 -1431 1182 -1781 160 -162 276 -254 390 -308 70 -33 82 -36 170\n-36 83 0 101 3 145 26 100 53 200 183 372 484 144 252 436 782 676 1226 451\n835 689 1254 1163 2040 753 1249 1611 2425 2459 3369 236 262 801 820 1165\n1150 695 629 752 685 829 814 40 66 76 163 86 228 6 39 4 49 -14 67 -25 25\n-30 25 -146 1z");
    			add_location(path1, file_1, 667, 36, 20956);
    			attr_dev(g, "transform", "translate(0.000000,1584.000000) scale(0.100000,-0.100000)");
    			attr_dev(g, "fill", "#3acc37");
    			attr_dev(g, "stroke", "none");
    			add_location(g, file_1, 645, 32, 19242);
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "11px");
    			attr_dev(svg, "height", "11px");
    			attr_dev(svg, "viewBox", "0 0 1584.000000 1584.000000");
    			attr_dev(svg, "preserveAspectRatio", "xMidYMid meet");
    			add_location(svg, file_1, 641, 28, 19051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!path0_transition) path0_transition = create_bidirectional_transition(
    						path0,
    						draw,
    						{
    							duration: 1200,
    							delay: 3000,
    							easing: quintOut
    						},
    						true
    					);

    					path0_transition.run(1);
    				});
    			}

    			if (local) {
    				add_render_callback(() => {
    					if (!path1_transition) path1_transition = create_bidirectional_transition(
    						path1,
    						draw,
    						{
    							duration: 1200,
    							delay: 900,
    							easing: quintOut
    						},
    						true
    					);

    					path1_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!path0_transition) path0_transition = create_bidirectional_transition(
    					path0,
    					draw,
    					{
    						duration: 1200,
    						delay: 3000,
    						easing: quintOut
    					},
    					false
    				);

    				path0_transition.run(0);
    			}

    			if (local) {
    				if (!path1_transition) path1_transition = create_bidirectional_transition(
    					path1,
    					draw,
    					{
    						duration: 1200,
    						delay: 900,
    						easing: quintOut
    					},
    					false
    				);

    				path1_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching && path0_transition) path0_transition.end();
    			if (detaching && path1_transition) path1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(641:24) {#if memes[meme_selected_index].approved}",
    		ctx
    	});

    	return block;
    }

    // (693:16) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("- Architect, Jae");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(693:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (691:16) {#if memes && meme_house_open}
    function create_if_block_5(ctx) {
    	let t0;
    	let t1_value = /*memes*/ ctx[5][/*meme_selected_index*/ ctx[2]].crafter + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("- Crafter, ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meme_selected_index*/ 4 && t1_value !== (t1_value = /*memes*/ ctx[5][/*meme_selected_index*/ ctx[2]].crafter + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(691:16) {#if memes && meme_house_open}",
    		ctx
    	});

    	return block;
    }

    // (709:12) {:else}
    function create_else_block_1$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Such Memeful Beauty!";
    			add_location(h2, file_1, 709, 16, 22803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(709:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (707:12) {#if !file}
    function create_if_block_3$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Share your piece of meme";
    			add_location(h2, file_1, 707, 16, 22733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(707:12) {#if !file}",
    		ctx
    	});

    	return block;
    }

    // (718:8) {:else}
    function create_else_block$1(ctx) {
    	let div5;
    	let div3;
    	let t0;
    	let div0;
    	let label0;
    	let h4;
    	let t2;
    	let div2;
    	let div1;
    	let label1;
    	let t4;
    	let div4;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			t0 = text("Choose from\n                    ");
    			div0 = element("div");
    			label0 = element("label");
    			h4 = element("h4");
    			h4.textContent = "Gallery";
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Meme House";
    			t4 = space();
    			div4 = element("div");
    			input = element("input");
    			attr_dev(h4, "class", "label-device");
    			add_location(h4, file_1, 723, 28, 23321);
    			attr_dev(label0, "class", "upload-btn-from-device svelte-nqo8nj");
    			attr_dev(label0, "for", "file");
    			add_location(label0, file_1, 722, 24, 23220);
    			attr_dev(div0, "class", "btn-container svelte-nqo8nj");
    			add_location(div0, file_1, 721, 20, 23168);
    			attr_dev(label1, "class", "label-memehouse");
    			add_location(label1, file_1, 730, 28, 23648);
    			attr_dev(div1, "class", "upload-btn-from-memehouse svelte-nqo8nj");
    			add_location(div1, file_1, 729, 24, 23553);
    			attr_dev(div2, "class", "btn-container svelte-nqo8nj");
    			add_location(div2, file_1, 728, 20, 23501);
    			attr_dev(div3, "class", "upload-wrap svelte-nqo8nj");
    			add_location(div3, file_1, 719, 16, 23090);
    			attr_dev(input, "id", "file");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "name", "file");
    			attr_dev(input, "class", "file-field svelte-nqo8nj");
    			add_location(input, file_1, 737, 20, 23902);
    			attr_dev(div4, "class", "field-wrap svelte-nqo8nj");
    			add_location(div4, file_1, 736, 16, 23857);
    			attr_dev(div5, "class", "form-wrap svelte-nqo8nj");
    			add_location(div5, file_1, 718, 12, 23050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(label0, h4);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(label0, "click", /*initHandler*/ ctx[11], false, false, false),
    					listen_dev(div1, "click", /*callToMemeHouse*/ ctx[7], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(718:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (714:8) {#if file}
    function create_if_block_2$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*preview_src*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "150px");
    			attr_dev(img, "height", "150px");
    			add_location(img, file_1, 715, 16, 22949);
    			attr_dev(div, "class", "preview-meme");
    			add_location(div, file_1, 714, 12, 22906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*preview_src*/ 16 && !src_url_equal(img.src, img_src_value = /*preview_src*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(714:8) {#if file}",
    		ctx
    	});

    	return block;
    }

    // (747:8) {#if file}
    function create_if_block_1$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-nqo8nj");
    			add_location(button, file_1, 747, 12, 24158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*initHandler*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(747:8) {#if file}",
    		ctx
    	});

    	return block;
    }

    // (752:8) {#if (stage == 0) && file}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-nqo8nj");
    			add_location(button, file_1, 752, 12, 24323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*bubbleUpFile*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(752:8) {#if (stage == 0) && file}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t0;
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let div5;
    	let div3;
    	let t3;
    	let div4;
    	let current;
    	let if_block0 = /*meme_house_open*/ ctx[3] && create_if_block_4$1(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (!/*file*/ ctx[0]) return create_if_block_3$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block1 = current_block_type(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*file*/ ctx[0]) return create_if_block_2$2;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_4(ctx);
    	let if_block2 = current_block_type_1(ctx);
    	let if_block3 = /*file*/ ctx[0] && create_if_block_1$3(ctx);
    	let if_block4 = /*stage*/ ctx[1] == 0 && /*file*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if_block1.c();
    			t1 = space();
    			if_block2.c();
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			if (if_block3) if_block3.c();
    			t3 = space();
    			div4 = element("div");
    			if (if_block4) if_block4.c();
    			attr_dev(div0, "class", "questionair-container svelte-nqo8nj");
    			add_location(div0, file_1, 705, 8, 22657);
    			attr_dev(div1, "class", "container svelte-nqo8nj");
    			add_location(div1, file_1, 704, 4, 22625);
    			attr_dev(div2, "class", "set-post-file-wrap svelte-nqo8nj");
    			add_location(div2, file_1, 703, 0, 22588);
    			attr_dev(div3, "class", "sub-navbar-left svelte-nqo8nj");
    			add_location(div3, file_1, 745, 4, 24097);
    			attr_dev(div4, "class", "sub-navbar-right svelte-nqo8nj");
    			add_location(div4, file_1, 750, 4, 24245);
    			attr_dev(div5, "class", "sub-navbar-wrap svelte-nqo8nj");
    			add_location(div5, file_1, 744, 0, 24063);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_block1.m(div0, null);
    			append_dev(div1, t1);
    			if_block2.m(div1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			if (if_block4) if_block4.m(div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*meme_house_open*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*meme_house_open*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_4(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			}

    			if (/*file*/ ctx[0]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$3(ctx);
    					if_block3.c();
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*stage*/ ctx[1] == 0 && /*file*/ ctx[0]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$3(ctx);
    					if_block4.c();
    					if_block4.m(div4, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if_block1.d();
    			if_block2.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div5);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetFile', slots, []);
    	let { stage = 0 } = $$props;
    	let { file } = $$props;
    	let { is_local = false } = $$props;
    	let memes = [];
    	let meme_selected_index;
    	let meme_selected_id;
    	let { local_meme_context } = $$props;
    	let preview_src = "";

    	for (let i = 0; i < 10; i++) {
    		memes.push({
    			id: i,
    			thumbnail: "HI",
    			title: 'This is title of meme',
    			crafter: "Jae",
    			approved: true,
    			src: "/icons/svgs/Global_panel.svg"
    		});
    	}

    	console.log(memes);

    	onMount(() => {
    		if (memes) {
    			$$invalidate(2, meme_selected_index = 0);
    			$$invalidate(14, meme_selected_id = memes[0].id);
    		}
    	});

    	let meme_house_open = false;
    	var dispatch = createEventDispatcher();

    	function bubbleUpFile() {
    		console.log("bubble up file...");
    		$$invalidate(1, stage = 1);
    		dispatch('postFile', { file, stage, is_local });
    	}

    	function callToMemeHouse() {
    		$$invalidate(3, meme_house_open = true);
    		console.log("clicked!", meme_house_open);
    	}

    	function selectMeme(index, meme_id) {
    		if (memes[index].id != meme_id) {
    			console.log('error: the id of passed meme and id of selected meme is different:', memes[index].id, meme_id);
    		} else {
    			$$invalidate(2, meme_selected_index = index);
    			$$invalidate(14, meme_selected_id = meme_id);
    			console.log("id matches:", meme_id, memes[index].id);
    		}
    	}

    	function goBack() {
    		$$invalidate(3, meme_house_open = false);
    	}

    	function goForth() {
    		$$invalidate(3, meme_house_open = false);
    		$$invalidate(12, is_local = true);
    		$$invalidate(0, file = memes[meme_selected_index]);
    		console.log("meme selected :", file, "local :", is_local);
    	}

    	function initHandler() {
    		if (!is_local) {
    			URL.revokeObjectURL(preview_src);
    			$$invalidate(4, preview_src = "");
    		} else {
    			$$invalidate(12, is_local = false);
    		}

    		$$invalidate(0, file = null);
    	}

    	const writable_props = ['stage', 'file', 'is_local', 'local_meme_context'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<SetFile> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (index, meme) => {
    		selectMeme(index, meme.id);
    	};

    	function input_change_handler() {
    		file = this.files;
    		$$invalidate(0, file);
    	}

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('is_local' in $$props) $$invalidate(12, is_local = $$props.is_local);
    		if ('local_meme_context' in $$props) $$invalidate(13, local_meme_context = $$props.local_meme_context);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		stage,
    		file,
    		is_local,
    		memes,
    		meme_selected_index,
    		meme_selected_id,
    		local_meme_context,
    		preview_src,
    		meme_house_open,
    		createEventDispatcher,
    		slide,
    		fade,
    		draw,
    		quintOut,
    		quintIn,
    		dispatch,
    		bubbleUpFile,
    		callToMemeHouse,
    		selectMeme,
    		goBack,
    		goForth,
    		initHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('stage' in $$props) $$invalidate(1, stage = $$props.stage);
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('is_local' in $$props) $$invalidate(12, is_local = $$props.is_local);
    		if ('memes' in $$props) $$invalidate(5, memes = $$props.memes);
    		if ('meme_selected_index' in $$props) $$invalidate(2, meme_selected_index = $$props.meme_selected_index);
    		if ('meme_selected_id' in $$props) $$invalidate(14, meme_selected_id = $$props.meme_selected_id);
    		if ('local_meme_context' in $$props) $$invalidate(13, local_meme_context = $$props.local_meme_context);
    		if ('preview_src' in $$props) $$invalidate(4, preview_src = $$props.preview_src);
    		if ('meme_house_open' in $$props) $$invalidate(3, meme_house_open = $$props.meme_house_open);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*meme_house_open*/ 8) {
    			{
    				if (meme_house_open && memes) {
    					memes[0].id;
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*file, is_local*/ 4097) {
    			{
    				if (file && !is_local) {
    					$$invalidate(4, preview_src = URL.createObjectURL(file[0]));
    				} else if (file && is_local) {
    					$$invalidate(4, preview_src = file.src);
    				}
    			}
    		}
    	};

    	return [
    		file,
    		stage,
    		meme_selected_index,
    		meme_house_open,
    		preview_src,
    		memes,
    		bubbleUpFile,
    		callToMemeHouse,
    		selectMeme,
    		goBack,
    		goForth,
    		initHandler,
    		is_local,
    		local_meme_context,
    		meme_selected_id,
    		click_handler,
    		input_change_handler
    	];
    }

    class SetFile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			stage: 1,
    			file: 0,
    			is_local: 12,
    			local_meme_context: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetFile",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console_1$3.warn("<SetFile> was created without expected prop 'file'");
    		}

    		if (/*local_meme_context*/ ctx[13] === undefined && !('local_meme_context' in props)) {
    			console_1$3.warn("<SetFile> was created without expected prop 'local_meme_context'");
    		}
    	}

    	get stage() {
    		throw new Error("<SetFile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<SetFile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get file() {
    		throw new Error("<SetFile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<SetFile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_local() {
    		throw new Error("<SetFile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_local(value) {
    		throw new Error("<SetFile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get local_meme_context() {
    		throw new Error("<SetFile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set local_meme_context(value) {
    		throw new Error("<SetFile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/Posting.svelte generated by Svelte v3.50.0 */

    const { console: console_1$2 } = globals;
    const file$4 = "src/forms/Posting.svelte";

    // (99:29) 
    function create_if_block_2$1(ctx) {
    	let h3;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "WELCOME TO";
    			t1 = space();
    			img = element("img");
    			attr_dev(h3, "class", "svelte-cfjtx7");
    			add_location(h3, file$4, 99, 12, 2372);
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Jae.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "60");
    			add_location(img, file$4, 100, 12, 2405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(99:29) ",
    		ctx
    	});

    	return block;
    }

    // (97:29) 
    function create_if_block_1$2(ctx) {
    	let settitle;
    	let current;

    	settitle = new SetTitle({
    			props: {
    				title: /*_title*/ ctx[1],
    				stage: /*stage*/ ctx[0]
    			},
    			$$inline: true
    		});

    	settitle.$on("postTitle", /*resetTitle*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(settitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const settitle_changes = {};
    			if (dirty & /*_title*/ 2) settitle_changes.title = /*_title*/ ctx[1];
    			if (dirty & /*stage*/ 1) settitle_changes.stage = /*stage*/ ctx[0];
    			settitle.$set(settitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(97:29) ",
    		ctx
    	});

    	return block;
    }

    // (95:8) {#if stage == 0}
    function create_if_block$2(ctx) {
    	let setfile;
    	let current;

    	setfile = new SetFile({
    			props: {
    				file: /*_file*/ ctx[2],
    				stage: /*stage*/ ctx[0],
    				is_local: /*is_local*/ ctx[3]
    			},
    			$$inline: true
    		});

    	setfile.$on("postFile", /*resetFile*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(setfile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(setfile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const setfile_changes = {};
    			if (dirty & /*_file*/ 4) setfile_changes.file = /*_file*/ ctx[2];
    			if (dirty & /*stage*/ 1) setfile_changes.stage = /*stage*/ ctx[0];
    			if (dirty & /*is_local*/ 8) setfile_changes.is_local = /*is_local*/ ctx[3];
    			setfile.$set(setfile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setfile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setfile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setfile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(95:8) {#if stage == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let div1_transition;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*stage*/ ctx[0] == 0) return 0;
    		if (/*stage*/ ctx[0] == 1) return 1;
    		if (/*stage*/ ctx[0] == 2) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "posting-container svelte-cfjtx7");
    			add_location(div0, file$4, 93, 4, 2063);
    			attr_dev(div1, "class", "content-wrap svelte-cfjtx7");
    			add_location(div1, file$4, 92, 0, 1974);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { delay: 300, duration: 400, opacity: 0 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { delay: 300, duration: 400, opacity: 0 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let stage;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Posting', slots, []);
    	let _title = "";
    	let _file = "";
    	let _created_at = "";
    	let _crafter = "";
    	let is_local = false;
    	var dispatch = createEventDispatcher();

    	function resetTitle(e) {
    		$$invalidate(1, _title = e.detail.title);
    		$$invalidate(0, stage = e.detail.stage);
    		console.log("title reset:", _title);
    	}

    	function resetFile(e) {
    		$$invalidate(2, _file = e.detail.file);
    		$$invalidate(0, stage = e.detail.stage);
    		$$invalidate(3, is_local = e.detail.is_local);
    		console.log("file reset:", _file, "on local:", is_local);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Posting> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		fade,
    		SetTitle,
    		SetFile,
    		_title,
    		_file,
    		_created_at,
    		_crafter,
    		is_local,
    		dispatch,
    		resetTitle,
    		resetFile,
    		stage
    	});

    	$$self.$inject_state = $$props => {
    		if ('_title' in $$props) $$invalidate(1, _title = $$props._title);
    		if ('_file' in $$props) $$invalidate(2, _file = $$props._file);
    		if ('_created_at' in $$props) _created_at = $$props._created_at;
    		if ('_crafter' in $$props) _crafter = $$props._crafter;
    		if ('is_local' in $$props) $$invalidate(3, is_local = $$props.is_local);
    		if ('dispatch' in $$props) $$invalidate(8, dispatch = $$props.dispatch);
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*stage*/ 1) {
    			{
    				if (stage == 3) {
    					setTimeout(
    						() => {
    							dispatch('mode', { signIn: false });
    						},
    						5000
    					);
    				}
    			}
    		}
    	};

    	$$invalidate(0, stage = 0);
    	return [stage, _title, _file, is_local, resetTitle, resetFile];
    }

    class Posting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Posting",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.50.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/Content.svelte";

    // (84:22) 
    function create_if_block_4(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(84:22) ",
    		ctx
    	});

    	return block;
    }

    // (82:33) 
    function create_if_block_3(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });
    	home.$on("mode", /*modeChange*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(82:33) ",
    		ctx
    	});

    	return block;
    }

    // (80:44) 
    function create_if_block_2(ctx) {
    	let signin;
    	let current;
    	signin = new SignIn({ $$inline: true });
    	signin.$on("mode", /*modeChange*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(signin.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signin, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signin, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(80:44) ",
    		ctx
    	});

    	return block;
    }

    // (78:44) 
    function create_if_block_1$1(ctx) {
    	let posting_1;
    	let current;
    	posting_1 = new Posting({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(posting_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(posting_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(posting_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(posting_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(posting_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(78:44) ",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if loaded && !signIn && !loggedIn}
    function create_if_block$1(ctx) {
    	let login_1;
    	let current;
    	login_1 = new Login({ $$inline: true });
    	login_1.$on("mode", /*modeChange*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(login_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(76:4) {#if loaded && !signIn && !loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	const if_block_creators = [
    		create_if_block$1,
    		create_if_block_1$1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && !/*signIn*/ ctx[2] && !/*loggedIn*/ ctx[0]) return 0;
    		if (/*loggedIn*/ ctx[0] && /*loaded*/ ctx[1] && /*posting*/ ctx[3]) return 1;
    		if (/*signIn*/ ctx[2] && /*loaded*/ ctx[1] && !/*loggedIn*/ ctx[0]) return 2;
    		if (/*loggedIn*/ ctx[0] && /*loaded*/ ctx[1]) return 3;
    		if (!/*loaded*/ ctx[1]) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "content-container svelte-1oj33b5");
    			add_location(div, file$3, 74, 0, 1444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	var dispatch = createEventDispatcher();
    	let { dev = true } = $$props;
    	let { loggedIn = false } = $$props;

    	//for dev option time set to 0
    	let load_time = 0;

    	let signIn = false;
    	let posting = true;
    	let loaded = false;

    	if (!dev) {
    		load_time = 5000;
    	}

    	function modeChange(e) {
    		$$invalidate(2, signIn = e.detail.signIn);
    		$$invalidate(1, loaded = false);
    		console.log("loaded: ", loaded, "signIn: ", signIn);
    	}

    	function login(e) {
    		dispatch('login', { loggedIn: true });
    	}

    	const writable_props = ['dev', 'loggedIn'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dev' in $$props) $$invalidate(5, dev = $$props.dev);
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Login,
    		SignIn,
    		Loading,
    		Home,
    		Posting,
    		dispatch,
    		dev,
    		loggedIn,
    		load_time,
    		signIn,
    		posting,
    		loaded,
    		modeChange,
    		login
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('dev' in $$props) $$invalidate(5, dev = $$props.dev);
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    		if ('load_time' in $$props) $$invalidate(6, load_time = $$props.load_time);
    		if ('signIn' in $$props) $$invalidate(2, signIn = $$props.signIn);
    		if ('posting' in $$props) $$invalidate(3, posting = $$props.posting);
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*loaded, load_time*/ 66) {
    			{
    				if (!loaded) {
    					setTimeout(
    						() => {
    							$$invalidate(1, loaded = true);
    						},
    						load_time
    					);
    				}

    				console.log("loaded: ", loaded);
    			}
    		}
    	};

    	return [loggedIn, loaded, signIn, posting, modeChange, dev, load_time];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { dev: 5, loggedIn: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get dev() {
    		throw new Error("<Content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dev(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loggedIn() {
    		throw new Error("<Content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loggedIn(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.50.0 */

    const file$2 = "src/Footer.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "SIGNITURE OF";
    			t1 = space();
    			img = element("img");
    			add_location(p, file$2, 41, 12, 813);
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Jae_footer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "40");
    			attr_dev(img, "class", "svelte-1yr01se");
    			add_location(img, file$2, 42, 12, 845);
    			attr_dev(div0, "class", "footer svelte-1yr01se");
    			add_location(div0, file$2, 40, 8, 780);
    			attr_dev(div1, "class", "footer-wrap svelte-1yr01se");
    			add_location(div1, file$2, 39, 4, 746);
    			attr_dev(div2, "class", "footer-container svelte-1yr01se");
    			add_location(div2, file$2, 38, 0, 711);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div0, t1);
    			append_dev(div0, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Panel.svelte generated by Svelte v3.50.0 */

    const file$1 = "src/Panel.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let a3;
    	let img3;
    	let img3_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t1 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t2 = space();
    			a3 = element("a");
    			img3 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/Home_panel.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "28");
    			add_location(img0, file$1, 34, 5, 618);
    			add_location(a0, file$1, 34, 2, 615);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/draw.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "28");
    			add_location(img1, file$1, 35, 5, 678);
    			add_location(a1, file$1, 35, 2, 675);
    			if (!src_url_equal(img2.src, img2_src_value = "/icons/svgs/Global_panel.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "height", "28");
    			add_location(img2, file$1, 36, 5, 732);
    			add_location(a2, file$1, 36, 2, 729);
    			if (!src_url_equal(img3.src, img3_src_value = "/icons/svgs/locked.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "height", "28");
    			add_location(img3, file$1, 37, 5, 794);
    			add_location(a3, file$1, 37, 2, 791);
    			attr_dev(div0, "class", "panel-wrap svelte-1n1b9o");
    			add_location(div0, file$1, 33, 4, 588);
    			attr_dev(div1, "class", "panel-container svelte-1n1b9o");
    			add_location(div1, file$1, 32, 0, 554);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, a1);
    			append_dev(a1, img1);
    			append_dev(div0, t1);
    			append_dev(div0, a2);
    			append_dev(a2, img2);
    			append_dev(div0, t2);
    			append_dev(div0, a3);
    			append_dev(a3, img3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Panel', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Panel> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Panel",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.50.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (79:4) {:else}
    function create_else_block(ctx) {
    	let navbar;
    	let t0;
    	let content;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	navbar = new Navbar({
    			props: { loggedIn: /*loggedIn*/ ctx[0] },
    			$$inline: true
    		});

    	content = new Content({
    			props: {
    				dev: /*dev*/ ctx[2],
    				loggedIn: /*loggedIn*/ ctx[0]
    			},
    			$$inline: true
    		});

    	content.$on("login", /*loginHandler*/ ctx[3]);
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*loggedIn*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(content.$$.fragment);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(content, target, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbar_changes = {};
    			if (dirty & /*loggedIn*/ 1) navbar_changes.loggedIn = /*loggedIn*/ ctx[0];
    			navbar.$set(navbar_changes);
    			const content_changes = {};
    			if (dirty & /*loggedIn*/ 1) content_changes.loggedIn = /*loggedIn*/ ctx[0];
    			content.$set(content_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(content, detaching);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(79:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (75:4) {#if new_load}
    function create_if_block(ctx) {
    	let div;
    	let loading;
    	let current;

    	loading = new Loading({
    			props: { dev: /*dev*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loading.$$.fragment);
    			attr_dev(div, "class", "spin-container svelte-pk6adf");
    			add_location(div, file, 75, 8, 1175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loading, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(75:4) {#if new_load}",
    		ctx
    	});

    	return block;
    }

    // (84:2) {:else}
    function create_else_block_1(ctx) {
    	let panel;
    	let current;
    	panel = new Panel({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(panel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(panel, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(panel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(84:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (82:2) {#if !loggedIn}
    function create_if_block_1(ctx) {
    	let footer;
    	let current;
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(82:2) {#if !loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*new_load*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-pk6adf");
    			add_location(main, file, 73, 0, 1141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let loggedIn;
    	let new_load;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let dev = true;
    	let load_time = 0;

    	if (!dev) {
    		load_time = 10000;
    	}

    	setTimeout(
    		() => {
    			$$invalidate(1, new_load = false);
    		},
    		load_time
    	);

    	function loginHandler(e) {
    		$$invalidate(0, loggedIn = e.detail.loggedIn);
    		console.log("login status:", loggedIn);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Navbar,
    		Container: Content,
    		Content,
    		Footer,
    		Loading,
    		Panel,
    		dev,
    		load_time,
    		loginHandler,
    		loggedIn,
    		new_load
    	});

    	$$self.$inject_state = $$props => {
    		if ('dev' in $$props) $$invalidate(2, dev = $$props.dev);
    		if ('load_time' in $$props) load_time = $$props.load_time;
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    		if ('new_load' in $$props) $$invalidate(1, new_load = $$props.new_load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, loggedIn = true);
    	$$invalidate(1, new_load = true);
    	return [loggedIn, new_load, dev, loginHandler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
