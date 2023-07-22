import * as log4js from 'log4js';
import { Resolvers, Title } from '../types/generated/graphql';

log4js.addLayout('json', function(config) {
  return function(logEvent) { return JSON.stringify(logEvent) + config.separator; };
});

log4js.configure({
  appenders: {
    out: { type: 'stdout', layout: { type: 'json', separator: ',' } }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' }
  }
});
const logger = log4js.getLogger();

const resolvers: Resolvers = {
  Query: {
    titles: async (_: unknown,__: unknown, context: unknown): Promise<Title[]> => {
      logger.info(JSON.stringify(context));
      return [];
    }
  }
};

export default resolvers;
