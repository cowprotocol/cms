import { errors } from "@strapi/utils";
import { getMonthsDifference } from "../../../../utils/date";

const COW_BONDING_POOL_SERVICE_FEE_TH: number = 6;
const COLOCATED_BONDING_POOL_SERVICE_FEE_TH: number = 3;

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
        await setServiceFeeEnabled(solver as Solver, solverData);
      }
    } catch (error) {
      console.error(`Error fetching solver data for service fee calculation (id ${where.id}):`, error);
      throw new errors.ApplicationError(`Failed to fetch solver data for service fee calculation: ${error.message}`);
    }
  }
  // For create operation, we handle it in afterCreate since we need the ID
}

/**
 * Determines if a solver is eligible for service fees based on bonding pool criteria.
 * Pure function that checks eligibility based on time thresholds:
 * - 6+ months for non-colocated CoW pools
 * - 3+ months for colocated pools
 * @param solver The solver entity to check
 * @returns Boolean indicating if the solver is eligible for service fees
 */
function isEligibleForServiceFee(solver: Solver): boolean {
  if (!solver.solver_bonding_pools || solver.solver_bonding_pools.length === 0) {
    return false;
  }

  const currentDate = new Date();

  for (const bondingPool of solver.solver_bonding_pools) {
    if (!bondingPool.joinedOn) {
      continue;
    }

    const joinedDate = new Date(bondingPool.joinedOn);
    const monthsDifference = getMonthsDifference(joinedDate, currentDate);

    if (bondingPool.name === "CoW" && solver.isColocated === "No") {
      if (monthsDifference >= COW_BONDING_POOL_SERVICE_FEE_TH) {
        return true;
      }
    }
    else if (solver.isColocated === "Yes") {
      if (monthsDifference >= COLOCATED_BONDING_POOL_SERVICE_FEE_TH) {
        return true;
      }
    }
    // For partial colocated, we'll treat it as not colocated
  }

  return false;
}

/**
 * Sets the isServiceFeeEnabled flag in the solver data based on eligibility.
 * Uses the pure function isEligibleForServiceFee to determine eligibility.
 */
async function setServiceFeeEnabled(solver: Solver, data: SolverData): Promise<void> {
  try {
    data.isServiceFeeEnabled = isEligibleForServiceFee(solver);
  } catch (error) {
    console.error(`Error setting service fee enabled status:`, error);
    throw new errors.ApplicationError(`Failed to set service fee status: ${error.message}`);
  }
}
