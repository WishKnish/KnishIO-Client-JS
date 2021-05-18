import Subscribe from "./Subscribe";
import gql from "graphql-tag";


export default class ActiveWalletSubscribe extends Subscribe {
  constructor( apolloClient ) {
    super( apolloClient );
    this.$__subscribe = gql`
        subscription onActiveWallet ( $bundle: String! ) {
            ActiveWallet( bundle: $bundle ) {
                address,
                bundleHash,
                walletBundle {
                    bundleHash,
                    slug,
                    createdAt,
                },
                tokenSlug,
                token {
                    slug,
                    name,
                    fungibility,
                    supply,
                    decimals,
                    amount,
                    icon,
                    createdAt
                },
                batchId,
                position,
                characters,
                pubkey,
                amount,
                createdAt,
                metas {
                    molecularHash,
                    position,
                    metaType,
                    metaId,
                    key,
                    value,
                    createdAt,
                }
            }
        }
    `;
  }
}