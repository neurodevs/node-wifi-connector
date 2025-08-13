# node-wifi-connector
Connect and disconnect from Wi-Fi networks in Node.js with minimal effort

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
  - [Platform Notes](#platformnotes)
- [Usage](#usage)
  - [AutoWifiConnector](#autowificonnector)

## Overview
node-wifi-connector is a lightweight utility that wraps the node-wifi library and adds OS-specific disconnect handling for macOS.
On Linux and Windows, disconnect calls go directly through node-wifi. On macOS, where node-wifi’s disconnect() is not implemented, the package toggles the Wi-Fi adapter off and back on via networksetup to ensure a clean disconnect.

## Installation
Install the package with your preferred package manager (run inside your Node project):

npm install @neurodevs/node-wifi-connector

Or with yarn:

yarn add @neurodevs/node-wifi-connector

### Platform Notes 
- Linux and Windows: Uses node-wifi for connect() and disconnect().
- macOS (darwin): Uses networksetup to toggle Wi-Fi off and on for disconnect(), ensuring it works even though node-wifi’s disconnect() is not supported.
- Service name: Defaults to "Wi-Fi". If your network service is renamed or localized, you may need to adjust the command in the source.

## Usage

### AutoWifiConnector

```typescript
import AutoWifiConnector from '@neurodevs/node-wifi-connector'

async function main() {
    // Create and connect on creation
    const wifi = await AutoWifiConnector.Create({
        ssid: 'MyNetwork',
        password: 'SuperSecretPassword',
        connectOnCreate: true
    })
    console.log('Connected to Wi-Fi')

    // Wait to allow time for network to connect
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Disconnect later
    await wifi.disconnect()
    console.log('Disconnected from Wi-Fi')
}

main().catch(err => {
    console.error('Error:', err)
})
```
