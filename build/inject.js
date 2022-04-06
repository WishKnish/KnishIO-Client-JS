export default {
    include: 'src/**',
    exclude: 'node_modules/**',
    Buffer: [ 'buffer', 'Buffer' ],
    ApolloLink: [ '@apollo/client/core', 'ApolloLink' ],
    gql: [ '@apollo/client/core', 'gql' ],
    from: [ '@apollo/client/core', 'from' ],
    concat: [ '@apollo/client/core', 'concat' ],
    Observable: [ '@apollo/client/core', 'Observable' ],
    shake256: [ 'js-sha3', 'shake256' ]
};
