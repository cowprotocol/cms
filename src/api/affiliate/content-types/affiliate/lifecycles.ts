import { errors } from "@strapi/utils";

const CODE_REGEX = /^[A-Z0-9_-]{6,12}$/;

type AffiliateParamValues = {
  rewardAmount: number;
  triggerVolume: number;
  timeCapDays: number;
  volumeCap: number;
  revenueSplitAffiliatePct: number;
  revenueSplitTraderPct: number;
  revenueSplitDaoPct: number;
};

type ProgramParamField = keyof AffiliateParamValues;

const PROGRAM_PARAM_FIELDS: readonly ProgramParamField[] = [
  "rewardAmount",
  "triggerVolume",
  "timeCapDays",
  "volumeCap",
  "revenueSplitAffiliatePct",
  "revenueSplitTraderPct",
  "revenueSplitDaoPct",
];

const IMMUTABLE_FIELDS = [
  "code",
  "walletAddress",
  "signedMessage",
  ...PROGRAM_PARAM_FIELDS,
];

type AffiliateParamsPayload = Record<string, unknown> &
  Partial<AffiliateParamValues>;

function getDefaultProgramParams(): AffiliateParamsPayload {
  const configured = strapi?.config?.get?.("affiliate.defaults");
  if (!configured || typeof configured !== "object") {
    throw new Error("affiliate default params not configured");
  }
  return configured as AffiliateParamsPayload;
}

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

const normalizeWallet = (value?: string | null) =>
  value ? value.trim().toLowerCase() : value;

const normalizeCode = (value?: string | null) =>
  value ? value.trim().toUpperCase() : value;

function parseNumber(
  value: unknown,
  field: string,
  options?: { allowZero?: boolean }
): number {
  if (value === null || value === undefined || value === "") {
    throw new errors.ValidationError(`${field} is required`);
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    throw new errors.ValidationError(`${field} must be a number`);
  }
  if (numeric < 0) {
    throw new errors.ValidationError(`${field} must be >= 0`);
  }
  if (options?.allowZero === false && numeric === 0) {
    throw new errors.ValidationError(`${field} must be > 0`);
  }
  return numeric;
}

function parseInteger(value: unknown, field: string): number {
  const numeric = parseNumber(value, field, { allowZero: false });
  if (!Number.isInteger(numeric)) {
    throw new errors.ValidationError(`${field} must be an integer`);
  }
  return numeric;
}

function validateRevenueSplit(params: AffiliateParamsPayload) {
  const affiliate = parseNumber(
    params.revenueSplitAffiliatePct,
    "revenueSplitAffiliatePct"
  );
  const trader = parseNumber(
    params.revenueSplitTraderPct,
    "revenueSplitTraderPct"
  );
  const dao = parseNumber(params.revenueSplitDaoPct, "revenueSplitDaoPct");

  if (affiliate > 100 || trader > 100 || dao > 100) {
    throw new errors.ValidationError("revenue split values must be <= 100");
  }

  const sum = affiliate + trader + dao;
  if (Math.abs(sum - 100) > 0.01) {
    throw new errors.ValidationError("revenue split values must sum to 100");
  }

  return { affiliate, trader, dao };
}

function applyDefaults(
  data: AffiliateParamsPayload,
  defaults: AffiliateParamsPayload
): AffiliateParamsPayload {
  const merged: Record<string, unknown> = { ...data };

  for (const field of PROGRAM_PARAM_FIELDS) {
    if (merged[field] === undefined || merged[field] === null || merged[field] === "") {
      merged[field] = (defaults as Record<string, unknown>)[field];
    }
  }

  return merged as AffiliateParamsPayload;
}

function normalizeParams(data: AffiliateParamsPayload): AffiliateParamsPayload {
  const revenueSplit = validateRevenueSplit(data);

  return {
    ...data,
    rewardAmount: parseNumber(data.rewardAmount, "rewardAmount", {
      allowZero: false,
    }),
    triggerVolume: parseNumber(data.triggerVolume, "triggerVolume", {
      allowZero: false,
    }),
    timeCapDays: parseInteger(data.timeCapDays, "timeCapDays"),
    volumeCap: parseNumber(data.volumeCap, "volumeCap"),
    revenueSplitAffiliatePct: revenueSplit.affiliate,
    revenueSplitTraderPct: revenueSplit.trader,
    revenueSplitDaoPct: revenueSplit.dao,
  };
}

export default {
  beforeCreate(event) {
    const data = event.params.data ?? {};

    if (data.code) {
      const normalized = normalizeCode(String(data.code));
      if (!normalized || !CODE_REGEX.test(normalized)) {
        throw new errors.ValidationError(
          'affiliate code must be 6-12 chars of A-Z, 0-9, "-" or "_"'
        );
      }
      data.code = normalized;
    }

    if (data.walletAddress) {
      data.walletAddress = normalizeWallet(String(data.walletAddress));
    }

    const defaults = getDefaultProgramParams();
    const withDefaults = applyDefaults(
      data as AffiliateParamsPayload,
      defaults
    );

    event.params.data = normalizeParams(withDefaults);
  },

  async beforeUpdate(event) {
    const id = event.params.where?.id;
    if (!id) return;

    const data = event.params.data ?? {};
    if (!IMMUTABLE_FIELDS.some((field) => hasOwn(data, field))) return;

    const existing = await strapi.entityService.findOne(
      "api::affiliate.affiliate",
      id,
      { fields: IMMUTABLE_FIELDS }
    );

    if (!existing) {
      throw new errors.ValidationError("cannot find entity");
    }

    for (const field of IMMUTABLE_FIELDS) {
      if (!hasOwn(data, field)) continue;

      if (data[field] !== existing[field]) {
        throw new errors.ValidationError("only enabled field can be modified");
      }

      delete data[field];
    }
  },
};
