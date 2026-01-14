import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { shares } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";
export const alt = "Claude en Pañales";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

interface CardData {
  id: string;
  label: string;
  image: string | null;
}

export default async function Image({ params }: { params: { id: string } }) {
  const share = await db.query.shares.findFirst({
    where: eq(shares.id, params.id),
  });

  if (!share) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ece6df",
            fontSize: "32px",
            color: "#1a1a1a",
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

  const cards = share.cards as CardData[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ece6df",
          padding: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: 0,
            bottom: 0,
            width: "1px",
            borderLeft: "1px dashed rgba(122, 122, 122, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "20px",
            top: 0,
            bottom: 0,
            width: "1px",
            borderLeft: "1px dashed rgba(122, 122, 122, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: 0,
            right: 0,
            height: "1px",
            borderTop: "1px dashed rgba(122, 122, 122, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: 0,
            right: 0,
            height: "1px",
            borderTop: "1px dashed rgba(122, 122, 122, 0.15)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: 600,
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              {share.title}
            </h1>
            {share.subtitle && (
              <p
                style={{
                  fontSize: "18px",
                  color: "#7a7a7a",
                  margin: 0,
                }}
              >
                {share.subtitle}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              maxWidth: "600px",
            }}
          >
            {cards.slice(0, 6).map((card) => (
              <div
                key={card.id}
                style={{
                  width: "160px",
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f4f0eb",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.label}
                      width={100}
                      height={100}
                      style={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#c4754b",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>✦</span>
                      <span>Claude</span>
                    </div>
                  )}
                </div>
                <span
                  style={{
                    paddingBottom: "16px",
                    fontSize: "13px",
                    color: "#888",
                  }}
                >
                  {card.label}
                </span>
              </div>
            ))}
          </div>

          <span
            style={{
              fontSize: "11px",
              color: "rgba(122, 122, 122, 0.4)",
              marginTop: "8px",
            }}
          >
            crafterstation.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
