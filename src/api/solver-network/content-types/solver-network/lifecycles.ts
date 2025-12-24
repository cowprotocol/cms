import { calculateActiveNetworksForSolver } from '../../../solver/content-types/solver/lifecycles';

export default {
  async beforeCreate(event) {
    await validateVouchedBy(event);
  },

  async beforeUpdate(event) {
    await validateVouchedBy(event);
  },

  async afterCreate(event) {
    await updateParentSolver(event);
  },

  async afterUpdate(event) {
    await updateParentSolver(event);
  },

  async afterDelete(event) {
    await updateParentSolver(event);
  },
};

async function validateVouchedBy(event) {
  const { data } = event.params;

  // Check if isVouched is true and vouchedBy is not set
  if (data.isVouched === true && !data.vouchedBy) {
    throw new Error('vouchedBy relationship must be set when isVouched is true');
  }
}

async function updateParentSolver(event) {
  try {
    const { result } = event;

    // If this is a delete operation, result might not be available
    if (!result || !result.solver) {
      return;
    }

    // Get the solver ID
    const solverId = result.solver.id || result.solver;

    if (solverId) {
      // Update the solver's activeNetworks field
      await calculateActiveNetworksForSolver(solverId);
    }
  } catch (error) {
    console.error('Error updating parent solver:', error);
  }
}
