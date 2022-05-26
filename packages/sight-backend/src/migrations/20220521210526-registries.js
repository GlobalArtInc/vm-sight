const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registries', {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        notNull: true,
      },
      user_id: {
        type: DataTypes.STRING,
        notNull: true,
      },
      type: {
        type: DataTypes.STRING,
        notNull: true,
      },
      name: {
        type: DataTypes.STRING,
        notNull: true,
      },
      url: {
        type: DataTypes.STRING,
      },
      login: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        notNull: true,
      },
    });
    await queryInterface.bulkInsert('registries', [
      {
        id: 'dockerhub',
        user_id: 0,
        type: 'dockerhub',
        name: 'DockerHub',
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registries');
  },
};
