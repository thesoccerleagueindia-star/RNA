"use strict";

function str(v, max = 200) {
  return String(v || "")
    .trim()
    .slice(0, max);
}

function requireFields(obj, fields) {
  const missing = [];
  for (const f of fields) {
    if (!str(obj[f])) missing.push(f);
  }
  return missing;
}

function normalizeWaitlist(body) {
  return {
    type: "waitlist",
    playerName: str(body.playerName),
    guardianName: str(body.guardianName),
    age: str(body.age, 10),
    city: str(body.city, 40),
    category: str(body.category, 60),
    interest: str(body.interest, 40),
    email: str(body.email, 120).toLowerCase(),
    phone: str(body.phone, 40),
    consent: body.consent === true || body.consent === "on" || body.consent === "true",
  };
}

function normalizeRegistration(body) {
  return {
    type: "registration",
    playerName: str(body.playerName),
    guardianName: str(body.guardianName),
    age: str(body.age, 10),
    city: str(body.city, 40),
    category: str(body.category, 60),
    interest: str(body.interest, 40),
    email: str(body.email, 120).toLowerCase(),
    guardianContact: str(body.guardianContact || body.phone, 40),
    guardianConsent:
      body.guardianConsent === true ||
      body.guardianConsent === "on" ||
      body.guardianConsent === "true",
    privacyAck:
      body.privacyAck === true || body.privacyAck === "on" || body.privacyAck === "true",
  };
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

module.exports = {
  str,
  requireFields,
  normalizeWaitlist,
  normalizeRegistration,
  makeId,
};
