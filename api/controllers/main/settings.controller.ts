import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import {dbQuery} from "../../utils/DB";
import authMiddleware from "../../middleware/auth.middleware";

class SettingsController extends App implements Controller {
    public path = '/settings'
    public router = Router()

    constructor(...props) {
        super(props)
        this.initializeRoutes();
    }

    public getSetting(data, name, defaultValue: any = false) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].key === name) {
                if (typeof defaultValue === 'boolean') {
                    return data[i].value === "true"
                } else {
                    return data[i].value
                }
            }
        }
        if (defaultValue) {
            return defaultValue
        } else if (typeof defaultValue === "string") {
            return ""
        } else if (typeof defaultValue === "number") {
            return 0
        }
        return false
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware)

        this.router.get('/', async (req: IRequest, res: IResponse) => {
            const settings = await dbQuery('SELECT * FROM settings')

            res.send({
                AllowBindMountsForRegularUsers: this.getSetting(settings, 'AllowBindMountsForRegularUsers', false),
                AllowContainerCapabilitiesForRegularUsers: this.getSetting(settings, 'AllowContainerCapabilitiesForRegularUsers', false),
                AllowDeviceMappingForRegularUsers: this.getSetting(settings, 'AllowDeviceMappingForRegularUsers', false),
                AllowPrivilegedModeForRegularUsers: this.getSetting(settings, 'AllowPrivilegedModeForRegularUsers', false),
                AllowStackManagementForRegularUsers: this.getSetting(settings, 'AllowStackManagementForRegularUsers', false),
                AllowVolumeBrowserForRegularUsers: this.getSetting(settings, 'AllowVolumeBrowserForRegularUsers', false),
                AuthenticationMethod: this.getSetting(settings, 'AuthenticationMethod', 1),
                BlackListedLabels: this.getSetting(settings, 'BlackListedLabels', []),
                DisplayDonationHeader: this.getSetting(settings, 'DisplayDonationHeader', false),
                DisplayExternalContributors: this.getSetting(settings, 'DisplayExternalContributors', false),
                EdgeAgentCheckinInterval: this.getSetting(settings, 'EdgeAgentCheckinInterval', 5),
                EnableEdgeComputeFeatures: this.getSetting(settings, 'EnableEdgeComputeFeatures', false),
                EnableHostManagementFeatures: this.getSetting(settings, 'EnableHostManagementFeatures', false),
                EnableTelemetry: this.getSetting(settings, 'EnableTelemetry', true),
                OAuthSettings: {
                    AccessTokenURI: this.getSetting(settings, 'AccessTokenURI', ""),
                    AuthorizationURI: this.getSetting(settings, 'AuthorizationURI', ""),
                    ClientID: this.getSetting(settings, 'ClientID', ""),
                    LogoutURI: this.getSetting(settings, 'LogoutURI', ""),
                    OAuthAutoCreateUsers: this.getSetting(settings, 'OAuthAutoCreateUsers', false),
                    RedirectURI: this.getSetting(settings, 'RedirectURI', ""),
                    ResourceURI: this.getSetting(settings, 'ResourceURI', ""),
                    SSO: this.getSetting(settings, 'SSO', false),
                    Scopes: this.getSetting(settings, 'Scopes', ""),
                    UserIdentifier: this.getSetting(settings, 'UserIdentifier', ""),
                },
                LogoURL: this.getSetting(settings, 'LogoURL', ""),
                SnapshotInterval: this.getSetting(settings, 'SnapshotInterval', "5m"),
                UserSessionTimeout: this.getSetting(settings, 'UserSessionTimeout', "8h")
            })
        })

        this.router.put('/', async (req: IRequest, res: IResponse) => {
            const data = req.body

            for (let key in data) {
                const item = data[key]
                if (typeof item === 'object') {
                    for (let subKey in item) {
                        const query = await dbQuery(`SELECT * FROM settings WHERE key = '${subKey}'`)
                        if (query['length'] > 0) {
                            await dbQuery(`UPDATE settings SET value = '${item[subKey]}' WHERE key = '${subKey}'`)
                        } else {
                            await dbQuery(`INSERT INTO settings VALUES ('${subKey}', '${item[subKey]}')`)
                        }
                    }
                } else {
                    const query = await dbQuery(`SELECT * FROM settings WHERE key = '${key}'`)
                    if (query['length'] > 0) {
                        await dbQuery(`UPDATE settings SET value = '${data[key]}' WHERE key = '${key}'`)
                    } else {
                        await dbQuery(`INSERT INTO settings VALUES ('${key}', '${data[key]}')`)
                    }
                }
            }
            return res.send({status: 200, message: "Settings has been updated."})

        })

    }
}

export default SettingsController