import Subscribe from "./Subscribe";
import gql from "graphql-tag";

export default class CreateMoleculeSubscribe extends Subscribe {
  constructor( socketClient ) {
    super( socketClient );
    this.$__subscribe = gql`
        subscription onCreateMolecule ( $bundle: String! ) {
            CreateMolecule( bundle: $bundle ) {
                molecularHash,
                status
            }
        }
    `;
  }
}
