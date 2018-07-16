const DEFAULT_PREFIX = 'vuex-persisted-shared-state';

export default (keys, options = {}) => store => {

    //Check for localStarage exists
    if (typeof window === 'undefined' || !window.localStorage) return;

    //Init options
    let _options = {
        share: options.share || true,
        prefix: options.prefix || DEFAULT_PREFIX,
    };

    //Map _keys to objects
    let _keys = {};
    for(let key in keys) {
        _keys[key] = {
            mutation: typeof _keys[key] == 'object' ? (_keys[key].mutation || null) : _keys[key],
            share: typeof _keys[key] == 'object' ? (_keys[key].share || true) : true,
            defaultValue: typeof _keys[key] == 'object' ? (_keys[key].defaultValue || null) : null,
        };
    }

    //Concat name with prefix
    let getStateName = name => `${_options.prefix}__${name}`;

    //localStorage helpers
    let setStateItem = (name, value) => window.localStorage.setItem(getStateName(name), JSON.stringify(value));
    let getStateItem = name => JSON.parse(window.localStorage.getItem(getStateName(name)));
    let removeStateItem = name => window.localStorage.removeItem(getStateName(name));


    //Check for localStorage has actions
    try {
        setStateItem('@@', 'test');
        removeStateItem('@@');
    } catch (e) {
        return;
    }

    //Commit mutation
    let commit = (key, value) => {
        if(value == null) {
            value = _keys[key].defaultValue;
        }
        store.commit(_keys[key].mutation, value);
    };

    let shouldCommit = (key) => _keys.hasOwnProperty(key) && _keys[key].mutation != null;
    let shouldShare = (key, localStorageKey = null) => {
        if(localStorageKey == null) return true;
        if(_keys[key].share == false) return false;
        return getStateName(key) == localStorageKey;
    };

    let fillStore = () => {
        for(let key in _keys) {
            if(shouldCommit(key)) {
                commit(key, getStateItem(key));
            }
        }
    };

    //Init commit
    if(window.hasOwnProperty('onNuxtReady')) {
        window.onNuxtReady(_ => fillStore());
    } else {
        fillStore();
    }

    //Set localStoarage on store change
    store.subscribe(_ => {
        for(let key in _keys) {
            setStateItem(key, store.state[key]);
        }
    });

    //Watch localStorage and commit changes
    window.addEventListener('storage', event => {
        if (!_options.share) return;

        let localStorageKey = event.key;
        let newValue = JSON.parse(event.newValue);

        for(let key in _keys) {
            if(shouldCommit(key) && shouldShare(key, localStorageKey)) {
                commit(key, localStorageKey == null ? null : newValue);
            }
        }
    });
};