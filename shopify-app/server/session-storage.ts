import { Session } from "@shopify/shopify-api";
import { db } from "./db";
import { decrypt, encrypt } from "./security";
export class EncryptedSessionStorage {
  async storeSession(session: Session) {
    await db.query(
      "INSERT INTO sessions(id,shop,data) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data,shop=EXCLUDED.shop",
      [
        session.id,
        session.shop,
        encrypt(JSON.stringify(session.toPropertyArray(false))),
      ],
    );
    return true;
  }
  async loadSession(id: string) {
    const {
      rows: [s],
    } = await db.query("SELECT data FROM sessions WHERE id=$1", [id]);
    return s
      ? Session.fromPropertyArray(JSON.parse(decrypt(s.data)))
      : undefined;
  }
  async deleteSession(id: string) {
    await db.query("DELETE FROM sessions WHERE id=$1", [id]);
    return true;
  }
  async deleteSessions(ids: string[]) {
    await db.query("DELETE FROM sessions WHERE id=ANY($1::text[])", [ids]);
    return true;
  }
  async findSessionsByShop(shop: string) {
    const { rows } = await db.query("SELECT data FROM sessions WHERE shop=$1", [
      shop,
    ]);
    return rows.map((s) =>
      Session.fromPropertyArray(JSON.parse(decrypt(s.data))),
    );
  }
}
