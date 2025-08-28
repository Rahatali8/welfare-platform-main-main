import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || authResult.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { requestId, status, rejectionReason } = await request.json()

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update request status and verification/forwarded flags
    let updateData: any = {
      status: status,
      rejection_reason: status === "rejected" ? rejectionReason : null,
      updated_at: new Date(),
      verification_complete: false,
      forwardedToSurvey: false,
    };
    if (status === "approved") {
      updateData.verification_complete = true;
      updateData.forwardedToSurvey = false;
    }
    if (status === "rejected") {
      updateData.verification_complete = false;
      updateData.forwardedToSurvey = false;
    }
    const updatedRequest = await db.request.update({
      where: { id: requestId },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      message: `Request ${status} successfully`,
      request: updatedRequest,
      updatedAt: updatedRequest.updated_at
    })

  } catch (error) {
    console.error("Error updating request status:", error)
    return NextResponse.json({ error: "Failed to update request status" }, { status: 500 })
  }
}
