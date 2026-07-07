import React, { useEffect, useState } from "react";
import { class11Subjects } from "../data/studyHubData";

const Analytics = () => {

  const [progressData, setProgressData] = useState({});


  useEffect(() => {

    const loadProgress = () => {

      const saved = localStorage.getItem("studyHub.subjects");

      if (saved) {
        setProgressData(JSON.parse(saved));
      }

    };


    loadProgress();

    window.addEventListener(
      "studyHubProgressUpdated",
      loadProgress
    );


    return () => {
      window.removeEventListener(
        "studyHubProgressUpdated",
        loadProgress
      );
    };

  }, []);



  const getSubjectProgress = (subjectName) => {

    const subject = class11Subjects.find(
      item => item.name === subjectName
    );


    if (!subject) return 0;


    const completed = subject.chapters.filter(
      chapter => progressData[`${subjectName}:${chapter}`]
    ).length;


    return subject.chapters.length
      ? Math.round(
          (completed / subject.chapters.length) * 100
        )
      : 0;

  };



  const subjects = [
    "Physics",
    "Chemistry",
    "Math",
    "Biology",
    "EVS",
    "English",
    "H.E",
    "Information Technology",
  ];



  const totalCompleted = Object.values(progressData)
    .filter(Boolean)
    .length;



  const totalChapters = class11Subjects.reduce(
    (sum, subject) =>
      sum + subject.chapters.length,
    0
  );


  const overallProgress = totalChapters
    ? Math.round(
        (totalCompleted / totalChapters) * 100
      )
    : 0;



  return (

    <div className="p-8 animate-fadeIn">


      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">
          Analytics 📊
        </h1>

        <p className="text-slytherin-600">
          Track your real study progress and performance
        </p>

      </div>



      {/* Overview Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">

          <p className="text-sm font-semibold text-slytherin-600">
            Completed Chapters
          </p>

          <p className="text-3xl font-bold text-slytherin-900 mt-2">
            {totalCompleted}
          </p>

        </div>



        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">

          <p className="text-sm font-semibold text-slytherin-600">
            Total Chapters
          </p>

          <p className="text-3xl font-bold text-slytherin-900 mt-2">
            {totalChapters}
          </p>

        </div>



        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">

          <p className="text-sm font-semibold text-slytherin-600">
            Overall Progress
          </p>

          <p className="text-3xl font-bold text-slytherin-900 mt-2">
            {overallProgress}%
          </p>

        </div>



        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">

          <p className="text-sm font-semibold text-slytherin-600">
            Study Status
          </p>

          <p className="text-xl font-bold text-slytherin-900 mt-3">
            {overallProgress > 50
              ? "Excellent 🔥"
              : "Keep Going ✨"}
          </p>

        </div>


      </div>




      {/* Subject Performance */}


      <div className="bg-white rounded-xl shadow-lg p-8">


        <h2 className="text-2xl font-bold text-slytherin-900 mb-6">
          Subject Performance 🏰
        </h2>



        <div className="space-y-5">


          {subjects.map(subject => {


            const progress =
              getSubjectProgress(subject);



            return (

              <div key={subject}>


                <div className="flex justify-between mb-2">

                  <p className="font-semibold text-slytherin-900">
                    {subject}
                  </p>


                  <p className="font-bold text-slytherin-600">
                    {progress}%
                  </p>


                </div>



                <div className="h-3 bg-slytherin-200 rounded-full overflow-hidden">


                  <div

                    className="h-full bg-gradient-to-r from-slytherin-600 to-slytherin-500"

                    style={{
                      width: `${progress}%`
                    }}

                  />


                </div>


              </div>

            );


          })}


        </div>


      </div>




      {/* Skills */}


      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">


        <h2 className="text-2xl font-bold text-slytherin-900 mb-6">
          Skill Growth 💻
        </h2>



        <div className="grid md:grid-cols-3 gap-5">


          {[
            "Coding",
            "AI",
            "Writing Skills",
            "Digital Editing",
            "Share Market"
          ].map(skill => (


            <div
              key={skill}
              className="p-5 rounded-xl bg-slate-50 shadow"
            >

              <h3 className="font-bold text-slytherin-900">
                {skill}
              </h3>


              <p className="text-slytherin-600 mt-2">
                Skill tracking coming soon ✨
              </p>


            </div>


          ))}


        </div>


      </div>


    </div>

  );

};


export default Analytics;