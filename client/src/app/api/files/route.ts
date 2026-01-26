import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate the incoming data
        if (!data.title || !data.description) {
            return NextResponse.json(
                { error: "Title and description are required" },
                { status: 400 }
            );
        }

        const usePinata = process.env.NEXT_PUBLIC_USE_PINATA === 'true';

        if (usePinata) {
            const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
            if (!jwt) {
                console.error("Pinata JWT not found but NEXT_PUBLIC_USE_PINATA is true");
                return NextResponse.json(
                    { error: "Server configuration error: Pinata JWT missing" },
                    { status: 500 }
                );
            }

            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    pinataContent: data,
                    pinataMetadata: {
                        name: `tranche-raise-${Date.now()}`,
                    },
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Pinata upload failed:", errorData);
                return NextResponse.json(
                    { error: "Failed to upload to IPFS" },
                    { status: 500 }
                );
            }

            const pinataData = await res.json();
            return NextResponse.json({ ipfsHash: pinataData.IpfsHash }, { status: 200 });
        } else {
            // Mock IPFS storage (Local Filesystem)
            console.log("Using Mock IPFS storage");
            const content = JSON.stringify(data);
            const hash = crypto.createHash("sha256").update(content).digest("hex");
            const mockCID = `Qm${hash.substring(0, 44)}`;

            const uploadDir = path.join(process.cwd(), "public", "ipfs");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, `${mockCID}.json`);
            fs.writeFileSync(filePath, content);

            return NextResponse.json({ ipfsHash: mockCID }, { status: 200 });
        }

    } catch (e) {
        console.error("Error creating campaign metadata:", e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
