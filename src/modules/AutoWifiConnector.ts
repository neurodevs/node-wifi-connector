import wifi, { ConnectionOpts } from 'node-wifi'

export default class AutoWifiConnector implements WifiConnector {
    public static Class?: WifiConnectorConstructor
    public static wifi = wifi

    protected constructor() {
        this.initializeWifiModule()
    }

    public static async Create(options: ConnectionOpts) {
        const instance = new (this.Class ?? this)()
        await this.wifi.connect(options)
        return instance
    }

    private initializeWifiModule() {
        this.wifi.init({ iface: null })
    }

    private get wifi() {
        return AutoWifiConnector.wifi
    }
}

export interface WifiConnector {}

export type WifiConnectorConstructor = new () => WifiConnector
