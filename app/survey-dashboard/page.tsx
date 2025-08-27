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
  // Only show assigned surveys in the assigned tab
  const assignedSurveys = surveys.filter((s: any) => s.officerId); // officerId assigned
  const completedSurveys = surveys.filter((s: any) => s.status === "Completed");

  useEffect(() => {
    fetch("/api/survey")
      .then((res) => res.json())
      .then((data) => {
        setSurveys(data.surveys || []);
        if (data.surveys && data.surveys.length > 0) {
          setSelectedSurvey(data.surveys[0]);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-stretch">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur border-r border-blue-100 shadow-lg flex flex-col items-center py-8 px-4">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center mb-2 shadow">
            <span className="text-3xl font-bold text-blue-700">SD</span>
          </div>
          <h2 className="font-extrabold text-xl text-blue-700 tracking-tight">Survey Dashboard</h2>
          <p className="text-xs text-gray-400 mt-1">Officer Panel</p>
        </div>
        <div className="w-full flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-col w-full">
              <TabsTrigger value="assigned" className="w-full py-2">Assigned Surveys</TabsTrigger>
              <TabsTrigger value="completed" className="w-full py-2 flex items-center justify-between">
                <span>Completed Surveys</span>
                {completedSurveys.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">{completedSurveys.length}</span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </aside>
      {/* Main Area */}
      <main className="flex-1 flex flex-col gap-8 p-8 md:p-16 bg-transparent">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="assigned">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-blue-800 mb-2 tracking-tight drop-shadow">Survey Application Details</h1>
              <p className="text-gray-500">View, review, and submit your assigned surveys here.</p>
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:gap-12">
              <div className="md:w-1/2">
                <SurveyList
                  surveys={assignedSurveys}
                  selectedSurvey={selectedSurvey}
                  onSelect={setSelectedSurvey}
                />
              </div>
              <div className="md:w-1/2">
                <SurveyDetails survey={selectedSurvey} />
                <SurveyForm survey={selectedSurvey} refresh={() => {
                  fetch("/api/survey")
                    .then((res) => res.json())
                    .then((data) => {
                      setSurveys(data.surveys || []);
                      if (data.surveys && data.surveys.length > 0) {
                        setSelectedSurvey(data.surveys[0]);
                      }
                    });
                }} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-green-800 mb-2 tracking-tight drop-shadow">Completed Surveys</h1>
              <p className="text-gray-500">All surveys for which a report has been submitted.</p>
            </div>
            <div className="space-y-4">
              {completedSurveys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No completed surveys yet.</div>
              ) : (
                completedSurveys.map((survey: any) => (
                  <div key={survey.id} className="border rounded-lg p-4 bg-white/80">
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg">{survey.application?.full_name || 'Applicant'}</h3>
                      <p className="text-gray-600 text-sm">CNIC: {survey.application?.cnic_number}</p>
                      <p className="text-gray-600 text-sm">Address: {survey.application?.address}</p>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Survey Status:</span> <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{survey.status}</span>
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
                          <li key={idx}><a href={att.url || att} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{att.url || att}</a></li>
                        )) : <li>None</li>}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-semibold"
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