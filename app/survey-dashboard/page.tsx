"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SurveyList from "@/components/survey/SurveyList";
import SurveyDetails from "@/components/survey/SurveyDetails";
import SurveyForm from "@/components/survey/SurveyForm";

export default function SurveyDashboardPage() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [activeTab, setActiveTab] = useState("assigned");
  // Show assigned surveys and also include forwarded/unassigned surveys (officerId === null)
  // Use sorted copies so we don't mutate original state
  const assignedSurveys = (surveys.filter((s: any) => s.status !== "Completed" && (s.officerId || s.officerId === null)) || []).slice()
  const unassignedSurveys = (surveys.filter((s: any) => s.officerId === null && s.status !== "Completed") || []).slice()
  const completedSurveys = (surveys.filter((s: any) => s.status === "Completed") || []).slice()

  useEffect(() => {
    fetch("/api/survey")
      .then((res) => res.json())
      .then((data) => {
        const list = (data.surveys || []).slice()
        list.sort((a: any, b: any) => {
          const at = a?.application?.created_at ? new Date(a.application.created_at).getTime() : 0
          const bt = b?.application?.created_at ? new Date(b.application.created_at).getTime() : 0
          return bt - at
        })
        setSurveys(list)
        if (list.length > 0) setSelectedSurvey(list[0])
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 flex items-stretch overflow-auto">
      {/* Decorative corner accent */}
      <div className="hidden md:block absolute top-6 right-6 w-40 h-40 bg-gradient-to-tr from-rose-100 via-yellow-100 to-indigo-100 opacity-60 rounded-xl blur-2xl pointer-events-none" />

      {/* Narrow left nav */}
      <aside className="w-64 bg-white/90 backdrop-blur border-r border-sky-100 shadow-lg flex flex-col py-8 px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-300 to-indigo-300 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-extrabold text-white">SD</span>
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-sky-700">Survey Dashboard</h2>
            <p className="text-xs text-gray-400">Officer panel • quick actions</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-col w-full space-y-3">
            <TabsTrigger value="assigned" className="w-full py-3 px-3 rounded-md flex items-center justify-between hover:bg-sky-50">
              <div className="flex items-center gap-2">
                <span className="text-sky-700 font-semibold">Assigned & Forwarded</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">{assignedSurveys.length}</span>
              </div>
            </TabsTrigger>
            <div className="px-2">
              <div className="text-xs text-gray-500">Unassigned: <span className="font-semibold text-amber-600">{unassignedSurveys.length}</span></div>
            </div>
            <TabsTrigger value="completed" className="w-full py-3 px-3 rounded-md flex items-center justify-between hover:bg-sky-50">
              <span className="text-sky-700 font-semibold">Completed Surveys</span>
              {completedSurveys.length > 0 && (
                <span className="ml-2 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">{completedSurveys.length}</span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-auto text-center text-xs text-gray-400">Tip: Click a request to view details • Use Refresh to reload</div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 md:p-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="assigned">
            <header className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 leading-tight">Survey Officer <span className="text-amber-600">· VIP</span></h1>
                <p className="text-sm text-gray-600 mt-1">Assigned to you and requests forwarded from admin appear here. Claim or pick up unassigned items.</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 rounded-full px-3 py-1 font-semibold shadow-sm">⭐ Priority</div>
                  <div className="text-sm text-gray-500">Newest first • Priority queue</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={() => {
                    fetch("/api/survey")
                      .then((res) => res.json())
                      .then((data) => {
                        const list = (data.surveys || []).slice()
                        list.sort((a: any, b: any) => {
                          const at = a?.application?.created_at ? new Date(a.application.created_at).getTime() : 0
                          const bt = b?.application?.created_at ? new Date(b.application.created_at).getTime() : 0
                          return bt - at
                        })
                        setSurveys(list)
                        if (list.length > 0) setSelectedSurvey(list[0])
                      })
                  }}
                >🔄 Refresh</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Queue list */}
              <div className="col-span-1">
                <div className="bg-white/95 p-4 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">Your Queue</h3>
                      <p className="text-xs text-gray-400">Newest first • {assignedSurveys.length} items</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {unassignedSurveys.length > 0 && (
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">{unassignedSurveys.length} unassigned</div>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-auto">
                    <SurveyList
                      surveys={assignedSurveys}
                      selectedSurvey={selectedSurvey}
                      onSelect={setSelectedSurvey}
                    />
                  </div>
                </div>
              </div>

              {/* Details (center) */}
              <div className="col-span-1 md:col-span-1 md:col-start-2">
                <div className="sticky top-20">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl border border-sky-50">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-200 to-sky-200 flex items-center justify-center text-sky-800 font-bold">👤</div>
                      <div className="flex-1">
                        <SurveyDetails survey={selectedSurvey} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions (right) */}
              <div className="col-span-1 md:col-span-1">
                <div className="sticky top-20 space-y-4">
                  <div className="bg-white p-5 rounded-2xl shadow-lg border">
                    <h4 className="font-semibold text-lg mb-3">Survey Actions</h4>
                    <SurveyForm survey={selectedSurvey} refresh={() => {
                      fetch("/api/survey")
                        .then((res) => res.json())
                        .then((data) => {
                          const list = (data.surveys || []).slice()
                          list.sort((a: any, b: any) => {
                            const at = a?.application?.created_at ? new Date(a.application.created_at).getTime() : 0
                            const bt = b?.application?.created_at ? new Date(b.application.created_at).getTime() : 0
                            return bt - at
                          })
                          setSurveys(list)
                          if (list.length > 0) setSelectedSurvey(list[0])
                        });
                    }} />
                  </div>
                  <div className="bg-gradient-to-r from-sky-50 to-rose-50 p-4 rounded-xl border border-dashed border-sky-100 text-sm text-gray-600">
                    <strong>Quick tips:</strong>
                    <ul className="list-disc ml-5 mt-2 text-xs">
                      <li>Use the queue to pick the newest items.</li>
                      <li>Attach photos when adding a report for faster processing.</li>
                      <li>Send items to admin if you need supervisor help.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-2">Completed Surveys</h1>
              <p className="text-gray-500">All surveys for which a report has been submitted.</p>
            </div>
            <div className="space-y-4">
              {completedSurveys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No completed surveys yet.</div>
              ) : (
                completedSurveys.map((survey: any) => (
                  <div key={survey.id} className="border rounded-xl p-4 bg-white/95 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{survey.application?.full_name || 'Applicant'}</h3>
                        <p className="text-gray-600 text-sm">CNIC: {survey.application?.cnic_number}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{new Date(survey?.application?.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Status:</span> <span className="bg-emerald-600 text-white px-2 py-1 rounded text-xs">{survey.status}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Recommendation:</span> {survey.recommendation || '-'}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Report:</span> {survey.report || '-'}
                    </div>
                    <div>
                      <span className="font-medium">Attachments:</span>
                      <ul className="list-disc ml-6">
                        {survey.attachments && survey.attachments.length > 0 ? survey.attachments.map((att: any, idx: number) => (
                          <li key={idx}><a href={att.url || att} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">{att.url || att}</a></li>
                        )) : <li>None</li>}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1 rounded text-sm font-semibold"
                        onClick={async () => {
                          const res = await fetch("/api/survey/send-to-admin", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ surveyId: survey.id })
                          });
                          if (res.ok) {
                            alert("Request sent to admin!");
                          } else {
                            alert("Failed to send to admin.");
                          }
                        }}
                      >
                        Send to Admin
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}