module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', '139.162.14.211'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'univox_user_registration'),
        username: env('DATABASE_USERNAME', 'root'),
        password: env('DATABASE_PASSWORD', 'yKBd^H2jK%*^'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
