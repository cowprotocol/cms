import { Strapi } from '@strapi/strapi';
import { updateServiceFeeEnabledForSolver } from '../../../solver/content-types/solver/lifecycles';

export default ({ strapi }: { strapi: Strapi }) => ({
  async afterCreate(event) {
    // await updateRelatedSolvers(event, strapi);
  },

  async afterUpdate(event) {
    // await updateRelatedSolvers(event, strapi);
  },

  async beforeDelete(event) {
    // await storeRelatedSolversForUpdate(event, strapi);
  },

  async afterDelete(event) {
    // await updateStoredSolvers(event, strapi);
  },
});

// Store for temporarily keeping solver IDs between beforeDelete and afterDelete
const solverIdsToUpdate = new Map();

async function updateRelatedSolvers(event, strapi) {
  try {
    const { result } = event;

    // If this is a delete operation, result might not be available
    if (!result || !result.solvers) {
      return;
    }

    // Get the solver IDs
    const solverIds = Array.isArray(result.solvers)
      ? result.solvers.map(solver => solver.id || solver)
      : [];

    // If no solvers are directly available in the result, fetch them
    if (solverIds.length === 0 && result.id) {
      const bondingPool = await strapi.entityService.findOne(
        'api::solver-bonding-pool.solver-bonding-pool',
        result.id,
        { populate: ['solvers'] }
      );

      if (bondingPool && bondingPool.solvers) {
        bondingPool.solvers.forEach(solver => {
          solverIds.push(solver.id);
        });
      }
    }

    // Update each solver's service fee enabled status
    for (const solverId of solverIds) {
      if (solverId) {
        await updateServiceFeeEnabledForSolver(solverId, strapi);
      }
    }
  } catch (error) {
    console.error('Error updating related solvers:', error);
  }
}

async function storeRelatedSolversForUpdate(event, strapi) {
  try {
    const { where } = event.params;
    const { id } = where;

    // Get the bonding pool with its solvers
    const bondingPool = await strapi.entityService.findOne(
      'api::solver-bonding-pool.solver-bonding-pool',
      id,
      { populate: ['solvers'] }
    );

    if (bondingPool && bondingPool.solvers) {
      // Store the solver IDs for later use in afterDelete
      const solverIds = bondingPool.solvers.map(solver => solver.id);
      solverIdsToUpdate.set(id, solverIds);
    }
  } catch (error) {
    console.error('Error storing related solvers for update:', error);
  }
}

async function updateStoredSolvers(event, strapi) {
  try {
    const { where } = event.params;
    const { id } = where;

    // Get the stored solver IDs
    const solverIds = solverIdsToUpdate.get(id) || [];

    // Update each solver's service fee enabled status
    for (const solverId of solverIds) {
      if (solverId) {
        await updateServiceFeeEnabledForSolver(solverId, strapi);
      }
    }

    // Clean up the stored solver IDs
    solverIdsToUpdate.delete(id);
  } catch (error) {
    console.error('Error updating stored solvers:', error);
  }
}
