import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  console.log("Function `get-top-scorers` invoked");

  /* construct the fauna query */
  return client
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index("topscorers_by_score_desc")), {size: 100}),
        q.Lambda(["name", "ref"], q.Get(q.Var("ref")))
      )
    )
    .then((response) => {
      console.log("success", response);
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
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
