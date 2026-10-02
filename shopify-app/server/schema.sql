CREATE TABLE IF NOT EXISTS schema_versions (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sessions (
 id text PRIMARY KEY, shop text NOT NULL, data text NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_shop ON sessions(shop);
CREATE TABLE IF NOT EXISTS shops (
 shop text PRIMARY KEY,
 active boolean NOT NULL DEFAULT true,
 generation integer NOT NULL DEFAULT 1,
 selected_location text,
 location_name text,
 threshold integer NOT NULL DEFAULT 5 CHECK (threshold >= 1 AND threshold <= 100000),
 timezone text NOT NULL DEFAULT 'UTC',
 quiet_start integer NOT NULL DEFAULT 1320,
 quiet_end integer NOT NULL DEFAULT 480,
 quiet_enabled boolean NOT NULL DEFAULT false,
 synced_at timestamptz,
 sync_error text,
 initial_complete boolean NOT NULL DEFAULT false,
 subscription text NOT NULL DEFAULT 'free_development',
 subscription_checked_at timestamptz
);
CREATE TABLE IF NOT EXISTS members (
 uid text NOT NULL, shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 PRIMARY KEY (uid,shop)
);
CREATE TABLE IF NOT EXISTS link_codes (
 hash text PRIMARY KEY, shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 uid text NOT NULL, generation integer NOT NULL,
 expires_at timestamptz NOT NULL, used_at timestamptz
);
CREATE TABLE IF NOT EXISTS inventory (
 shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 item_id text NOT NULL, location_id text NOT NULL,
 product_id text NOT NULL, variant_id text NOT NULL,
 title text NOT NULL, variant text NOT NULL, location_name text NOT NULL,
 image text, tracked boolean NOT NULL, available integer,
 threshold integer, enabled boolean NOT NULL DEFAULT true,
 source_at timestamptz NOT NULL, observed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(shop,item_id,location_id)
);
CREATE TABLE IF NOT EXISTS alerts (
 id text PRIMARY KEY, shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 item_id text, location_id text, kind text NOT NULL,
 title text NOT NULL, quantity integer, created_at timestamptz NOT NULL DEFAULT now(),
 seen_at timestamptz, response_note text,
 push_state text NOT NULL DEFAULT 'pending'
);
CREATE INDEX IF NOT EXISTS alerts_shop_created ON alerts(shop,created_at DESC);
CREATE TABLE IF NOT EXISTS devices (
 token_hash text PRIMARY KEY, token text NOT NULL, uid text NOT NULL,
 shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS webhook_receipts (
 shop text NOT NULL, event_id text NOT NULL, topic text NOT NULL,
 received_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(shop,event_id)
);
CREATE TABLE IF NOT EXISTS jobs (
 id text PRIMARY KEY, shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 generation integer NOT NULL, kind text NOT NULL, payload jsonb NOT NULL DEFAULT '{}',
 state text NOT NULL DEFAULT 'queued', attempts integer NOT NULL DEFAULT 0,
 run_at timestamptz NOT NULL DEFAULT now(), lease_until timestamptz, lease_token text,
 error text, created_at timestamptz NOT NULL DEFAULT now(), dedupe text UNIQUE
);
CREATE INDEX IF NOT EXISTS jobs_due ON jobs(state,run_at);
CREATE TABLE IF NOT EXISTS discounts (
 id text PRIMARY KEY, shop text NOT NULL REFERENCES shops(shop) ON DELETE CASCADE,
 request_key text NOT NULL, fingerprint text NOT NULL, uid text NOT NULL,
 variant_id text NOT NULL, product_id text NOT NULL, percent integer NOT NULL,
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 state text NOT NULL, remote_id text, banner_state text NOT NULL DEFAULT 'hidden',
 error text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(shop,request_key)
);
CREATE TABLE IF NOT EXISTS audit (
 id text PRIMARY KEY, shop text NOT NULL, uid text, action text NOT NULL,
 target text, result text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO schema_versions(version) VALUES(1) ON CONFLICT DO NOTHING;
