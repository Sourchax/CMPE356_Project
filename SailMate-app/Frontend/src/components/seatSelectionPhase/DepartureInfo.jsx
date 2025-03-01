import React, { useState, useEffect, useRef } from "react";
import { User, GraduationCap, UserCheck } from "lucide-react"; // Import icons

const DepartureInfo = ({ departureDetails, passengerIndex, onPassengerChange, tripType, passengerType }) => {
  const isDeparture = tripType === "departure";
  const bgColor = isDeparture ? "bg-blue-800" : "bg-red-800";

  const [formData, setFormData] = useState({
    Name: "",
    Surname: "",
    Phone: "",
    BirthDate: "",
    Email: "",
  });

  const [errors, setErrors] = useState({
    Name: "",
    Surname: "",
    Phone: "",
    BirthDate: "",
    Email: "",
  });

  const prevIsValidRef = useRef();

  useEffect(() => {
    const isValid =
      Object.values(errors).every((err) => err === "") &&
      Object.values(formData).every((val) => val !== "");

    if (isValid !== prevIsValidRef.current) {
      prevIsValidRef.current = isValid;
      onPassengerChange(passengerIndex, "isValid", isValid);
    }
  }, [errors, formData, passengerIndex, onPassengerChange]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      validateInput(field, value);
      return newFormData;
    });

    onPassengerChange(passengerIndex, field, value);
  };

  const validateInput = (field, value) => {
    let error = "";
    switch (field) {
      case "Name":
      case "Surname":
        if (!value) error = `${field} is required`;
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = `${field} invalid entry`;
        break;
      case "Phone":
        if (!value) error = "Phone is required";
        else if (!/^\+?[1-9]\d{9,14}$/.test(value)) error = "Invalid phone number";
        break;
      case "BirthDate":
        if (!value) error = "Birth Date is required";
        else if (!/\d{4}-\d{2}-\d{2}/.test(value)) error = "Invalid date format. Use YYYY-MM-DD";
        else {
          const today = new Date();
          const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split("T")[0];
          const maxDate = today.toISOString().split("T")[0];

          if (value > maxDate) error = "Birth date cannot be in the future";
          else if (value < minDate) error = "Birth date cannot be older than 100 years";
        }
        break;
      case "Email":
        if (!value) error = "Email is required";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) error = "Invalid email address";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  // Function to select the icon based on passenger type
  const getPassengerIcon = (type) => {
    switch (type) {
      case "student":
        return <GraduationCap size={24} className="text-white" />;
      case "65+":
        return <UserCheck size={24} className="text-white" />; // Replaced with UserCheck
      default:
        return <User size={24} className="text-white" />;
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div className="flex items-center gap-3 text-gray-700">
        <div className={`${bgColor} text-white p-3 rounded-full`}>
          {getPassengerIcon(passengerType)} {/* Display the icon based on passengerType */}
        </div>
        <span className="font-medium text-lg">
          {(passengerIndex % departureDetails.passengerCount) + 1}. Passenger
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {["Name", "Surname", "Phone", "Email"].map((field) => (
          <div key={field} className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              {field} <span className="text-red-500">*</span>
            </label>
            <input
              type={field === "Email" ? "email" : "text"}
              placeholder={`Enter your ${field}`}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                errors[field] ? "border-red-500" : "border-gray-300"
              }`}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
            <div className="h-5 mt-1 text-sm text-red-500 transition-opacity duration-300">
              {errors[field] || ""}
            </div>
          </div>
        ))}

        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1">
            Birth Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
              errors["BirthDate"] ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.BirthDate}
            onChange={(e) => handleInputChange("BirthDate", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            min={new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
          />
          <div className="h-5 mt-1 text-sm text-red-500 transition-opacity duration-300">
            {errors["BirthDate"] || ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartureInfo;
