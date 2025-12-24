export default {
  async beforeCreate(event) {
    await updateActiveNetworks(event);
    await updateServiceFeeEnabled(event);
  },

  async beforeUpdate(event) {
    await updateActiveNetworks(event);
    await updateServiceFeeEnabled(event);
  },
};

async function updateActiveNetworks(event) {
  const { data, where } = event.params;
  const solverData: SolverData = data;

  // If this is an update operation and we're not updating solver_networks relation
  if (where && !data.solver_networks) {
    // Get the current solver data to check if we need to update activeNetworks
    const solver = await strapi.entityService.findOne(
      'api::solver.solver',
      where.id,
      { populate: ['solver_networks.network'] }
    );

    if (solver) {
      // Calculate active networks
      await calculateActiveNetworks(solver, solverData);
    }
  } else if (data.solver_networks) {
    // For create or when solver_networks is being updated
    // We'll need to fetch the networks after the operation in afterCreate/afterUpdate
    // as the relations might not be fully established yet
  }
}

// Define interface for the data object
interface SolverData {
  activeNetworks?: string[];
  hasActiveNetworks?: boolean;
  isServiceFeeEnabled?: boolean;
}

// This function will be called after create/update to ensure relations are established
export async function calculateActiveNetworksForSolver(solverId) {
  try {
    // Get the solver with its networks
    const solver = await strapi.entityService.findOne(
      'api::solver.solver',
      solverId,
      { populate: ['solver_networks.network'] }
    );

    if (solver) {
      // Calculate active networks
      const data: SolverData = {};
      await calculateActiveNetworks(solver, data);

      // Update the solver with the calculated values
      if (data.activeNetworks || data.hasActiveNetworks !== undefined) {
        await strapi.entityService.update(
          'api::solver.solver',
          solverId,
          { data }
        );
      }
    }
  } catch (error) {
    console.error(`Error calculating active networks for solver ${solverId}:`, error);
  }
}

// This function will be called to update the service fee enabled status for a solver
export async function updateServiceFeeEnabledForSolver(solverId) {
  try {
    // Get the solver with its bonding pools
    const solver = await strapi.entityService.findOne(
      'api::solver.solver',
      solverId,
      {
        populate: {
          solver_bonding_pools: {
            fields: ['name', 'joinedOn']
          }
        }
      }
    );

    if (solver) {
      // Calculate service fee enabled status
      const data: SolverData = {};
      await calculateServiceFeeEnabled(solver, data);

      // Update the solver with the calculated values
      if (data.isServiceFeeEnabled !== undefined) {
        await strapi.entityService.update(
          'api::solver.solver',
          solverId,
          { data }
        );
      }
    }
  } catch (error) {
    console.error(`Error updating service fee enabled for solver ${solverId}:`, error);
  }
}

async function calculateActiveNetworks(solver, data: SolverData) {
  if (!solver.solver_networks) {
    data.activeNetworks = [];
    data.hasActiveNetworks = false;
    return;
  }

  // Filter active networks and extract their names
  const activeNetworkNames = solver.solver_networks
    .filter(network => network.active)
    .map(network => network.network?.name)
    .filter(Boolean); // Remove any undefined values

  data.activeNetworks = activeNetworkNames;
  data.hasActiveNetworks = activeNetworkNames.length > 0;
}

async function updateServiceFeeEnabled(event) {
  const { data, where } = event.params;
  const solverData: SolverData = data;

  // For create operation or update operation
  if (where) {
    // Get the current solver data with bonding pools
    const solver = await strapi.entityService.findOne(
      'api::solver.solver',
      where.id,
      {
        populate: {
          solver_bonding_pools: {
            fields: ['name', 'joinedOn']
          }
        }
      }
    );

    if (solver) {
      // Calculate service fee enabled status
      await calculateServiceFeeEnabled(solver, solverData);
    }
  }
  // For create operation, we'll handle it in afterCreate since we need the ID
}

async function calculateServiceFeeEnabled(solver, data: SolverData) {
  // Default to false
  data.isServiceFeeEnabled = false;

  if (!solver.solver_bonding_pools || solver.solver_bonding_pools.length === 0) {
    return;
  }

  // Get current date for comparison
  const currentDate = new Date();

  // Check each bonding pool
  for (const bondingPool of solver.solver_bonding_pools) {
    // Skip if joinedOn is not set
    if (!bondingPool.joinedOn) {
      continue;
    }

    const joinedDate = new Date(bondingPool.joinedOn);
    const monthsDifference = getMonthsDifference(joinedDate, currentDate);

    // CoW bonding pool (name is "CoW" and not colocated)
    if (bondingPool.name === "CoW" && solver.isColocated === "No") {
      if (monthsDifference >= 6) {
        data.isServiceFeeEnabled = true;
        return; // Exit early once we find a qualifying pool
      }
    }
    // Colocated bonding pool
    else if (solver.isColocated === "Yes") {
      if (monthsDifference >= 3) {
        data.isServiceFeeEnabled = true;
        return; // Exit early once we find a qualifying pool
      }
    }
    // For partial colocated, we'll treat it as not colocated
  }
}

// Helper function to calculate months difference between two dates
function getMonthsDifference(startDate, endDate) {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  return years * 12 + months;
}
