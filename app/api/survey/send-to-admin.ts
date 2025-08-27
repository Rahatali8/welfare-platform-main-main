import { db } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";

export async function POST(request: Request) {
  // Authenticate user
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user || (auth.user.role !== "SURVEY_OFFICER" && auth.user.role !== "admin")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { surveyId } = await request.json();
  // Mark this survey as sent to admin (e.g., set a flag or update a field)
  const updatedSurvey = await db.survey.update({
    where: { id: surveyId },
    data: { sentToAdmin: true },
  });
  return new Response(JSON.stringify({ success: true, survey: updatedSurvey }), { status: 200 });
}
