(() => {
  const memoryStore = new Map();

  const storage = {
    getData(key) {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key);
        }
      } catch (_) {
        // Fall back to the in-memory store below.
      }

      return memoryStore.has(key) ? memoryStore.get(key) : null;
    },

    searchData(key) {
      const prefix = String(key);
      const results = [];

      try {
        if (typeof localStorage !== 'undefined') {
          for (let i = 0; i < localStorage.length; i += 1) {
            const storedKey = localStorage.key(i);
            if (storedKey && storedKey.startsWith(prefix)) {
              results.push({ key: storedKey, data: localStorage.getItem(storedKey) });
            }
          }
          return results;
        }
      } catch (_) {
        // Fall back to the in-memory store below.
      }

      for (const [storedKey, data] of memoryStore.entries()) {
        if (storedKey.startsWith(prefix)) {
          results.push({ key: storedKey, data });
        }
      }

      return results;
    },

    setData(key, data) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, data);
          return data;
        }
      } catch (_) {
        // Fall back to the in-memory store below.
      }

      memoryStore.set(key, data);
      return data;
    },

    deleteData(key) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
          return;
        }
      } catch (_) {
        // Fall back to the in-memory store below.
      }

      memoryStore.delete(key);
    },
  };

  if (typeof window.GetDataStorage !== 'function') {
    window.GetDataStorage = () => storage;
  }

  if (typeof window.GetStoredData !== 'function') {
    window.GetStoredData = (key) => storage.getData(key);
  }

  if (typeof window.SearchStoredData !== 'function') {
    window.SearchStoredData = (key) => storage.searchData(key);
  }

  if (typeof window.SetStoredData !== 'function') {
    window.SetStoredData = (key, data) => storage.setData(key, data);
  }

  if (typeof window.DeleteStoredData !== 'function') {
    window.DeleteStoredData = (key) => storage.deleteData(key);
  }

  if (typeof window.OnDataStorageReady === 'function') {
    window.OnDataStorageReady();
  }
})();
