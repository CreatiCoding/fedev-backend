module.exports = ({ firestore, store_cache }) => {
  const self = {};

  self.findDocumentByField = async ({ collection, field, value }) => {
    console.log({ field, value });
    if (!collection || !field || !value) return {};
    if (store_cache.has(`${collection}-${field}-${value}`)) {
      return store_cache.get(`${collection}-${field}-${value}`);
    } else {
      const collectionRef = firestore.collection(collection);
      collectionRef
        .where(field, "==", value)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            store_cache.set(`${collection}-${field}-${value}`, data);
            return data;
          });
        });
    }
  };

  self.findDocumentById = async ({ collection, id }) => {
    if (!collection || !id) return {};
    if (store_cache.has(`${collection}-${id}`)) {
      return store_cache.get(`${collection}-${id}`);
    } else {
      const snapshot = await firestore.collection(collection).doc(`${id}`).get({
        source: "cache",
      });
      const data = snapshot.data();
      store_cache.set(`${collection}-${id}`, data);
      return data;
    }
  };

  self.findDocuments = async ({ collection, page_no = 0, page_size = 10 }) => {
    if (!collection) return {};
    if (store_cache.has(`${collection}`)) {
      return store_cache.get(`${collection}`);
    } else {
      const snapshot = await firestore.collection(collection).get({
        source: "cache",
      });
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      store_cache.set(`${collection}`, data);
      return data;
    }
  };

  self.createDocument = async ({ collection, id, payload = {} }) => {
    if (!collection || !id || !Object.keys(payload).length) {
      return {};
    }
    await firestore
      .collection(collection)
      .doc(id)
      .set({
        ...payload,
      });
    store_cache.del(`${collection}`);
    return payload;
  };

  self.updateDocument = async ({ collection, id, payload = {} }) => {
    if (!collection || !id || !Object.keys(payload).length) {
      return {};
    }
    await firestore
      .collection(collection)
      .doc(id)
      .update({
        ...payload,
      });
    store_cache.del(`${collection}`);
    store_cache.del(`${collection}-${id}`);
    return { id, ...payload };
  };
  return self;
};
