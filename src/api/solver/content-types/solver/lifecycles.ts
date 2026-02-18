import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    try {
      await updateActiveNetworks(event);
      await updateServiceFeeEnabled(event);
    } catch (error) {
      console.error("Error in beforeCreate:", error);
      throw new errors.ValidationError(error.message || "Error processing solver data");
    }
  },

  async beforeUpdate(event) {
    try {
      await updateActiveNetworks(event);
      await updateServiceFeeEnabled(event);
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
        await calculateActiveNetworks(solver as Solver, solverData);
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

async function calculateActiveNetworks(solver: Solver, data: SolverData): Promise<void> {
  if (!solver.solver_networks) {
    data.activeNetworks = [];
    data.hasActiveNetworks = false;
    return;
  }

  // Filter active networks and extract their names
  const activeNetworkNames = solver.solver_networks
    .filter(network => network.active)
    .map(network => network.network?.name)
    .filter(Boolean) as string[]; // Remove any undefined values

  data.activeNetworks = activeNetworkNames;
  data.hasActiveNetworks = activeNetworkNames.length > 0;
}

async function updateServiceFeeEnabled(event: StrapiEvent): Promise<void> {
  const { data, where } = event.params;
  const solverData: SolverData = data;

  if (where) {
    try {
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
        await calculateServiceFeeEnabled(solver as Solver, solverData);
      }
    } catch (error) {
      console.error(`Error fetching solver data for service fee calculation (id ${where.id}):`, error);
      throw new errors.ApplicationError(`Failed to fetch solver data for service fee calculation: ${error.message}`);
    }
  }
  // For create operation, we handle it in afterCreate since we need the ID
}

async function calculateServiceFeeEnabled(solver: Solver, data: SolverData): Promise<void> {
  data.isServiceFeeEnabled = false;

  if (!solver.solver_bonding_pools || solver.solver_bonding_pools.length === 0) {
    return;
  }

  try {
    const currentDate = new Date();

    for (const bondingPool of solver.solver_bonding_pools) {
      if (!bondingPool.joinedOn) {
        continue;
      }

      const joinedDate = new Date(bondingPool.joinedOn);
      const monthsDifference = getMonthsDifference(joinedDate, currentDate);

      if (bondingPool.name === "CoW" && solver.isColocated === "No") {
        if (monthsDifference >= 6) {
          data.isServiceFeeEnabled = true;
          return;
        }
      }
      // Colocated bonding pool
      else if (solver.isColocated === "Yes") {
        if (monthsDifference >= 3) {
          data.isServiceFeeEnabled = true;
          return;
        }
      }
      // For partial colocated, we'll treat it as not colocated
    }
  } catch (error) {
    console.error(`Error calculating service fee enabled status:`, error);
    throw new errors.ApplicationError(`Failed to calculate service fee status: ${error.message}`);
  }
}

// Helper function to calculate months difference between two dates
function getMonthsDifference(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  return years * 12 + months;
}
