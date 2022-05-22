const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    queryInterface.createTable('snapshots', {
      endpoint_id: {
        primaryKey: true,
        type: DataTypes.STRING,
        notNull: true
      },
      data: {
        type: DataTypes.TEXT,
        notNull: true
      },
      createdAt: {
        type: DataTypes.INTEGER,
        notNull: true
      }
    });
  },

  async down(queryInterface) {
    queryInterface.dropTable('snapshots');
  }
};
