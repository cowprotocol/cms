import { errors } from "@strapi/utils";

export default {
  async afterCreate(event) {
    try {
      await updateActiveNetworks(event);
    } catch (error) {
      console.error("Error in beforeCreate:", error);
      throw new errors.ValidationError(error.message || "Error processing solver data");
    }
  },

  async afterUpdate(event) {
    try {
      await updateActiveNetworks(event);
    } catch (error) {
      console.error("Error in beforeUpdate:", error);
      throw new errors.ValidationError(error.message || "Error processing solver data");
    }
  },
};

interface SolverData {
  activeNetworks?: string[];
  hasActiveNetworks?: boolean;
  isServiceFeeEnabled?: boolean;
  solver_networks?: any;
}

interface StrapiEvent {
  params: {
    data: SolverData;
    where?: {
      id: number;
    };
  };
  result?: {
    id: number;
  };
}

async function updateActiveNetworks(event: StrapiEvent) {
  const { data, where } = event.params;
  const solverData: SolverData = data;

  if (where && !data.solver_networks) {
    try {
      const solver = await strapi.entityService.findOne(
        'api::solver.solver',
        where.id,
        { populate: ['solver_networks.network'] }
      );

      if (solver) {
        await updateActiveNetworksData(solver as Solver, solverData);
      }
    } catch (error) {
      console.error(`Error fetching solver data for id ${where.id}:`, error);
      throw new errors.ApplicationError(`Failed to fetch solver data: ${error.message}`);
    }
  }
}

interface Solver {
  id: number;
  solver_networks?: Array<{
    active?: boolean;
    network?: {
      name?: string;
    };
  }>;
  solver_bonding_pools?: Array<{
    name?: string;
    joinedOn?: string;
  }>;
  isColocated?: string;
}

/**
 * Extracts active network names from solver networks
 * @param solverNetworks Array of solver network objects
 * @returns Array of active network names
 */
function getActiveNetworks(solverNetworks?: Array<{
  active?: boolean;
  network?: {
    name?: string;
  };
}>): string[] {
  if (!solverNetworks) {
    return [];
  }

  return solverNetworks
    .filter(network => network.active)
    .map(network => network.network?.name)
    .filter(Boolean) as string[]; // Remove any undefined values
}

/**
 * Updates the solver data with active network information
 * This function mutates the data object by setting activeNetworks and hasActiveNetworks properties
 */
async function updateActiveNetworksData(solver: Solver, data: SolverData): Promise<void> {
  const activeNetworks = getActiveNetworks(solver.solver_networks);
  data.hasActiveNetworks = activeNetworks.length > 0;
  data.activeNetworks = activeNetworks;
}
