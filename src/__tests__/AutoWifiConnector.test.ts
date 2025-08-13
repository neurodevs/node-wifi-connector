import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import AutoWifiConnector, { WifiConnector } from '../modules/AutoWifiConnector'

export default class AutoWifiConnectorTest extends AbstractSpruceTest {
    private static instance: WifiConnector

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.AutoWifiConnector()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    private static AutoWifiConnector() {
        return AutoWifiConnector.Create()
    }
}
