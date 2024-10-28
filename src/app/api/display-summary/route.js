// app/api/display-summary/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = "https://stacks.targetr.net/api/display-summary/full.csv";
    const params = {
      aggregation: "screen_and_item",
      startMillis: "1698442427000",
      endMillis: "1730090187000",
      type: "customId",
      id: "testLift",
    };

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from("api@omg.group:V041Digq").toString(
          "base64"
        )}`,
      },
      params,
    });

    const csvText = response.data;
    const rows = csvText.trim().split("\n");
    const headers = rows[0].split(",");

    const jsonData = rows.slice(1).map((row) => {
      const values = row.split(",");
      const obj = headers.reduce((acc, header, i) => {
        acc[header.trim()] = values[i]?.trim();
        return acc;
      }, {});
      return obj;
    });

    console.log("Data fetched and converted successfully:", jsonData);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error fetching display summary:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch display summary", details: error.message },
      { status: 500 }
    );
  }
}
