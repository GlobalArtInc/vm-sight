const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        notNull: true
      },
      username: {
        unique: true,
        type: DataTypes.STRING,
        notNull: true
      },
      password: {
        type: DataTypes.STRING,
        notNull: true
      },
      role: {
        type: DataTypes.INTEGER,
        notNull: true
      },
      createdAt: {
        type: DataTypes.INTEGER,
        notNull: true
      },
      updatedAt: {
        type: DataTypes.INTEGER,
        notNull: true
      }
    });
    await queryInterface.createTable('users_external', {
      user_id: {
        primaryKey: true,
        type: DataTypes.STRING,
        notNull: true
      },
      identity: {
        type: DataTypes.STRING,
        notNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('users_external');
  }
};