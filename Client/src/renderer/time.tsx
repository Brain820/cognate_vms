import React, { useEffect } from 'react';
import { useMainStore } from "@/Stores/main.js";
import LayoutEditor from "@/Layouts/Editor";
import HeaderIndex from "@/Components/Frontend/Resume/Header/Index";
import QuestionAnswerIndex from "@/Pages/Frontend/Resume/Editor/QuestionAnswer/Index";

const ResumePage = ({ resume, user_question_answer }) => {
  const useMain = useMainStore();

  useEffect(() => {
    useMain.setResume(JSON.parse(JSON.stringify(resume.data)));
    console.log("onMount");

    const Config = {};
    Config.pixelsPerInch = 96;
    Config.pageHeightInCentimeter = 29.7;
    Config.pageMarginBottomInCentimeter = 2;
    applyPageBreaks();
    applyRealTimePageBrake();

    function applyPageBreaks() {
      console.log("Applying page breaks");
      applyAutomaticPageBreaks(
        Config.pixelsPerInch,
        Config.pageHeightInCentimeter,
        Config.pageMarginBottomInCentimeter
      );
    }

    function collectHTML() {
      // ... (same as in Vue.js code)
    }

    function createPage() {
      // ... (same as in Vue.js code)
    }

    function createBlock() {
      // ... (same as in Vue.js code)
    }

    function applyAutomaticPageBreaks(pixelsPerInch, pageHeightInCentimeter, pageMarginBottomInCentimeter) {
      // ... (same as in Vue.js code)
    }

    function applyRealTimePageBrake() {
      // ... (same as in Vue.js code)
    }

    function handleBlockHeightChange(height) {
      // ... (same as in Vue.js code)
    }
  }, [resume.data]);

  return (
    <LayoutEditor>
      <Head title="Resume" />
      <HeaderIndex uuid={resume.data.uuid} />

      <div id="resume-container">
        <div className="resume-page mt-24 mb-3 bg-white w-[249mm] mx-auto shadow-xl border-1 min-h-[297mm] p-10">
          {/* Components in React */}
          <BasicIntro selected={isSelected} basicIntro={resume.data.basic_information} />
          <Summary selected={isSelected} summary={resume.data.summary} />
          <Experience selected={isSelected} experiences={resume.data.work_experiences} />
          <Education selected={isSelected} educations={resume.data.educations} />
          <Certification selected={isSelected} certifications={resume.data.certifications} />
          <Skill selected={isSelected} skills={resume.data.categories} />
        </div>
      </div>

      {userRole === 'Administrator' && (
        <div>
          <QuestionAnswerIndex user_question_answer={user_question_answer.data} />
        </div>
      )}
    </LayoutEditor>
  );
};

export default ResumePage;
