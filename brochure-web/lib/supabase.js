"use strict";

const config = require("./config");

function supabaseConfigured() {
  return Boolean(config.supabaseUrl && config.supabasePublishableKey);
}

async function supabaseInsert(table, row) {
  if (!supabaseConfigured()) {
    throw new Error("Supabase not configured (SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY)");
  }
  const url = `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: config.supabasePublishableKey,
      Authorization: `Bearer ${config.supabasePublishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg =
      (Array.isArray(json) && json[0]?.message) ||
      json?.message ||
      json?.error_description ||
      json?.error ||
      text ||
      `Supabase HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return { method: "supabase", table, row: Array.isArray(json) ? json[0] : json };
}

function waitlistRow(record) {
  return {
    id: record.id,
    submitted_at: record.submittedAt,
    player_name: record.playerName,
    guardian_name: record.guardianName,
    age: record.age,
    city: record.city,
    category: record.category,
    interest: record.interest,
    email: record.email,
    phone: record.phone,
    consent: Boolean(record.consent),
  };
}

function registrationRow(record) {
  return {
    id: record.id,
    submitted_at: record.submittedAt,
    player_name: record.playerName,
    guardian_name: record.guardianName,
    age: record.age,
    city: record.city,
    category: record.category,
    interest: record.interest,
    email: record.email,
    guardian_contact: record.guardianContact,
    fee_payable: record.feePayable,
    fee_note: record.feeNote,
    payment_status: record.paymentStatus || "unpaid",
    payment_provider: record.paymentProvider || "",
    payment_url: record.paymentUrl || "",
    razorpay_payment_link_id: record.razorpayPaymentLinkId || "",
    guardian_consent: Boolean(record.guardianConsent),
    privacy_ack: Boolean(record.privacyAck),
  };
}

async function insertWaitlist(record) {
  return supabaseInsert("waitlist", waitlistRow(record));
}

async function insertRegistration(record) {
  return supabaseInsert("registrations", registrationRow(record));
}

module.exports = {
  supabaseConfigured,
  insertWaitlist,
  insertRegistration,
  waitlistRow,
  registrationRow,
};
