import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
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
            'Need to initialize wifi module with null iface!'
        )
    }

    private static setFakeNodeWifi() {
        AutoWifiConnector.wifi = new FakeNodeWifi() as any
        FakeNodeWifi.resetTestDouble()
    }

    private static AutoWifiConnector() {
        return AutoWifiConnector.Create()
    }
}
