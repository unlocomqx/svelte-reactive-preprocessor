let double;
$: { let svrp_start = Date.now(); let svrp_exec = Math.random(); let start_state = eval("$$self.$capture_state && $$self.$capture_state()"); rpDsp('SvelteReactiveStart', {statement: "double = count * 2", filename: "", line: 0, id: "ABCD"}, svrp_start, svrp_exec, start_state); double = count * 2; rpDsp('SvelteReactiveEnd', {statement: "double = count * 2", filename: "", line: 0, id: "ABCD"}, svrp_start, svrp_exec, start_state, eval("$$self.$capture_state && $$self.$capture_state()")); }
 var rpGlobal = typeof window !== "undefined" ? window : global; 

 rpGlobal.rpDsp = rpGlobal.rpDsp || function() {}; 

rpDsp('SvelteReactiveEnable', {version: "0.8.2"});