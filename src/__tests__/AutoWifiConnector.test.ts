import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import AutoWifiConnector, { WifiConnector } from '../modules/AutoWifiConnector'
import FakeNodeWifi from '../testDoubles/FakeNodeWifi'

export default class AutoWifiConnectorTest extends AbstractSpruceTest {
    private static instance: WifiConnector

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeNodeWifi()

        this.instance = this.AutoWifiConnector()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async initializesWifiModule() {
        assert.isEqualDeep(
            FakeNodeWifi.callsToInit[0],
            { iface: null },
            'Need to initialize wifi module!'
        )
    }

    @test()
    protected static async callsConnectOnWifiModule() {
        assert.isEqualDeep(
            FakeNodeWifi.callsToConnect[0],
            { ssid: this.ssid, password: this.password },
            'Need to call connect on wifi module!'
        )
    }

    private static setFakeNodeWifi() {
        AutoWifiConnector.wifi = new FakeNodeWifi() as any
        FakeNodeWifi.resetTestDouble()
    }

    private static ssid = generateId()
    private static password = generateId()

    private static AutoWifiConnector() {
        return AutoWifiConnector.Create({
            ssid: this.ssid,
            password: this.password,
        })
    }
}
