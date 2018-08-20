class Storage {
    constructor() {
        if (!window.localStorage) {
            alert('不支持localStorage');
        }
        this.storage = window.localStorage;
    }

    set(key, data) {
        return this.storage.setItem(key, JSON.stringify(data));
    }

    get(key) {
        const data = this.storage.getItem(key);
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }

    clear() {
        this.storage.clear();
    }
}

export default new Storage();