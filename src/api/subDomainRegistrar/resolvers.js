import { queryAll } from '../subDomainRegistrar';
import { fromWei } from 'ethjs-unit';
import getFNS from 'api/fns';

const defaults = {
  subDomainState: []
};

const resolvers = {
  Mutation: {
    async getSubDomainAvailability(_, { name }, { cache }) {
      //clear old search results
      cache.writeData({
        data: {
          subDomainState: []
        }
      });
      const nodes = await queryAll(name);
      const cachedNodes = [];

      const promises = nodes.map(subDomainPromise =>
        subDomainPromise
          .then(async node => {
            let owner = null;

            if (!node.available) {
              const fns = getFNS();
              owner = await fns.getOwner(`${node.label}.${node.domain}.ftm`);
            }
            const newNode = {
              ...node,
              id: `${node.label}.${node.domain}.ftm`,
              owner,
              name: `${node.label}.${node.domain}.ftm`,
              state: node.available ? 'Open' : 'Owned',
              price: fromWei(node.price, 'ether'),
              __typename: 'SubDomain'
            };

            cachedNodes.push(newNode);

            const data = {
              subDomainState: [...cachedNodes]
            };

            cache.writeData({ data });
          })
          .catch(e => console.log('ERROR in subdomain results', e))
      );

      return Promise.all(promises).then(() => {
        return cachedNodes;
      });
    }
  }
};

export default resolvers;

export { defaults };
