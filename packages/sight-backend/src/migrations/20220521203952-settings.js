const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('settings', {
      key: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      value: {
        type: DataTypes.STRING,
        notNull: true
      }
    });
    await queryInterface.bulkInsert('settings', [
      { key: 'LogoURL', value: '' },
      { key: 'AuthenticationMethod', value: '1' },
      { key: 'OAuthClientID', value: '' },
      { key: 'OAuthClientSecret', value: '' },
      { key: 'OAuthAuthorizationURL', value: '' },
      { key: 'OAuthAccessTokenURL', value: '' },
      { key: 'OAuthRedirectURL', value: '' },
      { key: 'OAuthUserIdentifier', value: '' },
      { key: 'OAuthScopes', value: '' },
      { key: 'SnapshotInterval', value: '5m' },
      { key: 'UserSessionTimeout', value: '8h' }
    ]);
  },

  async down(queryInterface) {
    queryInterface.dropTable('settings');
  }
};
