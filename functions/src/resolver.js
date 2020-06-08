module.exports = function ({ store }) {
  const self = {};
  self.getList = async (parent, args, context, info) => {
    const { type } = args;
    try {
      const data = await store.findDocuments({ collection: type });
      return data;
    } catch (e) {
      return e;
    }
  };
  self.getOne = async (parent, args, context, info) => {
    const { type, id } = args;
    try {
      const data = await store.findDocumentById({
        collection: type,
        id: id,
      });
      return data;
    } catch (e) {
      return e;
    }
  };
  self.createOne = async (parent, args, context, info) => {
    const { type, id, payload } = args;
    try {
      await store.createDocument({
        collection: type,
        id: id,
        payload: JSON.parse(payload),
      });
      return { payload };
    } catch (e) {
      return e;
    }
  };

  self.updateOne = async (parent, args, context, info) => {
    const { type, id, payload } = args;
    try {
      await store.updateDocument({
        collection: type,
        id: id,
        payload: JSON.parse(payload),
      });
      return { payload };
    } catch (e) {
      return e;
    }
  };

  // for post
  self.getPostList = async (parent, args, context, info) => {};
  self.getPost = async (parent, args, context, info) => {
    const { post_id } = args;
    try {
      const data = await store.findDocumentByField({
        collection: "post",
        field: "post_id",
        value: post_id,
      });
      return data;
    } catch (e) {
      return e;
    }
  };

  return self;
};
