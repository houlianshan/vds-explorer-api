import { BaseModule } from '..';
import { VDSStateProvider } from '../../providers/chain-state/vds/vds';
import { VdsP2PWorker } from './p2p';
import { VerificationPeer } from './VerificationPeer';

export default class VdsModule extends BaseModule {
  constructor(services) {
    super(services);
    services.Libs.register('VDS', 'bitcore-lib', 'bitcore-p2p');
    services.P2P.register('VDS', VdsP2PWorker);
    services.CSP.registerService('VDS', new VDSStateProvider());
    services.Verification.register('VDS', VerificationPeer);
  }
}
