# TrustCred Wallet Integration

This document describes the production-ready Stacks wallet integration implemented in TrustCred.

## Overview

TrustCred uses the official Stacks.js libraries to provide secure, production-ready wallet connections for Stacks blockchain interactions. The integration supports multiple wallet providers and handles both mainnet and testnet networks.

## Architecture

### Components

1. **ConnectWalletModal** (`components/connect-wallet-modal.tsx`)
   - User interface for wallet selection and connection
   - Network toggle (mainnet/testnet)
   - Wallet installation detection
   - Connection status display

2. **WalletManager** (`lib/wallet.ts`)
   - Singleton class for wallet operations
   - Handles wallet connection logic
   - Manages connection state persistence
   - Provides clean API for wallet operations

### Supported Wallets

- **Hiro Wallet** - Official Stacks wallet with full DeFi support
- **Xverse** - Bitcoin & Stacks wallet with native DeFi support
- **Leather** - Open-source Stacks wallet
- **Asigna** - Multi-signature Stacks wallet

## Installation

The wallet integration requires the following Stacks.js packages:

```bash
npm install @stacks/connect @stacks/wallet-sdk @stacks/transactions @stacks/network
```

## Usage

### Basic Wallet Connection

```typescript
import { walletManager } from '../lib/wallet';

// Connect to a specific wallet
try {
  const result = await walletManager.connectWallet('Hiro Wallet', 'testnet');
  console.log('Connected addresses:', result.addresses);
  console.log('Wallet type:', result.walletType);
  console.log('Network:', result.network);
} catch (error) {
  console.error('Connection failed:', error);
}
```

### Check Connection Status

```typescript
const connectionInfo = walletManager.getStoredConnectionInfo();

if (connectionInfo.isConnected) {
  console.log('Wallet type:', connectionInfo.walletType);
  console.log('Network:', connectionInfo.network);
  console.log('Stacks address:', connectionInfo.stacksAddress);
}
```

### Disconnect Wallet

```typescript
walletManager.disconnect();
```

## Features

### Network Support
- **Testnet**: For development and testing
- **Mainnet**: For production use

### Wallet Detection
- Automatically detects installed wallet extensions
- Provides install links for missing wallets
- Graceful fallback for unsupported wallets

### Security
- Secure connection handling
- Local storage for connection persistence
- Proper error handling and user feedback

### User Experience
- Beautiful, responsive modal design
- Real-time connection status
- Clear error messages
- Loading states and animations

## Implementation Details

### Wallet Connection Flow

1. **User Selection**: User selects a wallet from the modal
2. **Installation Check**: System verifies wallet is installed
3. **Connection Request**: Opens wallet connection dialog
4. **Address Extraction**: Extracts Stacks and Bitcoin addresses
5. **State Persistence**: Stores connection info in localStorage
6. **Success Feedback**: Shows connection success and closes modal

### Error Handling

The system handles various error scenarios:
- Wallet not installed
- User cancellation
- Network connection failures
- Unexpected errors

### State Management

Connection state is managed through:
- React state for UI updates
- localStorage for persistence
- WalletManager for business logic

## Production Considerations

### Security
- All wallet interactions use official Stacks.js libraries
- No private keys are stored or transmitted
- Connection state is validated before use

### Performance
- Lazy loading of wallet detection
- Efficient state updates
- Minimal re-renders

### Compatibility
- Supports all major Stacks wallets
- Works across different browsers
- Responsive design for mobile devices

## Testing

### Development
- Test with testnet network
- Use browser developer tools to monitor connections
- Verify localStorage persistence

### Production
- Test with mainnet network
- Verify wallet compatibility
- Test error scenarios

## Troubleshooting

### Common Issues

1. **Wallet Not Detected**
   - Ensure wallet extension is installed
   - Check browser permissions
   - Refresh the page

2. **Connection Fails**
   - Verify network selection
   - Check wallet extension status
   - Clear browser cache if needed

3. **Address Not Displayed**
   - Check wallet connection status
   - Verify network compatibility
   - Review console for errors

### Debug Mode

Enable debug logging by setting:
```typescript
localStorage.setItem('trustcred_debug', 'true');
```

## Future Enhancements

- Multi-wallet support (connect multiple wallets simultaneously)
- Advanced transaction signing
- Contract interaction capabilities
- Wallet backup and recovery
- Enhanced security features

## Resources

- [Stacks.js Documentation](https://docs.stacks.co/stacks.js)
- [Wallet Connect Overview](https://docs.stacks.co/wallet-connect/overview)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [TrustCred Smart Contracts](../trustcred/contracts/)

---

*This integration provides a robust foundation for Stacks blockchain interactions in TrustCred, ensuring security, reliability, and excellent user experience.*
