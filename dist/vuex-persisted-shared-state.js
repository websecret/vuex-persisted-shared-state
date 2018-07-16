'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a},DEFAULT_PREFIX='vuex-persisted-shared-state';exports.default=function(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:{};return function(c){if('undefined'!=typeof window&&window.localStorage){var d={share:b.share||!0,prefix:b.prefix||DEFAULT_PREFIX},e={};for(var n in a)e[n]={mutation:'object'==_typeof(a[n])?a[n].mutation||null:a[n],share:'object'!=_typeof(a[n])||a[n].share||!0,defaultValue:'object'==_typeof(a[n])?a[n].defaultValue||null:null};var f=function(a){return d.prefix+'__'+a},g=function(a,b){return window.localStorage.setItem(f(a),JSON.stringify(b))},h=function(a){return JSON.parse(window.localStorage.getItem(f(a)))},i=function(a){return window.localStorage.removeItem(f(a))};try{g('@@','test'),i('@@')}catch(a){return}var j=function(a,b){null==b&&(b=e[a].defaultValue),c.commit(e[a].mutation,b)},k=function(a){return e.hasOwnProperty(a)&&null!=e[a].mutation},l=function(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;return null==b||!1!=e[a].share&&f(a)==b},m=function(){for(var a in e)k(a)&&j(a,h(a))};window.hasOwnProperty('onNuxtReady')?window.onNuxtReady(function(){return m()}):m(),c.subscribe(function(){for(var a in e)g(a,c.state[a])}),window.addEventListener('storage',function(a){if(d.share){var b=a.key,c=JSON.parse(a.newValue);for(var f in e)k(f)&&l(f,b)&&j(f,null==b?null:c)}})}}},module.exports=exports['default'];
