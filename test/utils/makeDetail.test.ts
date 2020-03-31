import 'mocha';
import { expect } from 'chai';
import MigrationPlanExecutor from '../../src/executor/plan/MigrationPlanExecutor';
import { resolvedMigrations } from '../data/ResolvedMigrationTestData';
import { migrateIndices } from '../data/MigrateIndexTestData';
import { migrationPlanContext } from '../data/MigrationPlanContextTestData';
import makeDetail from '../../src/utils/makeDetail';
import { MigrationStates } from '../../src/model/types';
import { format } from 'date-fns';

describe('makeDetail test', () => {
    it('makeDetail test', () => {
        const installedOn = new Date();
        const service = MigrationPlanExecutor(
            resolvedMigrations,
            migrateIndices(installedOn),
            migrationPlanContext
        );
        const migrationPlans = service.all;
        const detail = makeDetail([
            ...migrationPlans,
            {
                context: migrationPlanContext,
                outOfOrder: false,
                baseline: false
            }
        ]);
        const status = migrationPlans.map((value) => value.state?.status);

        expect(status)
            .to.be.an('array')
            .to.be.include.ordered.members([
                MigrationStates.MISSING_SUCCESS,
                MigrationStates.IGNORED,
                MigrationStates.SUCCESS,
                MigrationStates.MISSING_FAILED,
                MigrationStates.SUCCESS,
                MigrationStates.PENDING
            ]);

        expect(detail)
            .to.be.an('array')
            .to.be.deep.include.ordered.members([
                {
                    version: 'v1.0.0',
                    description: '',
                    type: 'CREATE_INDEX',
                    installedOn: format(installedOn, "yyyy-MM-dd'T'HH:mm:ss"),
                    state: 'BASELINE'
                },
                {
                    version: 'v1.1.0',
                    description: '',
                    type: 'CREATE_INDEX',
                    installedOn: '',
                    state: 'IGNORED'
                },
                {
                    version: 'v1.1.1',
                    description: '',
                    type: 'ADD_FIELD',
                    installedOn: format(installedOn, "yyyy-MM-dd'T'HH:mm:ss"),
                    state: 'SUCCESS'
                },
                {
                    version: 'v1.10.2',
                    description: '',
                    type: 'ADD_FIELD',
                    installedOn: format(installedOn, "yyyy-MM-dd'T'HH:mm:ss"),
                    state: 'MISSING_FAILED'
                },
                {
                    version: 'v1.20.0',
                    description: '',
                    type: 'ADD_FIELD',
                    installedOn: format(installedOn, "yyyy-MM-dd'T'HH:mm:ss"),
                    state: 'SUCCESS'
                },
                {
                    version: 'v99.1.1',
                    description: '',
                    type: 'CREATE_INDEX',
                    installedOn: '',
                    state: 'PENDING'
                }
            ]);
    });
});