const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OBJECT;

const serviceBuilder = () => {
  const builder = {};
  builder.withConfig = (config) => {
    builder.config = config;
    return builder;
  };

  builder.build = async () => {
    if (!builder.config) throw new Error('No config found. Insert config with method withConfig.');

    builder.conn = await oracledb.getConnection(builder.config);

    return {
      execute: (sql, params = []) => builder.conn
        .execute(sql, params, {})
        .then(({ rows }) => rows),
      commit: () => builder.conn.commit(),
      close: () => builder.conn.close(),
    };
  };

  return builder;
};

module.exports = serviceBuilder;
