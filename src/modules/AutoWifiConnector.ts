import wifi from 'node-wifi'

export default class AutoWifiConnector implements WifiConnector {
    public static Class?: WifiConnectorConstructor
    public static wifi = wifi

    protected constructor() {
        this.initializeWifiModule()
    }

    public static Create() {
        return new (this.Class ?? this)()
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
