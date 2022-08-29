
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
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

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
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

    /* src/Navbar.svelte generated by Svelte v3.49.0 */

    const file$c = "src/Navbar.svelte";

    // (61:12) {#if !loggedIn}
    function create_if_block$6(ctx) {
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
    			attr_dev(img0, "height", "30");
    			attr_dev(img0, "alt", "home");
    			add_location(img0, file$c, 62, 20, 1220);
    			attr_dev(div0, "class", "home-wrap");
    			add_location(div0, file$c, 61, 16, 1176);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/Global.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "30");
    			attr_dev(img1, "alt", "global");
    			add_location(img1, file$c, 65, 20, 1361);
    			attr_dev(div1, "class", "global-wrap");
    			add_location(div1, file$c, 64, 16, 1315);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(61:12) {#if !loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let t1;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let if_block = !/*loggedIn*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/Me.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "height", "30");
    			attr_dev(img0, "alt", "JAE");
    			add_location(img0, file$c, 57, 12, 1032);
    			attr_dev(div0, "class", "logo-wrap svelte-11oncb3");
    			add_location(div0, file$c, 56, 8, 996);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/Dm.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "30");
    			attr_dev(img1, "alt", "dm");
    			add_location(img1, file$c, 69, 16, 1512);
    			attr_dev(div1, "class", "dm-wrap");
    			add_location(div1, file$c, 68, 12, 1474);
    			attr_dev(div2, "class", "menu-wrap svelte-11oncb3");
    			add_location(div2, file$c, 59, 8, 1108);
    			attr_dev(div3, "class", "nav-content-wrap svelte-11oncb3");
    			add_location(div3, file$c, 55, 4, 957);
    			attr_dev(div4, "class", "navbar svelte-11oncb3");
    			add_location(div4, file$c, 54, 0, 932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, img1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*loggedIn*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div2, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { loggedIn: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$c.name
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

    /* src/forms/Login.svelte generated by Svelte v3.49.0 */

    const { console: console_1$6 } = globals;
    const file$b = "src/forms/Login.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(img0, file$b, 238, 20, 4921);
    			attr_dev(div0, "class", "login-title svelte-o82d3k");
    			add_location(div0, file$b, 237, 16, 4875);
    			attr_dev(label0, "for", "username");

    			attr_dev(label0, "class", label0_class_value = "" + (null_to_empty(/*email*/ ctx[0].length == 0
    			? 'username-label'
    			: 'username-label-filled') + " svelte-o82d3k"));

    			add_location(label0, file$b, 243, 28, 5164);
    			attr_dev(input0, "class", "email-input svelte-o82d3k");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "username");
    			input0.required = true;
    			add_location(input0, file$b, 244, 28, 5306);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/crop_bar.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "4");
    			attr_dev(img1, "width", "200");
    			add_location(img1, file$b, 245, 28, 5418);
    			attr_dev(div1, "class", "login-input svelte-o82d3k");
    			add_location(div1, file$b, 242, 24, 5110);
    			attr_dev(label1, "for", "password");

    			attr_dev(label1, "class", label1_class_value = "" + (null_to_empty(/*password*/ ctx[1].length == 0
    			? 'password-label'
    			: 'password-label-filled') + " svelte-o82d3k"));

    			add_location(label1, file$b, 248, 28, 5583);
    			attr_dev(input1, "class", "password-input svelte-o82d3k");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$b, 249, 28, 5765);
    			if (!src_url_equal(img2.src, img2_src_value = "/icons/crop_bar.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "height", "4");
    			attr_dev(img2, "width", "200");
    			add_location(img2, file$b, 250, 28, 5887);
    			attr_dev(div2, "class", "login-input svelte-o82d3k");
    			add_location(div2, file$b, 247, 24, 5529);
    			attr_dev(button0, "class", "login-button svelte-o82d3k");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$b, 254, 30, 6137);
    			attr_dev(div3, "class", "login-button-wrap svelte-o82d3k");
    			add_location(div3, file$b, 253, 26, 6045);
    			attr_dev(hr0, "class", "first svelte-o82d3k");
    			add_location(hr0, file$b, 257, 30, 6326);
    			attr_dev(p, "class", "middle svelte-o82d3k");
    			add_location(p, file$b, 258, 30, 6375);
    			attr_dev(hr1, "class", "second svelte-o82d3k");
    			add_location(hr1, file$b, 259, 30, 6430);
    			attr_dev(div4, "class", "or svelte-o82d3k");
    			add_location(div4, file$b, 256, 26, 6279);
    			attr_dev(button1, "class", "signin-button svelte-o82d3k");
    			add_location(button1, file$b, 262, 30, 6572);
    			attr_dev(div5, "class", "signin-button-wrap svelte-o82d3k");
    			add_location(div5, file$b, 261, 26, 6509);
    			attr_dev(div6, "class", "actions svelte-o82d3k");
    			add_location(div6, file$b, 252, 24, 5997);
    			attr_dev(form, "action", "/login");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$b, 241, 20, 5049);
    			attr_dev(div7, "class", "login-form svelte-o82d3k");
    			add_location(div7, file$b, 240, 16, 5004);
    			attr_dev(div8, "class", "login svelte-o82d3k");
    			add_location(div8, file$b, 236, 12, 4839);
    			attr_dev(div9, "class", "login-wrap svelte-o82d3k");
    			add_location(div9, file$b, 235, 16, 4802);
    			attr_dev(div10, "class", "login-container svelte-o82d3k");
    			add_location(div10, file$b, 234, 4, 4756);
    			attr_dev(div11, "class", "content-wrap svelte-o82d3k");
    			add_location(div11, file$b, 233, 0, 4725);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Login> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/forms/SignInComponents/SetName.svelte generated by Svelte v3.49.0 */

    const { console: console_1$5 } = globals;
    const file$a = "src/forms/SignInComponents/SetName.svelte";

    // (238:12) {:else}
    function create_else_block$4(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Name is not valid enough...";
    			add_location(h2, file$a, 238, 16, 5204);
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(238:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (235:40) 
    function create_if_block_7$1(ctx) {
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
    			add_location(h1, file$a, 235, 16, 5113);
    			add_location(h2, file$a, 236, 16, 5145);
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
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(235:40) ",
    		ctx
    	});

    	return block;
    }

    // (233:13) {#if name == ""}
    function create_if_block_6$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "What are you called?";
    			add_location(h2, file$a, 233, 16, 5026);
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
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(233:13) {#if name == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (252:12) {#if !name_rule_detail.is_long_enough}
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
    			p.textContent = "Too short! Make it longer than 2 letters.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$a, 254, 24, 5788);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$a, 253, 20, 5740);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$a, 256, 20, 5896);
    			attr_dev(div1, "class", "requirement-wrap svelte-1x4d1sa");
    			add_location(div1, file$a, 252, 16, 5689);
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
    		source: "(252:12) {#if !name_rule_detail.is_long_enough}",
    		ctx
    	});

    	return block;
    }

    // (260:12) {#if !name_rule_detail.is_short_enough}
    function create_if_block_4$2(ctx) {
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
    			add_location(img, file$a, 262, 24, 6153);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$a, 261, 20, 6105);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$a, 264, 20, 6261);
    			attr_dev(div1, "class", "requirement-wrap svelte-1x4d1sa");
    			add_location(div1, file$a, 260, 16, 6054);
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
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(260:12) {#if !name_rule_detail.is_short_enough}",
    		ctx
    	});

    	return block;
    }

    // (268:12) {#if !name_rule_detail.no_whitespace}
    function create_if_block_3$3(ctx) {
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
    			add_location(img, file$a, 270, 24, 6517);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$a, 269, 20, 6469);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$a, 272, 16, 6621);
    			attr_dev(div1, "class", "requirement-wrap svelte-1x4d1sa");
    			add_location(div1, file$a, 268, 16, 6418);
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
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(268:12) {#if !name_rule_detail.no_whitespace}",
    		ctx
    	});

    	return block;
    }

    // (276:12) {#if name_rule_result}
    function create_if_block_2$4(ctx) {
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
    			add_location(img, file$a, 278, 24, 6851);
    			attr_dev(div0, "class", "icon-wrap svelte-1x4d1sa");
    			add_location(div0, file$a, 277, 20, 6803);
    			attr_dev(p, "class", "svelte-1x4d1sa");
    			add_location(p, file$a, 280, 16, 6955);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-1x4d1sa");
    			add_location(div1, file$a, 276, 16, 6746);
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
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(276:12) {#if name_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (290:8) {#if stage != 0}
    function create_if_block_1$5(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-1x4d1sa");
    			add_location(button, file$a, 290, 12, 7162);
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(290:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (295:8) {#if (stage == 0) && (name != "") && name_rule_result}
    function create_if_block$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-1x4d1sa");
    			add_location(button, file$a, 295, 8, 7329);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(295:8) {#if (stage == 0) && (name != \\\"\\\") && name_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
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
    		if (/*name*/ ctx[0] == "") return create_if_block_6$1;
    		if (/*name_rule_result*/ ctx[3]) return create_if_block_7$1;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*name_rule_detail*/ ctx[2].is_long_enough && create_if_block_5$2(ctx);
    	let if_block2 = !/*name_rule_detail*/ ctx[2].is_short_enough && create_if_block_4$2(ctx);
    	let if_block3 = !/*name_rule_detail*/ ctx[2].no_whitespace && create_if_block_3$3(ctx);
    	let if_block4 = /*name_rule_result*/ ctx[3] && create_if_block_2$4(ctx);
    	let if_block5 = /*stage*/ ctx[1] != 0 && create_if_block_1$5(ctx);
    	let if_block6 = /*stage*/ ctx[1] == 0 && /*name*/ ctx[0] != "" && /*name_rule_result*/ ctx[3] && create_if_block$5(ctx);

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
    			add_location(div0, file$a, 231, 8, 4944);
    			attr_dev(input, "id", "name");
    			attr_dev(input, "name", "name");
    			attr_dev(input, "class", "name-field svelte-1x4d1sa");
    			add_location(input, file$a, 244, 16, 5367);
    			attr_dev(div1, "class", "field-wrap svelte-1x4d1sa");
    			add_location(div1, file$a, 243, 12, 5326);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$a, 247, 12, 5490);
    			attr_dev(div2, "class", "form-wrap svelte-1x4d1sa");
    			add_location(div2, file$a, 242, 8, 5290);
    			attr_dev(div3, "class", "name-requirement-container svelte-1x4d1sa");
    			add_location(div3, file$a, 250, 8, 5581);
    			attr_dev(div4, "class", "container svelte-1x4d1sa");
    			add_location(div4, file$a, 230, 4, 4912);
    			attr_dev(div5, "class", "set-user-name-wrap svelte-1x4d1sa");
    			add_location(div5, file$a, 229, 0, 4875);
    			attr_dev(div6, "class", "sub-navbar-left svelte-1x4d1sa");
    			add_location(div6, file$a, 288, 4, 7095);
    			attr_dev(div7, "class", "sub-navbar-right svelte-1x4d1sa");
    			add_location(div7, file$a, 293, 4, 7227);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-1x4d1sa");
    			add_location(div8, file$a, 287, 0, 7061);
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
    					if_block1 = create_if_block_5$2(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!/*name_rule_detail*/ ctx[2].is_short_enough) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_4$2(ctx);
    					if_block2.c();
    					if_block2.m(div3, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*name_rule_detail*/ ctx[2].no_whitespace) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_3$3(ctx);
    					if_block3.c();
    					if_block3.m(div3, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name_rule_result*/ ctx[3]) {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_2$4(ctx);
    					if_block4.c();
    					if_block4.m(div3, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*stage*/ ctx[1] != 0) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_1$5(ctx);
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
    					if_block6 = create_if_block$5(ctx);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<SetName> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { stage: 1, name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetName",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1$5.warn("<SetName> was created without expected prop 'name'");
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

    /* src/forms/SignInComponents/SetEmail.svelte generated by Svelte v3.49.0 */

    const { console: console_1$4 } = globals;
    const file$9 = "src/forms/SignInComponents/SetEmail.svelte";

    // (224:12) {:else}
    function create_else_block$3(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Email is not valid enough...";
    			add_location(h2, file$9, 224, 16, 4955);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(224:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (222:41) 
    function create_if_block_5$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "You sure this is your email?";
    			add_location(h2, file$9, 222, 16, 4881);
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
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(222:41) ",
    		ctx
    	});

    	return block;
    }

    // (220:13) {#if email == ""}
    function create_if_block_4$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "What email address do you use?";
    			add_location(h2, file$9, 220, 16, 4783);
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
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(220:13) {#if email == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (238:12) {#if !email_rule_result}
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
    			p.textContent = "This is not a valid email format.";
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "13px");
    			attr_dev(img, "height", "13px");
    			add_location(img, file$9, 240, 24, 5531);
    			attr_dev(div0, "class", "icon-wrap svelte-1e2qs0c");
    			add_location(div0, file$9, 239, 20, 5483);
    			attr_dev(p, "class", "svelte-1e2qs0c");
    			add_location(p, file$9, 242, 20, 5639);
    			attr_dev(div1, "class", "requirement-wrap svelte-1e2qs0c");
    			add_location(div1, file$9, 238, 16, 5432);
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
    		source: "(238:12) {#if !email_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (246:12) {#if email_rule_result}
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
    			add_location(img, file$9, 248, 24, 5878);
    			attr_dev(div0, "class", "icon-wrap svelte-1e2qs0c");
    			add_location(div0, file$9, 247, 20, 5830);
    			attr_dev(p, "class", "svelte-1e2qs0c");
    			add_location(p, file$9, 250, 20, 5986);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-1e2qs0c");
    			add_location(div1, file$9, 246, 16, 5773);
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
    		source: "(246:12) {#if email_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (260:8) {#if stage != 0}
    function create_if_block_1$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-1e2qs0c");
    			add_location(button, file$9, 260, 12, 6193);
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(260:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (265:8) {#if (stage == 1) && (email != "") && email_rule_result}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-1e2qs0c");
    			add_location(button, file$9, 265, 12, 6389);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(265:8) {#if (stage == 1) && (email != \\\"\\\") && email_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
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
    		if (/*email*/ ctx[0] == "") return create_if_block_4$1;
    		if (/*email_rule_result*/ ctx[2]) return create_if_block_5$1;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*email_rule_result*/ ctx[2] && create_if_block_3$2(ctx);
    	let if_block2 = /*email_rule_result*/ ctx[2] && create_if_block_2$3(ctx);
    	let if_block3 = /*stage*/ ctx[1] != 0 && create_if_block_1$4(ctx);
    	let if_block4 = /*stage*/ ctx[1] == 1 && /*email*/ ctx[0] != "" && /*email_rule_result*/ ctx[2] && create_if_block$4(ctx);

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
    			add_location(div0, file$9, 218, 8, 4700);
    			attr_dev(input, "id", "email");
    			attr_dev(input, "name", "email");
    			attr_dev(input, "class", "email-field svelte-1e2qs0c");
    			add_location(input, file$9, 230, 16, 5119);
    			attr_dev(div1, "class", "field-wrap svelte-1e2qs0c");
    			add_location(div1, file$9, 229, 12, 5078);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$9, 233, 12, 5246);
    			attr_dev(div2, "class", "form-wrap svelte-1e2qs0c");
    			add_location(div2, file$9, 228, 8, 5042);
    			attr_dev(div3, "class", "email-requirement-container svelte-1e2qs0c");
    			add_location(div3, file$9, 236, 8, 5337);
    			attr_dev(div4, "class", "container svelte-1e2qs0c");
    			add_location(div4, file$9, 217, 4, 4668);
    			attr_dev(div5, "class", "set-user-email-wrap svelte-1e2qs0c");
    			add_location(div5, file$9, 216, 0, 4630);
    			attr_dev(div6, "class", "sub-navbar-left svelte-1e2qs0c");
    			add_location(div6, file$9, 258, 4, 6126);
    			attr_dev(div7, "class", "sub-navbar-right svelte-1e2qs0c");
    			add_location(div7, file$9, 263, 4, 6281);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-1e2qs0c");
    			add_location(div8, file$9, 257, 0, 6092);
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
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*email_rule_result*/ ctx[2]) {
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

    			if (/*stage*/ ctx[1] == 1 && /*email*/ ctx[0] != "" && /*email_rule_result*/ ctx[2]) {
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<SetEmail> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { stage: 1, email: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetEmail",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*email*/ ctx[0] === undefined && !('email' in props)) {
    			console_1$4.warn("<SetEmail> was created without expected prop 'email'");
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

    /* src/forms/SignInComponents/SetPassword.svelte generated by Svelte v3.49.0 */

    const { console: console_1$3 } = globals;
    const file$8 = "src/forms/SignInComponents/SetPassword.svelte";

    // (283:12) {:else}
    function create_else_block_2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Mode Error. Something went wrong ...";
    			add_location(h2, file$8, 283, 16, 7499);
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
    		id: create_else_block_2.name,
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
    		return create_else_block_1$1;
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
    function create_if_block_7(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*password_container*/ ctx[4] == "") return create_if_block_8;
    		if (/*password_rule_result*/ ctx[2]) return create_if_block_9;
    		return create_else_block$2;
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(267:12) {#if check_password_mode == 0}",
    		ctx
    	});

    	return block;
    }

    // (280:16) {:else}
    function create_else_block_1$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Password doesn't seem to match ... You sure ?";
    			add_location(h2, file$8, 280, 20, 7386);
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
    			add_location(h2, file$8, 278, 20, 7324);
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
    			add_location(h2, file$8, 276, 20, 7202);
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
    function create_else_block$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Password not strong enough ...";
    			add_location(h2, file$8, 272, 20, 7025);
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
    		source: "(272:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (270:47) 
    function create_if_block_9(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Make sure you internalize this magic password";
    			add_location(h2, file$8, 270, 20, 6926);
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(270:47) ",
    		ctx
    	});

    	return block;
    }

    // (268:16) {#if password_container == ""}
    function create_if_block_8(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Set a magic password !";
    			add_location(h2, file$8, 268, 20, 6826);
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(268:16) {#if password_container == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (297:12) {#if !password_rule_result && !password_rule_detail.has_uppercase}
    function create_if_block_6(ctx) {
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
    			add_location(img, file$8, 299, 24, 8166);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$8, 298, 20, 8118);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$8, 301, 20, 8274);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$8, 297, 16, 8067);
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(297:12) {#if !password_rule_result && !password_rule_detail.has_uppercase}",
    		ctx
    	});

    	return block;
    }

    // (305:12) {#if !password_rule_result && !password_rule_detail.long_enough}
    function create_if_block_5(ctx) {
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
    			add_location(img, file$8, 307, 24, 8547);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$8, 306, 20, 8499);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$8, 309, 20, 8655);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$8, 305, 16, 8448);
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(305:12) {#if !password_rule_result && !password_rule_detail.long_enough}",
    		ctx
    	});

    	return block;
    }

    // (313:12) {#if !password_rule_result && !password_rule_detail.has_specialcase}
    function create_if_block_4(ctx) {
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
    			add_location(img, file$8, 315, 24, 8948);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$8, 314, 20, 8900);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$8, 317, 20, 9056);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$8, 313, 16, 8849);
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(313:12) {#if !password_rule_result && !password_rule_detail.has_specialcase}",
    		ctx
    	});

    	return block;
    }

    // (321:12) {#if !password_rule_result && !password_rule_detail.no_whitespace}
    function create_if_block_3$1(ctx) {
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
    			add_location(img, file$8, 323, 24, 9334);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$8, 322, 20, 9286);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$8, 325, 20, 9442);
    			attr_dev(div1, "class", "requirement-wrap svelte-2z43ps");
    			add_location(div1, file$8, 321, 16, 9235);
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(321:12) {#if !password_rule_result && !password_rule_detail.no_whitespace}",
    		ctx
    	});

    	return block;
    }

    // (329:12) {#if password_rule_result}
    function create_if_block_2$2(ctx) {
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
    			add_location(img, file$8, 331, 24, 9676);
    			attr_dev(div0, "class", "icon-wrap svelte-2z43ps");
    			add_location(div0, file$8, 330, 20, 9628);
    			attr_dev(p, "class", "svelte-2z43ps");
    			add_location(p, file$8, 333, 16, 9780);
    			attr_dev(div1, "class", "requirement-wrap-check svelte-2z43ps");
    			add_location(div1, file$8, 329, 16, 9571);
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(329:12) {#if password_rule_result}",
    		ctx
    	});

    	return block;
    }

    // (343:8) {#if stage != 0}
    function create_if_block_1$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-left svelte-2z43ps");
    			add_location(button, file$8, 343, 12, 9987);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(343:8) {#if stage != 0}",
    		ctx
    	});

    	return block;
    }

    // (348:8) {#if (stage == 2) && (password_container != "") && password_rule_result}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "nav-right svelte-2z43ps");
    			add_location(button, file$8, 348, 12, 10194);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(348:8) {#if (stage == 2) && (password_container != \\\"\\\") && password_rule_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    		if (/*check_password_mode*/ ctx[5] == 0) return create_if_block_7;
    		if (/*check_password_mode*/ ctx[5] == 1) return create_if_block_10;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_uppercase && create_if_block_6(ctx);
    	let if_block2 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].long_enough && create_if_block_5(ctx);
    	let if_block3 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_specialcase && create_if_block_4(ctx);
    	let if_block4 = !/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].no_whitespace && create_if_block_3$1(ctx);
    	let if_block5 = /*password_rule_result*/ ctx[2] && create_if_block_2$2(ctx);
    	let if_block6 = /*stage*/ ctx[0] != 0 && create_if_block_1$3(ctx);
    	let if_block7 = /*stage*/ ctx[0] == 2 && /*password_container*/ ctx[4] != "" && /*password_rule_result*/ ctx[2] && create_if_block$3(ctx);

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
    			add_location(div0, file$8, 265, 8, 6680);
    			attr_dev(input, "id", "password");
    			attr_dev(input, "name", "password");
    			attr_dev(input, "class", "password-field svelte-2z43ps");
    			attr_dev(input, "type", "password");
    			add_location(input, file$8, 289, 16, 7671);
    			attr_dev(div1, "class", "field-wrap svelte-2z43ps");
    			add_location(div1, file$8, 288, 12, 7630);
    			if (!src_url_equal(img.src, img_src_value = "/icons/crop_bar.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "4");
    			attr_dev(img, "width", "200");
    			add_location(img, file$8, 292, 12, 7836);
    			attr_dev(div2, "class", "form-wrap svelte-2z43ps");
    			add_location(div2, file$8, 287, 8, 7594);
    			attr_dev(div3, "class", "password-requirement-container svelte-2z43ps");
    			add_location(div3, file$8, 295, 8, 7927);
    			attr_dev(div4, "class", "container svelte-2z43ps");
    			add_location(div4, file$8, 264, 4, 6648);
    			attr_dev(div5, "class", "set-user-password-wrap svelte-2z43ps");
    			add_location(div5, file$8, 263, 0, 6607);
    			attr_dev(div6, "class", "sub-navbar-left svelte-2z43ps");
    			add_location(div6, file$8, 341, 4, 9920);
    			attr_dev(div7, "class", "sub-navbar-right svelte-2z43ps");
    			add_location(div7, file$8, 346, 4, 10070);
    			attr_dev(div8, "class", "sub-navbar-wrap svelte-2z43ps");
    			add_location(div8, file$8, 340, 0, 9886);
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
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].long_enough) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(div3, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].has_specialcase) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_4(ctx);
    					if_block3.c();
    					if_block3.m(div3, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!/*password_rule_result*/ ctx[2] && !/*password_rule_detail*/ ctx[1].no_whitespace) {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_3$1(ctx);
    					if_block4.c();
    					if_block4.m(div3, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*password_rule_result*/ ctx[2]) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_2$2(ctx);
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
    					if_block6 = create_if_block_1$3(ctx);
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
    					if_block7 = create_if_block$3(ctx);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<SetPassword> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { stage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetPassword",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get stage() {
    		throw new Error("<SetPassword>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<SetPassword>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/forms/SignIn.svelte generated by Svelte v3.49.0 */

    const { console: console_1$2 } = globals;
    const file$7 = "src/forms/SignIn.svelte";

    // (106:8) {:else}
    function create_else_block$1(ctx) {
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
    			add_location(h3, file$7, 106, 12, 2468);
    			if (!src_url_equal(img.src, img_src_value = "/icons/svgs/Jae.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "60");
    			add_location(img, file$7, 107, 12, 2500);
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(106:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (104:29) 
    function create_if_block_2$1(ctx) {
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(104:29) ",
    		ctx
    	});

    	return block;
    }

    // (102:29) 
    function create_if_block_1$2(ctx) {
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(102:29) ",
    		ctx
    	});

    	return block;
    }

    // (100:8) {#if stage == 0}
    function create_if_block$2(ctx) {
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(100:8) {#if stage == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2$1, create_else_block$1];
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
    			add_location(div0, file$7, 98, 4, 2071);
    			attr_dev(div1, "class", "content-wrap svelte-1pasrog");
    			add_location(div1, file$7, 97, 0, 2040);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<SignIn> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SignIn",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Loading.svelte generated by Svelte v3.49.0 */

    const file$6 = "src/Loading.svelte";

    function create_fragment$6(ctx) {
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
    			add_location(img, file$6, 19, 4, 304);
    			attr_dev(div, "class", "pizza-spinner-wrap");
    			add_location(div, file$6, 18, 0, 267);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Content_views/Home_views/Frame.svelte generated by Svelte v3.49.0 */

    const file$5 = "src/Content_views/Home_views/Frame.svelte";

    function create_fragment$5(ctx) {
    	let div7;
    	let div4;
    	let div0;
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let div5;
    	let img;
    	let img_src_value;
    	let t6;
    	let div6;
    	let t7;
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			t0 = text(/*blogger*/ ctx[0]);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text(/*title*/ ctx[1]);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(/*date*/ ctx[4]);
    			t5 = space();
    			div5 = element("div");
    			img = element("img");
    			t6 = space();
    			div6 = element("div");
    			t7 = text("\"");
    			t8 = text(/*memes*/ ctx[2]);
    			t9 = text("\"");
    			attr_dev(div0, "class", "blogger svelte-1apyrdb");
    			add_location(div0, file$5, 83, 8, 1434);
    			attr_dev(div1, "class", "title-wrap");
    			add_location(div1, file$5, 87, 12, 1548);
    			attr_dev(div2, "class", "date-wrap");
    			add_location(div2, file$5, 90, 12, 1628);
    			attr_dev(div3, "class", "title-date-container svelte-1apyrdb");
    			add_location(div3, file$5, 86, 8, 1501);
    			attr_dev(div4, "class", "blog-header svelte-1apyrdb");
    			add_location(div4, file$5, 82, 4, 1400);
    			if (!src_url_equal(img.src, img_src_value = /*blog*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "sample svelte-1apyrdb");
    			add_location(img, file$5, 96, 8, 1752);
    			attr_dev(div5, "class", "blog svelte-1apyrdb");
    			add_location(div5, file$5, 95, 4, 1725);
    			attr_dev(div6, "class", "memes svelte-1apyrdb");
    			add_location(div6, file$5, 98, 4, 1803);
    			attr_dev(div7, "class", "home-container svelte-1apyrdb");
    			add_location(div7, file$5, 81, 0, 1367);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div4);
    			append_dev(div4, div0);
    			append_dev(div0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div5, img);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, t7);
    			append_dev(div6, t8);
    			append_dev(div6, t9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*blogger*/ 1) set_data_dev(t0, /*blogger*/ ctx[0]);
    			if (dirty & /*title*/ 2) set_data_dev(t2, /*title*/ ctx[1]);
    			if (dirty & /*date*/ 16) set_data_dev(t4, /*date*/ ctx[4]);

    			if (dirty & /*blog*/ 8 && !src_url_equal(img.src, img_src_value = /*blog*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*memes*/ 4) set_data_dev(t8, /*memes*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
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
    	validate_slots('Frame', slots, []);
    	let { blogger = "Jae" } = $$props;
    	let { title = "mocking jae mocking jay" } = $$props;
    	let { memes = {} } = $$props;
    	let { blog = "/icons/svgs/Global_panel.svg" } = $$props;
    	let { date = "2022.12.12" } = $$props;
    	const writable_props = ['blogger', 'title', 'memes', 'blog', 'date'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Frame> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('blogger' in $$props) $$invalidate(0, blogger = $$props.blogger);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('memes' in $$props) $$invalidate(2, memes = $$props.memes);
    		if ('blog' in $$props) $$invalidate(3, blog = $$props.blog);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    	};

    	$$self.$capture_state = () => ({ blogger, title, memes, blog, date });

    	$$self.$inject_state = $$props => {
    		if ('blogger' in $$props) $$invalidate(0, blogger = $$props.blogger);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('memes' in $$props) $$invalidate(2, memes = $$props.memes);
    		if ('blog' in $$props) $$invalidate(3, blog = $$props.blog);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [blogger, title, memes, blog, date];
    }

    class Frame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			blogger: 0,
    			title: 1,
    			memes: 2,
    			blog: 3,
    			date: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Frame",
    			options,
    			id: create_fragment$5.name
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
    }

    /* src/Content_views/Home_views/Home.svelte generated by Svelte v3.49.0 */
    const file$4 = "src/Content_views/Home_views/Home.svelte";

    function create_fragment$4(ctx) {
    	let div17;
    	let frame;
    	let t0;
    	let div7;
    	let div4;
    	let div0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div5;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div6;
    	let t5;
    	let div9;
    	let div8;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let h41;
    	let t7;
    	let h40;
    	let t8;
    	let div15;
    	let div14;
    	let div10;
    	let t9;
    	let div13;
    	let div11;
    	let t10;
    	let div12;
    	let t11;
    	let div16;
    	let current;

    	frame = new Frame({
    			props: {
    				blogger: /*blogger*/ ctx[0],
    				title: /*title*/ ctx[1],
    				date: /*date*/ ctx[4],
    				memes: /*memes*/ ctx[2],
    				blog: /*blog*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			create_component(frame.$$.fragment);
    			t0 = space();
    			div7 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div5 = element("div");
    			img0 = element("img");
    			t4 = space();
    			div6 = element("div");
    			t5 = space();
    			div9 = element("div");
    			div8 = element("div");
    			img1 = element("img");
    			t6 = space();
    			h41 = element("h4");
    			t7 = text("- June. 3. 2020");
    			h40 = element("h4");
    			t8 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div10 = element("div");
    			t9 = space();
    			div13 = element("div");
    			div11 = element("div");
    			t10 = space();
    			div12 = element("div");
    			t11 = space();
    			div16 = element("div");
    			attr_dev(div0, "class", "blogger svelte-f77waz");
    			add_location(div0, file$4, 110, 10, 2200);
    			attr_dev(div1, "class", "title-wrap");
    			add_location(div1, file$4, 113, 14, 2298);
    			attr_dev(div2, "class", "date-wrap");
    			add_location(div2, file$4, 115, 14, 2358);
    			attr_dev(div3, "class", "title-date-container svelte-f77waz");
    			add_location(div3, file$4, 112, 10, 2249);
    			attr_dev(div4, "class", "blog-header svelte-f77waz");
    			add_location(div4, file$4, 109, 6, 2164);
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/svgs/Global_panel.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "sample svelte-f77waz");
    			add_location(img0, file$4, 120, 10, 2469);
    			attr_dev(div5, "class", "blog svelte-f77waz");
    			add_location(div5, file$4, 119, 6, 2440);
    			attr_dev(div6, "class", "memes svelte-f77waz");
    			add_location(div6, file$4, 122, 6, 2544);
    			attr_dev(div7, "class", "home-container svelte-f77waz");
    			add_location(div7, file$4, 108, 4, 2129);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/DATE_word.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "9px");
    			add_location(img1, file$4, 127, 12, 2673);
    			add_location(h40, file$4, 128, 49, 2773);
    			attr_dev(h41, "class", "date-line svelte-f77waz");
    			add_location(h41, file$4, 128, 12, 2736);
    			attr_dev(div8, "class", "date-line-wrap svelte-f77waz");
    			add_location(div8, file$4, 126, 8, 2632);
    			attr_dev(div9, "class", "date-line-container svelte-f77waz");
    			add_location(div9, file$4, 125, 4, 2590);
    			attr_dev(div10, "class", "blogger svelte-f77waz");
    			add_location(div10, file$4, 134, 10, 2884);
    			attr_dev(div11, "class", "title-wrap");
    			add_location(div11, file$4, 137, 14, 2982);
    			attr_dev(div12, "class", "date-wrap");
    			add_location(div12, file$4, 139, 14, 3042);
    			attr_dev(div13, "class", "title-date-container svelte-f77waz");
    			add_location(div13, file$4, 136, 10, 2933);
    			attr_dev(div14, "class", "blog-header svelte-f77waz");
    			add_location(div14, file$4, 133, 6, 2848);
    			attr_dev(div15, "class", "home-container svelte-f77waz");
    			add_location(div15, file$4, 132, 4, 2813);
    			attr_dev(div16, "class", "home-container svelte-f77waz");
    			add_location(div16, file$4, 144, 4, 3133);
    			attr_dev(div17, "class", "home-wrap svelte-f77waz");
    			add_location(div17, file$4, 106, 0, 2017);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			mount_component(frame, div17, null);
    			append_dev(div17, t0);
    			append_dev(div17, div7);
    			append_dev(div7, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div7, t3);
    			append_dev(div7, div5);
    			append_dev(div5, img0);
    			append_dev(div7, t4);
    			append_dev(div7, div6);
    			append_dev(div17, t5);
    			append_dev(div17, div9);
    			append_dev(div9, div8);
    			append_dev(div8, img1);
    			append_dev(div8, t6);
    			append_dev(div8, h41);
    			append_dev(h41, t7);
    			append_dev(h41, h40);
    			append_dev(div17, t8);
    			append_dev(div17, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div10);
    			append_dev(div14, t9);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div13, t10);
    			append_dev(div13, div12);
    			append_dev(div17, t11);
    			append_dev(div17, div16);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(frame.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(frame.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    			destroy_component(frame);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let blogger = "jae";
    	let title = "me";
    	let memes = {};
    	let blog = "/icons/svgs/Global_panel.svg";
    	let date = "2022.12.12";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Frame, blogger, title, memes, blog, date });

    	$$self.$inject_state = $$props => {
    		if ('blogger' in $$props) $$invalidate(0, blogger = $$props.blogger);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('memes' in $$props) $$invalidate(2, memes = $$props.memes);
    		if ('blog' in $$props) $$invalidate(3, blog = $$props.blog);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [blogger, title, memes, blog, date];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.49.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/Content.svelte";

    // (76:33) 
    function create_if_block_3(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

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
    		source: "(76:33) ",
    		ctx
    	});

    	return block;
    }

    // (74:22) 
    function create_if_block_2(ctx) {
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(74:22) ",
    		ctx
    	});

    	return block;
    }

    // (72:44) 
    function create_if_block_1$1(ctx) {
    	let signin;
    	let current;
    	signin = new SignIn({ $$inline: true });
    	signin.$on("mode", /*modeChange*/ ctx[3]);

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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(72:44) ",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if loaded && !signIn && !loggedIn}
    function create_if_block$1(ctx) {
    	let login_1;
    	let current;
    	login_1 = new Login({ $$inline: true });
    	login_1.$on("mode", /*modeChange*/ ctx[3]);

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
    		source: "(70:4) {#if loaded && !signIn && !loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1] && !/*signIn*/ ctx[2] && !/*loggedIn*/ ctx[0]) return 0;
    		if (/*signIn*/ ctx[2] && /*loaded*/ ctx[1] && !/*loggedIn*/ ctx[0]) return 1;
    		if (!/*loaded*/ ctx[1]) return 2;
    		if (/*loggedIn*/ ctx[0] && /*loaded*/ ctx[1]) return 3;
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
    			add_location(div, file$3, 68, 0, 1361);
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
    	let signIn;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	let loaded = false;
    	var dispatch = createEventDispatcher();
    	let { dev = true } = $$props;
    	let { loggedIn = false } = $$props;

    	//for dev option time set to 0
    	let load_time = 0;

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
    		if ('dev' in $$props) $$invalidate(4, dev = $$props.dev);
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Login,
    		SignIn,
    		Loading,
    		Home,
    		loaded,
    		dispatch,
    		dev,
    		loggedIn,
    		load_time,
    		modeChange,
    		login,
    		signIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('dev' in $$props) $$invalidate(4, dev = $$props.dev);
    		if ('loggedIn' in $$props) $$invalidate(0, loggedIn = $$props.loggedIn);
    		if ('load_time' in $$props) $$invalidate(5, load_time = $$props.load_time);
    		if ('signIn' in $$props) $$invalidate(2, signIn = $$props.signIn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*loaded, load_time*/ 34) {
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

    	$$invalidate(2, signIn = false);
    	return [loggedIn, loaded, signIn, modeChange, dev, load_time];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { dev: 4, loggedIn: 0 });

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

    /* src/Footer.svelte generated by Svelte v3.49.0 */

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

    /* src/Panel.svelte generated by Svelte v3.49.0 */

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
    			attr_dev(img0, "height", "35");
    			add_location(img0, file$1, 32, 5, 586);
    			add_location(a0, file$1, 32, 2, 583);
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/svgs/addWithBorder.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "height", "35");
    			add_location(img1, file$1, 33, 5, 646);
    			add_location(a1, file$1, 33, 2, 643);
    			if (!src_url_equal(img2.src, img2_src_value = "/icons/svgs/Global_panel.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "height", "35");
    			add_location(img2, file$1, 34, 5, 709);
    			add_location(a2, file$1, 34, 2, 706);
    			if (!src_url_equal(img3.src, img3_src_value = "/icons/svgs/locked.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "height", "35");
    			add_location(img3, file$1, 35, 5, 771);
    			add_location(a3, file$1, 35, 2, 768);
    			attr_dev(div0, "class", "panel-wrap svelte-o0tw3l");
    			add_location(div0, file$1, 31, 4, 556);
    			attr_dev(div1, "class", "panel-container svelte-o0tw3l");
    			add_location(div1, file$1, 30, 0, 522);
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

    /* src/App.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (73:4) {:else}
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
    		source: "(73:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#if new_load}
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
    			attr_dev(div, "class", "spin-container svelte-wlumph");
    			add_location(div, file, 69, 8, 1108);
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
    		source: "(69:4) {#if new_load}",
    		ctx
    	});

    	return block;
    }

    // (78:2) {:else}
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
    		source: "(78:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:2) {#if !loggedIn}
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
    		source: "(76:2) {#if !loggedIn}",
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
    			attr_dev(main, "class", "svelte-wlumph");
    			add_location(main, file, 67, 0, 1074);
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
    	let dev = false;
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
