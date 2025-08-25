import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { FormContext } from "../context/FormContext";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormPage01() {
  const { formData, setFormData } = useContext(FormContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const validateForm = () => {
    return (
      formData.region &&
      formData.name &&
      formData.vorname &&
      emailRegex.test(formData.email) &&
      formData.cv
    );
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, cv: file });
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop native browser double-submit
    if (!isFormValid || isSending) return;

    setIsSending(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("region", formData.region);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("vorname", formData.vorname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("questions", formData.questions);

      if (formData.cv) {
        formDataToSend.append("cv", formData.cv, formData.cv.name);
      }

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className=" bg-[#F1F1F1] flex flex-col items-center justify-center p-4">
      {/* ... your back buttons + heading code stays unchanged ... */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full lg:w-auto items-center"
      >
        <div
          className="flex flex-col lg:flex-row justify-between items-center gap-[11px] w-full lg:w-[1027px] h-auto"
          style={{ opacity: 1 }}
        >
          {/* Region */}
          <div
            className="flex justify-between items-center w-[271px] lg:w-[200px] h-[75px] px-[13px] py-[17px] border rounded-lg bg-white"
            style={{
              border: "1px solid #B7B6BA",
              borderRadius: "8px",
            }}
          >
            <select
              className="w-full bg-transparent text-[#1C1B1D] font-metropolis text-[18px] leading-[26px] font-normal"
              value={formData.region || ""}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Region
              </option>
              <option>Kanton Aargau</option>
              <option>Kanton Appenzell Ausserrhoden</option>
              <option>Kanton Appenzell Innerrhoden</option>
              <option>Kanton Basel-Landschaft</option>
              <option>Kanton Basel-Stadt</option>
              <option>Kanton Bern</option>
              <option>Kanton Freiburg</option>
              <option>Kanton Genf</option>
              <option>Kanton Glarus</option>
              <option>Kanton Graubünden</option>
              <option>Kanton Jura</option>
              <option>Kanton Luzern</option>
              <option>Kanton Neuenburg</option>
              <option>Kanton Nidwalden</option>
              <option>Kanton Obwalden</option>
              <option>Kanton Schaffhausen</option>
              <option>Kanton Schwyz</option>
              <option>Kanton Solothurn</option>
              <option>Kanton St. Gallen</option>
              <option>Kanton Tessin</option>
              <option>Kanton Thurgau</option>
              <option>Kanton Uri</option>
              <option>Kanton Waadt</option>
              <option>Kanton Wallis</option>
              <option>Kanton Zug</option>
              <option>Kanton Zürich</option>
            </select>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            required
            className="w-[271px] lg:w-[200px]  h-[75px] px-[13px] py-[17px] border rounded-lg bg-white text-[#1C1B1D] font-metropolis text-[18px] leading-[26px] font-normal placeholder-[#1C1B1D]"
            style={{
              border: "1px solid #B7B6BA",
              borderRadius: "8px",
            }}
            value={formData.name || ""}
            onChange={(e) => {
              const onlyText = e.target.value.replace(/[0-9]/g, "");
              setFormData({ ...formData, name: onlyText });
            }}
          />

          <input
            type="text"
            placeholder="Vorname"
            required
            className="w-[271px] lg:w-[200px] h-[75px] px-[13px] py-[17px] border rounded-lg bg-white text-[#1C1B1D] font-metropolis text-[18px] leading-[26px] font-normal placeholder-[#1C1B1D]"
            style={{
              border: "1px solid #B7B6BA",
              borderRadius: "8px",
            }}
            value={formData.vorname || ""}
            onChange={(e) =>
              setFormData({ ...formData, vorname: e.target.value })
            }
          />

          {/* E-Mail */}
          <input
            type="email"
            placeholder="E-Mail"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            className="w-[271px] lg:w-[200px] h-[75px] px-[13px] py-[17px] border rounded-lg bg-white text-[#1C1B1D] font-metropolis text-[18px] leading-[26px] font-normal placeholder-[#1C1B1D]"
            style={{
              border: "1px solid #B7B6BA",
              borderRadius: "8px",
            }}
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <label htmlFor="cv-upload" className="cursor-pointer">
            <div
              className="flex flex-col justify-between items-start w-[271px] lg:w-[200px]  h-[75px] px-[13px] py-[17px] border rounded-lg bg-white"
              style={{
                border: "1px solid #B7B6BA",
                borderRadius: "8px",
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="cv-upload"
              />
              {formData.cv ? (
                <p className="text-[#1C1B1D] font-metropolis text-[14px] leading-[22px]">
                  {formData.cv.name}
                </p>
              ) : (
                <p className="text-[#1C1B1D] font-metropolis text-[18px] leading-[26px] font-normal">
                  Lebenslauf
                </p>
              )}
              <span className="text-[#1C1B1D] font-metropolis text-[10px] leading-[20px] font-normal">
                Zwingend
              </span>
            </div>
          </label>
        </div>

        <div className="container flex justify-center items-center mt-[50px]">
          {!isSubmitted ? (
            <button
              type="submit"
              disabled={isSending}
              className={`bg-[#04436F] text-[#F5F5F5] font-metropolis font-bold text-[24px] lg:text-[32px] leading-[21.6px] rounded-[8px] lg:rounded-full px-8 py-4 mb-[150px] ${
                isSending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSending ? "Wird gesendet..." : "Senden"}
            </button>
          ) : (
            <p className="text-[#04436F] font-metropolis font-[500] lg:font-[500] text-[24px] lg:text-[45px] leading-[26.2px] lg:leading-[50.2px] text-center mt-[40px] mb-[160px]">
              Vielen Dank - Wir melden uns so schnell wie möglich!
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

