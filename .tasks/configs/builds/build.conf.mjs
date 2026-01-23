import { createRollupConfigs } from '@itee/tasks/sources/utils/builds.mjs'

export default createRollupConfigs( {
    formats:     [ 'esm', 'cjs' ],
    externalMap: {
        'esm': [
            'node:path', // Todo: use itee-utils
            'mongoose',

            'itee-database',
            'itee-validators',
            'itee-utils',
        ],
        'cjs': [
            'node:path', // Todo: use itee-utils
            'mongoose',

            'itee-database',
            'itee-validators',
            'itee-utils',
        ],
    }
} )
