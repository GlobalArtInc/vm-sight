const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en',
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('users_external', {
      user_id: {
        primaryKey: true,
        type: DataTypes.STRING,
        notNull: true,
      },
      identity: {
        type: DataTypes.STRING,
        notNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('users_external');
  },
};
