import { showConnect, isStacksWalletInstalled, UserSession } from '@stacks/connect';

export interface WalletAddress {
  address: string;
  publicKey: string;
  purpose: 'payment' | 'ordinals' | 'stacks';
}

export interface WalletInfo {
  name: string;
  description: string;
  icon: string;
  popular: boolean;
  supported: boolean;
  installUrl: string;
  isInstalled?: boolean;
}

export interface WalletConnectionResult {
  addresses: WalletAddress[];
  userSession: UserSession | null;
  walletType: string;
  network: 'mainnet' | 'testnet';
}

export class WalletManager {
  private static instance: WalletManager;
  private userSession: UserSession | null = null;

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  async checkWalletInstallation(): Promise<boolean> {
    try {
      return await isStacksWalletInstalled();
    } catch (error) {
      console.error('Error checking wallet installation:', error);
      return false;
    }
  }

  async connectWallet(
    walletName: string,
    network: 'mainnet' | 'testnet'
  ): Promise<WalletConnectionResult> {
    return new Promise((resolve, reject) => {
      try {
        const appConfig = {
          appDetails: {
            name: "TrustCred",
            icon: "https://trustcred.io/logo.png",
            url: "https://trustcred.io"
          },
          network: network,
          onFinish: (data: any) => {
            console.log('Wallet connection successful:', data);
            
            // Extract addresses from the connection result
            const addresses: WalletAddress[] = [];
            
            if (data.addresses) {
              // Add Stacks address
              if (data.addresses.mainnet) {
                addresses.push({
                  address: data.addresses.mainnet,
                  publicKey: data.publicKeys?.mainnet || '',
                  purpose: 'stacks'
                });
              }
              if (data.addresses.testnet) {
                addresses.push({
                  address: data.addresses.testnet,
                  publicKey: data.publicKeys?.testnet || '',
                  purpose: 'stacks'
                });
              }
            }

            // Add Bitcoin address if available
            if (data.btcAddress) {
              addresses.push({
                address: data.btcAddress,
                publicKey: data.btcPublicKey || '',
                purpose: 'payment'
              });
            }

            const result: WalletConnectionResult = {
              addresses,
              userSession: data.userSession || null,
              walletType: walletName.toLowerCase(),
              network
            };

            // Store connection info
            this.storeConnectionInfo(result);
            
            resolve(result);
          },
          onCancel: () => {
            reject(new Error('Connection was cancelled by user'));
          }
        };

        // Show the connect modal
        showConnect(appConfig);

      } catch (error) {
        reject(error);
      }
    });
  }

  private storeConnectionInfo(result: WalletConnectionResult): void {
    localStorage.setItem('trustcred_wallet_connected', 'true');
    localStorage.setItem('trustcred_wallet_type', result.walletType);
    localStorage.setItem('trustcred_network', result.network);
    
    if (result.addresses.length > 0) {
      const stacksAddress = result.addresses.find(addr => addr.purpose === 'stacks');
      if (stacksAddress) {
        localStorage.setItem('trustcred_stacks_address', stacksAddress.address);
        localStorage.setItem('trustcred_stacks_publickey', stacksAddress.publicKey);
      }
    }
  }

  getStoredConnectionInfo(): {
    isConnected: boolean;
    walletType: string | null;
    network: string | null;
    stacksAddress: string | null;
    stacksPublicKey: string | null;
  } {
    return {
      isConnected: localStorage.getItem('trustcred_wallet_connected') === 'true',
      walletType: localStorage.getItem('trustcred_wallet_type'),
      network: localStorage.getItem('trustcred_network'),
      stacksAddress: localStorage.getItem('trustcred_stacks_address'),
      stacksPublicKey: localStorage.getItem('trustcred_stacks_publickey')
    };
  }

  disconnect(): void {
    localStorage.removeItem('trustcred_wallet_connected');
    localStorage.removeItem('trustcred_wallet_type');
    localStorage.removeItem('trustcred_network');
    localStorage.removeItem('trustcred_stacks_address');
    localStorage.removeItem('trustcred_stacks_publickey');
    this.userSession = null;
  }
}

export const walletManager = WalletManager.getInstance();
