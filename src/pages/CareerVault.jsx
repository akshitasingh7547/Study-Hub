import React, { useState } from "react";

const CareerVault = () => {

  const [selectedCareer, setSelectedCareer] = useState(null);

  const careers = [
    {
      id: 1,
      title: "Quantitative Analyst",
      description: "ML + Finance",
      salary: "₹50-100 Lakh",
      roadmap: [
        "Learn Mathematics (Calculus, Probability, Statistics)",
        "Master Python Programming",
        "Learn Data Structures & Algorithms",
        "Study Machine Learning",
        "Learn Financial Markets",
        "Build Quantitative Finance Projects"
      ]
    },

    {
      id: 2,
      title: "AI Engineer",
      description: "Machine Learning & Deep Learning",
      salary: "₹40-80 Lakh",
      roadmap: [
        "Class 11-12: Strengthen Mathematics + Computer Science",
        "Learn Python Programming",
        "Learn C++ and Data Structures",
        "Study Machine Learning Fundamentals",
        "Learn Deep Learning & Neural Networks",
        "Work with AI Models and APIs",
        "Build AI Projects",
        "Create GitHub Portfolio",
        "Apply for AI Engineer Roles"
      ]
    }
  ];


  return (
    <div className="p-8 animate-fadeIn">


      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">
          Career Vault 🎯
        </h1>

        <p className="text-slytherin-600">
          Explore future career paths and build your roadmap
        </p>

      </div>



      {/* Career Cards */}

      {!selectedCareer && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {careers.map((career) => (

            <div
              key={career.id}
              className="bg-gradient-to-br from-slytherin-600 to-slytherin-800 rounded-xl shadow-lg p-6 text-white"
            >

              <h3 className="text-xl font-bold mb-2">
                {career.title}
              </h3>


              <p className="text-sm opacity-90 mb-4">
                {career.description}
              </p>



              <div className="mb-4 p-3 bg-white bg-opacity-10 rounded-lg">

                <p className="text-sm opacity-75">
                  Expected Salary
                </p>

                <p className="text-lg font-bold">
                  {career.salary}
                </p>

              </div>



              <button
                onClick={() => setSelectedCareer(career)}
                className="w-full px-4 py-2 bg-white text-slytherin-700 font-bold rounded-lg hover:bg-opacity-90 transition"
              >
                View Roadmap 🗺️
              </button>


            </div>

          ))}

        </div>

      )}



      {/* Roadmap */}

      {selectedCareer && (

        <div className="bg-white rounded-xl shadow-lg p-8">


          <button
            onClick={() => setSelectedCareer(null)}
            className="mb-6 px-4 py-2 bg-slytherin-700 text-white rounded-lg"
          >
            ← Back to Careers
          </button>



          <h2 className="text-3xl font-bold text-slytherin-900 mb-2">
            {selectedCareer.title} Roadmap 🏰
          </h2>


          <p className="text-slytherin-600 mb-8">
            Your journey from beginner to professional
          </p>



          <div className="space-y-4">

            {selectedCareer.roadmap.map((step, index) => (

              <div
                key={index}
                className="flex gap-4 items-center p-4 bg-slate-100 rounded-xl"
              >

                <div className="w-10 h-10 rounded-full bg-slytherin-700 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>


                <p className="font-semibold text-slytherin-900">
                  {step}
                </p>


              </div>

            ))}

          </div>


        </div>

      )}


    </div>
  );
};


export default CareerVault;