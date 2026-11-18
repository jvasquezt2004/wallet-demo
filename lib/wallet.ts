import * as jose from "jose";
import { JWT } from "google-auth-library";
import { getPassData } from "./loyalty";
import { rewardsOf } from "./loyalty";

type Credentials = {
  issuerId: string;
  serviceEmail: string;
  privateKey: string;
  appUrl: string;
};

function getCredentials(): Credentials {
  const issuerId = process.env.GOOGLE_ISSUER_ID;
  const serviceEmail = process.env.GOOGLE_SERVICE_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!issuerId || !serviceEmail || !privateKey) {
    throw new Error(
      "Google Wallet no está configurado. Define GOOGLE_ISSUER_ID, GOOGLE_SERVICE_EMAIL y GOOGLE_PRIVATE_KEY."
    );
  }

  return {
    issuerId,
    serviceEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    appUrl: appUrl.replace(/\/$/, ""),
  };
}

export async function generateWalletLink(customerId: string, requestUrl?: string): Promise<string> {
  const { issuerId, serviceEmail, privateKey, appUrl: configuredUrl } = getCredentials();
  const appUrl = (requestUrl || configuredUrl).replace(/\/$/, "");
  const data = await getPassData(customerId);
  if (!data) throw new Error("Datos no encontrados");

  const { customer, restaurant } = data;
  const rewards = rewardsOf(restaurant);
  const maxStamps = Math.max(...rewards.map((r) => r.stampsRequired), 1);
  const unlocked = new Set(customer.unlockedRewardIds);

  const bg = restaurant.bgColor.replace("#", "").slice(0, 6);
  const fg = restaurant.textColor.replace("#", "").slice(0, 6);
  const logoUrl =
    restaurant.logoUrl ||
    `https://placehold.co/600x600/${bg}/${fg}/png?text=${encodeURIComponent(
      restaurant.name.slice(0, 2).toUpperCase()
    )}`;

  const classId = `${issuerId}.${restaurant.slug}`;
  const objectId = `${issuerId}.cust_${customer.id}`;

  const payload = {
    loyaltyClasses: [
      {
        id: classId,
        issuerName: restaurant.name,
        programName: "Club de Lealtad",
        programLogo: { sourceUri: { uri: logoUrl } },
        hexBackgroundColor: restaurant.bgColor,
        reviewStatus: "UNDER_REVIEW",
      },
    ],
    loyaltyObjects: [
      {
        id: objectId,
        classId,
        state: "ACTIVE",
        accountName: customer.name,
        accountId: customer.passCode || customer.id.slice(-8).toUpperCase(),
        barcode: { type: "QR_CODE", value: `${appUrl}/scan/${customer.id}` },
        loyaltyPoints: {
          label: "Sellos",
          balance: { string: `${customer.currentStamps} / ${maxStamps}` },
        },
        textModulesData: rewards.map((reward) => ({
          id: reward.id,
          header: `${reward.stampsRequired} sellos · ${reward.label}`,
          body: unlocked.has(reward.id)
            ? "✅ Desbloqueada — reclámala en caja"
            : reward.promoText,
        })),
      },
    ],
  };

  const key = await jose.importPKCS8(privateKey, "RS256");
  const token = await new jose.SignJWT({
    iss: serviceEmail,
    aud: "google",
    origins: [appUrl],
    typ: "savetowallet",
    payload,
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .sign(key);

  return `https://pay.google.com/gp/v/save/${token}`;
}

export async function syncWalletPass(
  customerId: string,
  pushHeader: string,
  pushBody: string
): Promise<void> {
  let creds: Credentials;
  try {
    creds = getCredentials();
  } catch {
    return;
  }

  const data = await getPassData(customerId);
  if (!data) return;
  const { customer, restaurant } = data;

  const client = new JWT({
    email: creds.serviceEmail,
    key: creds.privateKey,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });
  const objectId = `${creds.issuerId}.cust_${customer.id}`;

  await client.request({
    url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}`,
    method: "PATCH",
    data: {
      loyaltyPoints: {
        balance: { string: `${customer.currentStamps} / ${restaurant.stampsRequired}` },
      },
      messages: [
        {
          id: `msg_${Date.now()}`,
          header: pushHeader,
          body: pushBody,
          messageType: "TEXT_AND_NOTIFY",
        },
      ],
    },
  });
}
