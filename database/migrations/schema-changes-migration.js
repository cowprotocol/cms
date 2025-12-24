async function up(knex) {
  // 1. Update Solver Bonding Pool: rename bonding_pool to name
  // First, get all solver bonding pools with their bonding_pool relation
  const solverBondingPools = await knex('solver_bonding_pools')
    .select('id', 'bonding_pool_id')
    .whereNotNull('bonding_pool_id');

  // For each solver bonding pool, get the name from bonding_pool and update the solver bonding pool
  for (const sbp of solverBondingPools) {
    if (sbp.bonding_pool_id) {
      // Get the name from bonding_pool
      const bondingPool = await knex('bonding_pools')
        .select('name')
        .where('id', sbp.bonding_pool_id)
        .first();

      if (bondingPool && bondingPool.name) {
        // Update the solver bonding pool with the name
        await knex('solver_bonding_pools')
          .where('id', sbp.id)
          .update({
            name: bondingPool.name
          });
      }
    }
  }

  // 2. Calculate activeNetworks for all solvers
  const solvers = await knex('solvers').select('id');

  for (const solver of solvers) {
    // Get all active networks for this solver
    const activeNetworks = await knex('solver_networks')
      .join('networks', 'solver_networks.network_id', 'networks.id')
      .where({
        'solver_networks.solver_id': solver.id,
        'solver_networks.active': true
      })
      .select('networks.name');

    // Extract network names
    const networkNames = activeNetworks.map(n => n.name);

    // Update the solver with activeNetworks and hasActiveNetworks
    await knex('solvers')
      .where('id', solver.id)
      .update({
        activeNetworks: JSON.stringify(networkNames),
        hasActiveNetworks: networkNames.length > 0
      });
  }

  // 3. Ensure all required fields are set for Solver Network
  // Make a list of solver networks that have isVouched=true but no vouchedBy
  const vouchedNetworks = await knex('solver_networks')
    .where('isVouched', true)
    .whereNull('vouchedBy');

  console.log(`Found ${vouchedNetworks.length} solver networks with isVouched=true but no vouchedBy`);

  return;
}

async function down(knex) {
  // This migration cannot be reversed automatically
  console.log('This migration cannot be reversed automatically');
  return;
}

module.exports = { up, down };
