export default {
  async beforeCreate(event) {
    await updateActiveNetworks(event);
  },

  async beforeUpdate(event) {
    await updateActiveNetworks(event);
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
