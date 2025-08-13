export default class AutoWifiConnector implements WifiConnector {
    public static Class?: WifiConnectorConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface WifiConnector {}

export type WifiConnectorConstructor = new () => WifiConnector
