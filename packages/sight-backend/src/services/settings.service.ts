import {SettingsModel} from "../models";
import {appVersion} from "../constants";
import {getSetting} from "../utils/util";

class SettingsService {
    public settingsModel = SettingsModel;

    public async getPublic() {
        const settings = await this.settingsModel.getSettings();
        const OAuthLoginURI = `${getSetting(settings, 'AuthorizationURI', "")}?response_type=code&client_id=${getSetting(settings, 'ClientID', "")}&redirect_uri=${getSetting(settings, 'RedirectURI', "")}&scope=${getSetting(settings, 'Scopes', "")}`
        return {
            Version: appVersion,
            AuthenticationMethod: getSetting(settings, 'AuthenticationMethod', 1),
            EnableEdgeComputeFeatures: getSetting(settings, 'EnableEdgeComputeFeatures', false),
            EnableTelemetry: getSetting(settings, 'EnableTelemetry', true),
            LogoURL: getSetting(settings, 'LogoURL', ""),
            OAuthLoginURI,
            OAuthLogoutURI: getSetting(settings, 'LogoutURI', ""),

        }
    }
}

export default SettingsService
