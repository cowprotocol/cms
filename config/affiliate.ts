export default ({ env }) => ({
  defaults: {
    rewardAmount: env("AFFILIATE_REWARD_AMOUNT", "10"),
    triggerVolume: env("AFFILIATE_TRIGGER_VOLUME", "250000"),
    timeCapDays: env.int("AFFILIATE_TIME_CAP_DAYS", 90),
    volumeCap: env("AFFILIATE_VOLUME_CAP", "0"),
    revenueSplitAffiliatePct: env("AFFILIATE_REVENUE_SPLIT_AFFILIATE_PCT", "50"),
    revenueSplitTraderPct: env("AFFILIATE_REVENUE_SPLIT_TRADER_PCT", "50"),
    revenueSplitDaoPct: env("AFFILIATE_REVENUE_SPLIT_DAO_PCT", "0"),
  },
});
