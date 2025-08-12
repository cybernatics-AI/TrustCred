import { showConnect, isStacksWalletInstalled, UserSession, FinishedAuthData } from '@stacks/connect';

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
    walletName: string
  ): Promise<WalletConnectionResult> {
    return new Promise((resolve, reject) => {
      try {
        const appConfig = {
          appDetails: {
            name: "TrustCred",
            icon: "https://trustcred.io/logo.png",
            url: "https://trustcred.io"
          },
          network: 'mainnet',
          onFinish: (data: FinishedAuthData) => {
            console.log('Wallet connection successful:', data);
            
            // Extract addresses from the connection result
            const addresses: WalletAddress[] = [];
            
            // Extract Stacks address from userSession
            if (data.userSession?.loadUserData) {
              const userData = data.userSession.loadUserData();
              if (userData?.profile?.stxAddress?.mainnet) {
                addresses.push({
                  address: userData.profile.stxAddress.mainnet,
                  publicKey: '',
                  purpose: 'stacks'
                });
              }
              if (userData?.profile?.btcAddress) {
                addresses.push({
                  address: userData.profile.btcAddress,
                  publicKey: '',
                  purpose: 'payment'
                });
              }
            }

            const result: WalletConnectionResult = {
              addresses,
              userSession: data.userSession || null,
              walletType: walletName.toLowerCase(),
              network: 'mainnet'
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
