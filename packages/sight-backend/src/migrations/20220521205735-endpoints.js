const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('endpoints', {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        notNull: true,
      },
      name: {
        type: DataTypes.STRING,
        notNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        notNull: true,
      },
      public_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      host: {
        type: DataTypes.STRING,
        notNull: true,
      },
      groupId: {
        type: DataTypes.INTEGER,
        notNull: true,
        defaultValue: 0,
      },
      tags: {
        type: DataTypes.STRING,
      },
      tls: {
        type: DataTypes.INTEGER,
        length: 1,
        defaultValue: 0,
      },
      tls_ca: {
        type: DataTypes.INTEGER,
        length: 1,
        defaultValue: 0,
      },
      tls_cert: {
        type: DataTypes.INTEGER,
        length: 1,
        defaultValue: 0,
      },
      tls_key: {
        type: DataTypes.INTEGER,
        length: 1,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface) {
    queryInterface.dropTable('endpoints');
  },
};
