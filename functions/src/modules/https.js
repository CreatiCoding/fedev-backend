module.exports = function ({ functions, exports }) {
  const controller = exports;
  return {
    run: function ({ app }) {
      controller.helloWorld = functions.https.onRequest((request, response) => {
        request;
        response.send("Hello from Firebase!");
      });

      // http://localhost:5001/fedev-backend/us-central1/api/graphql?query={posts{title%20post_id}}
      // https://us-central1-graphql-fd-realword.cloudfunctions.net/api/graphql?query=%7Bposts%7Btitle%20post_id%7D%7D
      controller.api = functions.https.onRequest(app);

      console.log("https load completed");
    },
  };
};
