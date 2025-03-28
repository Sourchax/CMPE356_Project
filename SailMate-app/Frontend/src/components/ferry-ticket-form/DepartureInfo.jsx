import React, { useState, useEffect, useRef } from "react";
import { User, GraduationCap, UserCheck, Baby } from "lucide-react"; // Import icons

const DepartureInfo = ({ departureDetails, passengerIndex, onPassengerChange, tripType }) => {
  const isDeparture = tripType === "departure";
  const bgColor = isDeparture ? "bg-blue-800" : "bg-red-800";
  
  // Get the passenger type from departureDetails based on passengerIndex
  const passengerType = departureDetails.passengers[passengerIndex]?.PassengerType?.toLowerCase() || "adult";
  const isChild = passengerType === "child";

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

  // Update validation when passenger type changes
  useEffect(() => {
    if (formData.BirthDate) {
      validateInput("BirthDate", formData.BirthDate);
    }
  }, [passengerType]);

  useEffect(() => {
    // For child passenger type, we only validate Name, Surname, and BirthDate
    const requiredFields = isChild ? ['Name', 'Surname', 'BirthDate'] : 
      ['Name', 'Surname', 'Phone', 'BirthDate', 'Email'];
    
    const isValid =
      requiredFields.every(field => errors[field] === "") &&
      requiredFields.every(field => formData[field] !== "");

    if (isValid !== prevIsValidRef.current) {
      prevIsValidRef.current = isValid;
      onPassengerChange(passengerIndex, "isValid", isValid);
    }
  }, [errors, formData, passengerIndex, onPassengerChange, isChild]);

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
    
    // Check for spaces or tabs as standalone input
    if (/^\s+$/.test(value)) {
      error = `${field} cannot be empty or contain only spaces/tabs`;
    } else {
      switch (field) {
        case "Name":
        case "Surname":
          if (!value.trim()) error = `${field} is required`;
          else if (!/^[a-zA-Z\s]+$/.test(value.trim())) error = `${field} invalid entry`;
          break;
        case "Phone":
          if (!isChild) { // Skip validation for child
            if (!value.trim()) error = "Phone is required";
            else if (!/^\+?[1-9]\d{9,14}$/.test(value.trim())) error = "Invalid phone number";
          }
          break;
        case "BirthDate":
          if (!value.trim()) error = "Birth Date is required";
          else if (!/\d{4}-\d{2}-\d{2}/.test(value.trim())) error = "Invalid date format. Use YYYY-MM-DD";
          else {
            const today = new Date();
            const birthDate = new Date(value.trim());
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            
            const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
            
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split("T")[0];
            const maxDate = today.toISOString().split("T")[0];

            if (value.trim() > maxDate) {
              error = "Birth date cannot be in the future";
            } else if (value.trim() < minDate) {
              error = "Birth date cannot be older than 100 years";
            } else if (passengerType === "student") {
              if (adjustedAge > 25) {
                error = "Student passengers must be 25 years old or younger";
              } else if (adjustedAge < 10) {
                error = "Student passengers must be at least 10 years old";
              }
            } else if (passengerType === "senior" && adjustedAge < 65) {
              error = "Senior passengers must be 65 years old or older";
            } else if (passengerType === "adult" && adjustedAge < 20) {
              error = "Adult passengers must be 20 years old or older";
            } else if (passengerType === "child" && adjustedAge >= 8) {
              error = "Child passengers must be under 8 years old";
            }
          }
          break;
        case "Email":
          if (!isChild) { // Skip validation for child
            if (!value) {
              error = "Email is required";
            } else if (value !== value.trim()) {
              // Check specifically for leading or trailing spaces
              error = "Email cannot have leading or trailing spaces";
            } else if (/\s/.test(value)) {
              // Check for spaces anywhere in the email
              error = "Email cannot contain spaces";
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
              error = "Invalid email address";
            }
          }
          break;
        default:
          break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  // Function to select the icon based on passenger type
  const getPassengerIcon = (type) => {
    switch (type) {
      case "student":
        return <GraduationCap size={24} className="text-white" />;
      case "senior":
        return <UserCheck size={24} className="text-white" />;
      case "child":
        return <Baby size={24} className="text-white" />;
      default:
        return <User size={24} className="text-white" />;
    }
  };

  // Determine which fields to display based on passenger type
  const fieldsToShow = isChild ? ["Name", "Surname"] : ["Name", "Surname", "Phone", "Email"];

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div className="flex items-center gap-3 text-gray-700">
        <div className={`${bgColor} text-white p-3 rounded-full`}>
          {getPassengerIcon(passengerType)}
        </div>
        <span className="font-medium text-lg">
          {(passengerIndex % departureDetails.passengerCount) + 1}. Passenger - {passengerType.charAt(0).toUpperCase() + passengerType.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {fieldsToShow.map((field) => (
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
              onBlur={field === "Email" ? (e) => {
                // Additional check on blur specifically for email to catch any trailing spaces
                if (e.target.value !== e.target.value.trim()) {
                  handleInputChange(field, e.target.value);
                }
              } : undefined}
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
            min={new Date(new Date().getFullYear() - (passengerType === "child" ? 8 : 
                         passengerType === "student" ? 25 : 
                         passengerType === "senior" ? 100 : 100), 
                 new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
            max={passengerType === "child" ? 
                new Date().toISOString().split("T")[0] :
                passengerType === "student" ? 
                new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0] : 
                new Date(new Date().getFullYear() - (passengerType === "senior" ? 65 : 20), new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
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