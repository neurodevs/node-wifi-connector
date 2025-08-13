# node-wifi-connector
Connect and disconnect from Wi-Fi networks in Node.js with minimal effort

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
  - [Platform Notes](#platformnotes)
- [Usage](#usage)
  - [AutoWifiConnector](#autowificonnector)

## Overview
node-wifi-connector is a lightweight utility that wraps the node-wifi library to provide a simple, minimal-effort interface for connecting to and disconnecting from Wi-Fi networks in Node.js.

## Installation
Install the package with your preferred package manager (run inside your Node project):

`npm install @neurodevs/node-wifi-connector`

Or with yarn:

`yarn add @neurodevs/node-wifi-connector`

### Platform Notes
- Linux/Windows: connect() and disconnect() use node-wifi directly.
- macOS (darwin): node-wifi does not implement disconnect() for macOS, so this package uses networksetup to toggle Wi-Fi off/on for a reliable disconnect. Adjust network priority to prevent auto-reconnect to the network you just disconnected.
- Service name defaults to "Wi-Fi"; update in source if renamed or localized. 

## Usage

### AutoWifiConnector

```typescript
import AutoWifiConnector from '@neurodevs/node-wifi-connector'

async function main() {
    const wifi = await AutoWifiConnector.Create({
        ssid: 'MyNetwork',
        password: 'SuperSecretPassword',
        connectOnCreate: true
    })
    console.log('Connected to Wi-Fi')

    await new Promise((resolve) => setTimeout(resolve, 5000))

    await wifi.disconnect()
    console.log('Disconnected from Wi-Fi')
}

main().catch(err => {
    console.error('Error:', err)
})
```
