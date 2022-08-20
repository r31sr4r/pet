#!/bin/sh

npm run cti create './src/@seedwork/application' -- -i '*spec.ts' -b  &&
npm run cti create './src/@seedwork/domain' -- -i '*spec.ts' -e 'tests' -b &&
npm run cti create './src/@seedwork/infra' -- -i '*spec.ts' -b &&

npm run cti create './src/access/application' -- -i '*spec.ts' -b &&
npm run cti create './src/access/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/access/infra' -- -i '*spec.ts' -b

npm run cti create './src/pet/application' -- -i '*spec.ts' -b &&
npm run cti create './src/pet/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/pet/infra' -- -i '*spec.ts' -b

npm run cti create './src/user/application' -- -i '*spec.ts' -b &&
npm run cti create './src/user/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/user/infra' -- -i '*spec.ts' -b