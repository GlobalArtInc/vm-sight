import SettingsService from "@services/settings.service";

class SettingsController {
  public settingsService = new SettingsService();

  public public = async (req, res) => {
    return res.send(await this.settingsService.getPublic());
  };
}

export default SettingsController;
