const DEFAULT_PREFIX = 'vuex-persisted-shared-state';

export default (mutations, options = {}) => store => {

    //Check for localStarage exists
    if (typeof window === 'undefined' || !window.localStorage) return;

    //Init options
    options = {
        share: options.share || true,
        prefix: options.prefix || DEFAULT_PREFIX,
    };

    //Map mutations to objects
    for(let mutation in mutations) {
        mutations[mutation] = {
            name: typeof mutations[mutation] == 'object' ? mutations[mutation].name : mutations[mutation],
            share: typeof mutations[mutation] == 'object' ? (mutations[mutation].share || true) : true,
            defaultValue: typeof mutations[mutation] == 'object' ? (mutations[mutation].defaultValue || null) : null,
        };
    }

    //Concat name with prefix
    let getStateName = name => `${options.prefix}__${name}`;

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
    let commit = (mutation, value) => {
        if(value == null || value.payload == null) {
            value = mutations[mutation].defaultValue;
        } else {
            value = value.payload;
        }
        store.commit(mutation, value);
    };

    let fillStore = () => {
        for(let mutation in mutations) {
            commit(mutation, getStateItem(mutations[mutation].name));
        }
    };

    //Init commit
    if(window.hasOwnProperty('onNuxtReady')) {
        window.onNuxtReady(_ => fillStore());
    } else {
        fillStore();
    }

    //Check for mutation should persist
    let shouldPersist = (mutation) => mutations.hasOwnProperty(mutation.type);
    let shouldShare = (mutation, key = null) => {
        if(key == null) return true;
        if(mutations[mutation].share == false) return false;
        return getStateName(mutations[mutation].name) == key;
    };

    //Set localStoarage on store change
    store.subscribe(mutation => {
        if (shouldPersist(mutation)) {
            setStateItem(mutations[mutation.type].name, mutation);
        }
    });

    //Watch localStorage and commit changes
    window.addEventListener('storage', event => {
        if (!options.share) return;
        let key = event.key;

        let newValue = JSON.parse(event.newValue);

        for(let mutation in mutations) {
            if(shouldShare(mutation, key)) {
                commit(mutation, key == null ? null : newValue);
            }
        }
    });
};