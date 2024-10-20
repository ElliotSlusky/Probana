// config_flow/fcl.ts
import * as fcl from "@onflow/fcl";

fcl.config()
   .put("accessNode.api", "https://access.mainnet.nodes.onflow.org")  // Mainnet access node
   .put("discovery.wallet", "https://flow-wallet.blocto.app/authn")   // Mainnet wallet
   .put("service.open", "https://flow.service");  // Update if needed

export default fcl;
