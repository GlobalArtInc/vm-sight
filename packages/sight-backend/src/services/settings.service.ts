import { SettingsModel } from '../models';
import { appVersion } from '../constants';
import { getSetting } from '@utils/util';

class SettingsService {
  public settingsModel = SettingsModel;

  public async getSettings() {
    const settings = await this.settingsModel.getSettings();
    return {
      AllowBindMountsForRegularUsers: getSetting(settings, 'AllowBindMountsForRegularUsers', false),
      AllowContainerCapabilitiesForRegularUsers: getSetting(settings, 'AllowContainerCapabilitiesForRegularUsers', false),
      AllowDeviceMappingForRegularUsers: getSetting(settings, 'AllowDeviceMappingForRegularUsers', false),
      AllowPrivilegedModeForRegularUsers: getSetting(settings, 'AllowPrivilegedModeForRegularUsers', false),
      AllowStackManagementForRegularUsers: getSetting(settings, 'AllowStackManagementForRegularUsers', false),
      AllowVolumeBrowserForRegularUsers: getSetting(settings, 'AllowVolumeBrowserForRegularUsers', false),
      AuthenticationMethod: getSetting(settings, 'AuthenticationMethod', 1),
      BlackListedLabels: getSetting(settings, 'BlackListedLabels', []),
      DisplayDonationHeader: getSetting(settings, 'DisplayDonationHeader', false),
      DisplayExternalContributors: getSetting(settings, 'DisplayExternalContributors', false),
      EdgeAgentCheckinInterval: getSetting(settings, 'EdgeAgentCheckinInterval', 5),
      EnableEdgeComputeFeatures: getSetting(settings, 'EnableEdgeComputeFeatures', false),
      EnableHostManagementFeatures: getSetting(settings, 'EnableHostManagementFeatures', false),
      EnableTelemetry: getSetting(settings, 'EnableTelemetry', true),
      OAuthSettings: {
        AccessTokenURI: getSetting(settings, 'AccessTokenURI', ''),
        AuthorizationURI: getSetting(settings, 'AuthorizationURI', ''),
        ClientID: getSetting(settings, 'ClientID', ''),
        LogoutURI: getSetting(settings, 'LogoutURI', ''),
        OAuthAutoCreateUsers: getSetting(settings, 'OAuthAutoCreateUsers', false),
        RedirectURI: getSetting(settings, 'RedirectURI', ''),
        ResourceURI: getSetting(settings, 'ResourceURI', ''),
        SSO: getSetting(settings, 'SSO', false),
        Scopes: getSetting(settings, 'Scopes', ''),
        UserIdentifier: getSetting(settings, 'UserIdentifier', ''),
      },
      LogoURL: getSetting(settings, 'LogoURL', ''),
      SnapshotInterval: getSetting(settings, 'SnapshotInterval', '5m'),
      UserSessionTimeout: getSetting(settings, 'UserSessionTimeout', '8h'),
    };
  }

  public async getPublic() {
    const settings = await this.settingsModel.getSettings();
    const OAuthLoginURI = `${getSetting(settings, 'AuthorizationURI', '')}?response_type=code&client_id=${getSetting(
      settings,
      'ClientID',
      '',
    )}&redirect_uri=${getSetting(settings, 'RedirectURI', '')}&scope=${getSetting(settings, 'Scopes', '')}`;
    return {
      Version: appVersion,
      AuthenticationMethod: getSetting(settings, 'AuthenticationMethod', 1),
      EnableEdgeComputeFeatures: getSetting(settings, 'EnableEdgeComputeFeatures', false),
      EnableTelemetry: getSetting(settings, 'EnableTelemetry', true),
      LogoURL: getSetting(settings, 'LogoURL', ''),
      OAuthLoginURI,
      OAuthLogoutURI: getSetting(settings, 'LogoutURI', ''),
    };
  }
}

export default SettingsService;
