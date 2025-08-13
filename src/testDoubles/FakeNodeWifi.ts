import { InitConfig } from 'node-wifi'

export default class FakeNodeWifi {
    public static callsToInit: InitConfig[] = []

    public constructor() {}

    public init(options: InitConfig) {
        FakeNodeWifi.callsToInit.push(options)
    }

    public static resetTestDouble() {
        FakeNodeWifi.callsToInit = []
    }
}
