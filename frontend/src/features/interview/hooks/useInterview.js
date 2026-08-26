import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReport,
  generateResumePdf,
} from "../services/interview.api";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);

    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

    return response.interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);

    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

    return response.interviewReport;
  };

  const getReports = async () => {
    setLoading(true);

    let response = null;
    try {
      response = await getAllInterviewReport();
      setReports(response.interviewReports);

      console.log("response.interviewReports", response.interviewReports);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

    return response.interviewReports;
  };

  const getResumePdf = async (interviewId) => {
    setLoading(true);
    let response = null;

    try {
      response = await generateResumePdf({ interviewId });
      console.log("response", response);
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
