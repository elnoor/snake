import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  /* parse the string body into a useable JS object */
  const newScore = JSON.parse(event.body);
  console.log("Function `create-top-scorer` invoked with data: ", newScore);

  /* construct the fauna query */
  return client
    .query(q.Create(q.Collection("TopScorers"), { data: newScore }))
    .then((response) => {
      console.log("success", response);
      return callback(null, {
        statusCode: 200,
        // body: JSON.stringify(response),
      });
    })
    .catch((error) => {
      console.log("error", error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error),
      });
    });
};
