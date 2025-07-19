import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDasboard from "./AdminDashboard";
import AddExam from "./Addsubjects";
import AddCourses from "./AddCourses";
import Navbar from "./nav"; //
import HomePage from "./Homepage";
import RegistrationPage from "./SignUp";
import LoginPage from "./Login";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ContactPage from "./Contact";
import UpdatePassword from "./UpdatePassword";
import TestMode from "./Testmode";
import ExamMode from "./Exammode";
import ResetPasswordPage  from "./ResetPasswordPage";
import StudentDashboard from "./StudentDashboard";
import PdfUploader from "./UploadPdf";
import BuyPdf from "./BuyPast";
import  FaQs from "./Faq";
import ExamLandingPage from "./ExamLandingPage";
import SubjecAction from "./SubjectActions";
import EditQuestions from "./edit-questions";
import Exam from "./Exam"
import QuestionGeneratorwithAi from "./GenerateQuestions"
 
export default function App() {
  return (
    <Router>
      <div>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AdminDasboard" element={<AdminDasboard />} />
          <Route path="/AddExam" element={<AddExam />} />
          <Route path="/AddCourses" element={<AddCourses />} />
          <Route path="/RegistrationPage" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/ExamLandingPage" element={<ExamLandingPage />} />
          <Route path="/ContactPage" element={<ContactPage/>}/>
          <Route path="/UpdatePassword" element={<UpdatePassword/>}  />
          <Route path="/TestMode" element={<TestMode  />} />
<Route path="/StudentDashboard" element={<StudentDashboard  />}  />

<Route path="/PdfUploader" element={<PdfUploader />} />
<Route path="/BuyPdf" element={<BuyPdf />} />
<Route path="/FAQs" element={<FaQs />} />
<Route path="/SubjecAction" element={<SubjecAction />} /> 
<Route path="/edit-questions/:subjectId" element={<EditQuestions />} />
          <Route path="/ExamMode" element={<ExamMode  />} />
          <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
     
          <Route path="/ResetPasswordPage" element={<ResetPasswordPage  />} />
           <Route path="/QuestionGeneratorwithAi" element={<QuestionGeneratorwithAi/>}/>


<Route path="/exam/:exam_id" element={<Exam />} />
        </Routes>
      </div>
    </Router>
  );
}
