import { errors } from "@strapi/utils";

const IMMUTABLE_FIELDS = ["code", "walletAddress", "signedMessage"];
const CODE_REGEX = /^[A-Z0-9_-]{6,12}$/;

const normalizeWallet = (value: string | null | undefined) => {
  if (!value) return value;
  return value.trim().toLowerCase();
};

const normalizeCode = (value: string | null | undefined) => {
  if (!value) return value;
  return value.trim().toUpperCase();
};

export default {
  beforeCreate(event) {
    const data = event.params.data || {};

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
  },
  async beforeUpdate(event) {
    const id = event.params.where?.id;
    if (!id) return;

    const data = event.params.data || {};

    const hasImmutableField = IMMUTABLE_FIELDS.some((field) =>
      Object.prototype.hasOwnProperty.call(data, field)
    );

    if (!hasImmutableField) return;

    const existing = await strapi.entityService.findOne(
      "api::affiliate.affiliate",
      id,
      { fields: IMMUTABLE_FIELDS }
    );

    if (!existing) {
      throw new errors.ValidationError("cannot find entity");
    }
    if (Object.prototype.hasOwnProperty.call(data, "code")) {
      const normalized = normalizeCode(String(data.code));
      if (normalized !== existing.code) {
        throw new errors.ValidationError("affiliate code is immutable");
      }
      delete data.code;
    }
    if (Object.prototype.hasOwnProperty.call(data, "walletAddress")) {
      const normalized = normalizeWallet(String(data.walletAddress));
      if (normalized !== existing.walletAddress) {
        throw new errors.ValidationError("walletAddress is immutable");
      }
      delete data.walletAddress;
    }
    if (Object.prototype.hasOwnProperty.call(data, "signedMessage")) {
      if (data.signedMessage !== existing.signedMessage) {
        throw new errors.ValidationError("signedMessage is immutable");
      }
      delete data.signedMessage;
    }
  },
};
