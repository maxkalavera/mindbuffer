import knex from "knex";

export default async function (queries: knex.Knex<any, unknown[]>, id: string) {
  await (require(`../seeds/${id}`).default(queries))
}