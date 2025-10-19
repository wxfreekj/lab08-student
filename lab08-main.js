// Lab 8: Mid-Latitude Cyclones - Main JavaScript
// ESCI 240

document.addEventListener("DOMContentLoaded", function () {
  console.log("Lab 8: Mid-Latitude Cyclones initialized");

  // Initialize progress tracking
  initializeProgressTracking();

  // Initialize form export
  setupFormExport();

  // Initialize input validation
  initializeValidation();

  // Initialize collapsible headers (wire up click handlers)
  initializeCollapsibles();
});

function initializeCollapsibles() {
  const headers = document.querySelectorAll(".collapsible-header");
  headers.forEach((h) => {
    h.addEventListener("click", function () {
      toggleCollapsible(this);
    });
  });
}

function toggleCollapsible(header) {
  header.classList.toggle("is-collapsed");
  const content = header.nextElementSibling;
  if (content && content.classList.contains("collapsible-content")) {
    content.classList.toggle("is-collapsed");
  }
}

function initializeValidation() {
  // Q1: Station letter validation (A, B, C, or D)
  ["q1-col1", "q1-col2", "q1-col3", "q1-col4"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", function () {
        validateStationLetter(this);
      });
      input.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
      });
    }
  });

  // Q2, Q8: Temperature and pressure number validation
  const numberInputs = [
    "q2-pressure",
    "q6-temp-from",
    "q6-temp-to",
    "q6-dewpt-from",
    "q6-dewpt-to",
    "q8-temp-diff",
    "q8-dewpt-diff",
    "q11-from",
    "q11-to",
  ];
  numberInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", function () {
        validateNumberRange(this);
      });
    }
  });

  // Textarea validation
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.addEventListener("blur", function () {
      validateTextareaLength(this);
    });
  });
}

function validateStationLetter(input) {
  const value = input.value.trim().toUpperCase();
  const validLetters = ["A", "B", "C", "D"];

  if (!value) {
    clearValidationError(input);
    return true;
  }

  if (!validLetters.includes(value)) {
    showValidationError(input, "Please enter A, B, C, or D");
    return false;
  }

  clearValidationError(input);
  return true;
}

function validateNumberRange(input) {
  const value = parseFloat(input.value);
  const id = input.id;

  if (!input.value) {
    clearValidationError(input);
    return true;
  }

  if (isNaN(value)) {
    showValidationError(input, "Please enter a valid number");
    return false;
  }

  // Different ranges for different fields
  if (id.includes("temp")) {
    if (value < -100 || value > 150) {
      showValidationError(
        input,
        "Temperature should be between -100°F and 150°F"
      );
      return false;
    }
  } else if (id.includes("dewpt")) {
    if (value < -100 || value > 100) {
      showValidationError(
        input,
        "Dewpoint/dewpoint should changes be between -100°F and 100°F"
      );
      return false;
    }
  } else if (id === "q2-pressure") {
    if (value < 0 || value > 50) {
      showValidationError(input, "Pressure drop should be between 0 and 50 mb");
      return false;
    }
  } else if (id.includes("q11")) {
    if (value < 0 || value > 50) {
      showValidationError(input, "Value should be between 0 and 50");
      return false;
    }
  }

  clearValidationError(input);
  return true;
}

function validateTextareaLength(textarea) {
  const minLength = 20;
  const value = textarea.value.trim();

  if (!value) {
    clearValidationError(textarea);
    return true;
  }

  if (value.length < minLength) {
    showValidationError(
      textarea,
      `Please provide more detail (at least ${minLength} characters)`
    );
    return false;
  }

  clearValidationError(textarea);
  return true;
}

function showValidationError(input, message) {
  clearValidationError(input);

  input.style.borderColor = "#dc2626";
  input.style.backgroundColor = "#fef2f2";

  const errorDiv = document.createElement("div");
  errorDiv.className = "validation-error";
  errorDiv.style.color = "#dc2626";
  errorDiv.style.fontSize = "0.875rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = "⚠ " + message;

  input.parentElement.appendChild(errorDiv);
}

function clearValidationError(input) {
  input.style.borderColor = "";
  input.style.backgroundColor = "";

  const existingError = input.parentElement.querySelector(".validation-error");
  if (existingError) {
    existingError.remove();
  }
}

function validateAllInputs() {
  let isValid = true;
  const errors = [];

  // Validate station letters
  ["q1-col1", "q1-col2", "q1-col3", "q1-col4"].forEach((id) => {
    const input = document.getElementById(id);
    if (input && !validateStationLetter(input)) {
      isValid = false;
      errors.push("Station matching (Question 1)");
    }
  });

  // Validate numbers
  const numberInputs = [
    "q2-pressure",
    "q6-temp-from",
    "q6-temp-to",
    "q6-dewpt-from",
    "q6-dewpt-to",
    "q8-temp-diff",
    "q8-dewpt-diff",
    "q11-from",
    "q11-to",
  ];
  numberInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input && !validateNumberRange(input)) {
      isValid = false;
      errors.push(input.previousElementSibling?.textContent || id);
    }
  });

  // Validate textareas
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    if (!validateTextareaLength(textarea)) {
      isValid = false;
      errors.push(
        textarea.previousElementSibling?.textContent || "Explanation field"
      );
    }
  });

  return { isValid, errors };
}

function initializeProgressTracking() {
  const inputs = document.querySelectorAll("input, textarea, select");
  const progressBar = document.getElementById("progressBar");

  function updateProgress() {
    let filled = 0;
    inputs.forEach((input) => {
      if (input.value.trim() !== "") {
        filled++;
      }
    });

    const percentage = (filled / inputs.length) * 100;
    progressBar.style.width = percentage + "%";
  }

  inputs.forEach((input) => {
    input.addEventListener("input", updateProgress);
    input.addEventListener("change", updateProgress);
  });

  updateProgress();
}

function setupFormExport() {
  const exportBtn = document.getElementById("exportBtn");
  const exportStatus = document.getElementById("exportStatus");

  if (!exportBtn) {
    console.error("Export button not found");
    return;
  }

  exportBtn.addEventListener("click", function () {
    try {
      // Validate all inputs before exporting
      const validation = validateAllInputs();

      if (!validation.isValid) {
        exportStatus.innerHTML =
          "⚠️ Please fix validation errors before exporting:<br>" +
          validation.errors
            .slice(0, 5)
            .map((err) => "• " + err)
            .join("<br>");
        exportStatus.style.color = "#dc2626";

        const firstError = document.querySelector(
          '[style*="border-color: rgb(220, 38, 38)"]'
        );
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const formData = collectFormData();
      const textContent = formatAnswers(formData);
      downloadTextFile(textContent, "Lab08_MidLatitudeCyclones.txt");

      exportStatus.textContent = "✓ Lab answers exported successfully!";
      exportStatus.style.color = "#059669";

      setTimeout(() => {
        exportStatus.textContent = "";
      }, 5000);
    } catch (error) {
      console.error("Export error:", error);
      exportStatus.textContent = "✗ Error exporting answers. Please try again.";
      exportStatus.style.color = "#dc2626";
    }
  });
}

// Clear form function (used by Clear All Answers button)
function clearForm() {
  if (
    !confirm(
      "⚠️ Are you sure you want to clear all answers? This cannot be undone."
    )
  )
    return;

  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((el) => {
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else el.value = "";
  });

  // Clear validation errors and export status
  const errors = document.querySelectorAll(".validation-error");
  errors.forEach((e) => e.remove());
  const exportStatus = document.getElementById("exportStatus");
  if (exportStatus) exportStatus.textContent = "";

  // Reset progress bar
  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = "0%";

  alert("✅ All answers have been cleared.");
}

function collectFormData() {
  const formData = {
    studentName: "",
    labTitle: "Lab 8: Mid-Latitude Cyclones",
    totalPoints: 30,
    answers: {},
  };

  // Question 1: Station Matching (4 pts)
  formData.answers.q1 = {
    question: "Question 1: Station Matching (4 pts)",
    column1: document.getElementById("q1-col1")?.value || "",
    column2: document.getElementById("q1-col2")?.value || "",
    column3: document.getElementById("q1-col3")?.value || "",
    column4: document.getElementById("q1-col4")?.value || "",
  };

  // Question 2: Pressure Drop (2 pts)
  formData.answers.q2 = {
    question: "Question 2: Pressure Drop (2 pts)",
    pressureDrop: document.getElementById("q2-pressure")?.value || "",
  };

  // Question 3: Pressure Gradient Change (3 pts)
  formData.answers.q3 = {
    question: "Question 3: Pressure Gradient Change (3 pts)",
    gradientChange: document.getElementById("q3-gradient")?.value || "",
  };

  // Question 4: Wind Speed Response (3 pts)
  formData.answers.q4 = {
    question: "Question 4: Wind Speed Response (3 pts)",
    windResponse: document.getElementById("q4-wind")?.value || "",
  };

  // Question 5: Norwegian Cyclone Model (4 pts)
  formData.answers.q5 = {
    question: "Question 5: Norwegian Cyclone Model (4 pts)",
    modelMatch: document.getElementById("q5-model")?.value || "",
  };

  // Question 6: Maritime Tropical Air Mass (4 pts)
  formData.answers.q6 = {
    question: "Question 6: Maritime Tropical Air Mass (4 pts)",
    tempFrom: document.getElementById("q6-temp-from")?.value || "",
    tempTo: document.getElementById("q6-temp-to")?.value || "",
    dewptFrom: document.getElementById("q6-dewpt-from")?.value || "",
    dewptTo: document.getElementById("q6-dewpt-to")?.value || "",
  };

  // Question 7: Wind Direction in mT Air Mass (2 pts)
  formData.answers.q7 = {
    question: "Question 7: Wind Direction in mT Air Mass (2 pts)",
    windDirection: document.getElementById("q7-wind-dir")?.value || "",
  };

  // Question 8: Continental Polar Air Mass (2 pts)
  formData.answers.q8 = {
    question: "Question 8: Continental Polar Air Mass (2 pts)",
    tempDiff: document.getElementById("q8-temp-diff")?.value || "",
    dewptDiff: document.getElementById("q8-dewpt-diff")?.value || "",
  };

  // Question 9: Wind Differences Across Cold Front (2 pts)
  formData.answers.q9 = {
    question: "Question 9: Wind Differences Across Cold Front (2 pts)",
    windDiff: document.getElementById("q9-wind-diff")?.value || "",
  };

  // Question 10: Cold Front Passage (2 pts)
  formData.answers.q10 = {
    question: "Question 10: Cold Front Passage (2 pts)",
    month: document.getElementById("q10-month")?.value || "",
    day: document.getElementById("q10-day")?.value || "",
  };

  // Question 11: Wind Direction Change (2 pts)
  formData.answers.q11 = {
    question: "Question 11: Wind Direction Change (2 pts)",
    from: document.getElementById("q11-from")?.value || "",
    to: document.getElementById("q11-to")?.value || "",
  };

  return formData;
}

function formatAnswers(formData) {
  let text = "=".repeat(70) + "\n";
  text += "ESCI 240 - " + formData.labTitle + "\n";
  text += "Total Points: " + formData.totalPoints + "\n";
  text += "Submission Date: " + new Date().toLocaleString() + "\n";
  text += "=".repeat(70) + "\n\n";

  // Student Name
  text +=
    "Student Name: " + (formData.studentName || "[Enter your name]") + "\n";
  text += "=".repeat(70) + "\n\n";

  // Question 1
  text += formData.answers.q1.question + "\n";
  text += "-".repeat(70) + "\n";
  text += "Column 1 (leftmost): Station " + formData.answers.q1.column1 + "\n";
  text += "Column 2: Station " + formData.answers.q1.column2 + "\n";
  text += "Column 3: Station " + formData.answers.q1.column3 + "\n";
  text +=
    "Column 4 (rightmost): Station " + formData.answers.q1.column4 + "\n\n";

  // Question 2
  text += formData.answers.q2.question + "\n";
  text += "-".repeat(70) + "\n";
  text +=
    "Pressure drop: " + formData.answers.q2.pressureDrop + " millibars\n\n";

  // Question 3
  text += formData.answers.q3.question + "\n";
  text += "-".repeat(70) + "\n";
  text += formData.answers.q3.gradientChange + "\n\n";

  // Question 4
  text += formData.answers.q4.question + "\n";
  text += "-".repeat(70) + "\n";
  text += formData.answers.q4.windResponse + "\n\n";

  // Question 5
  text += formData.answers.q5.question + "\n";
  text += "-".repeat(70) + "\n";
  text += formData.answers.q5.modelMatch + "\n\n";

  // Question 6
  text += formData.answers.q6.question + "\n";
  text += "-".repeat(70) + "\n";
  text +=
    "Temperature range: " +
    formData.answers.q6.tempFrom +
    " to " +
    formData.answers.q6.tempTo +
    " degrees F\n";
  text +=
    "Dew point range: " +
    formData.answers.q6.dewptFrom +
    " to " +
    formData.answers.q6.dewptTo +
    " degrees F\n\n";

  // Question 7
  text += formData.answers.q7.question + "\n";
  text += "-".repeat(70) + "\n";
  text +=
    "Most common wind direction: " + formData.answers.q7.windDirection + "\n\n";

  // Question 8
  text += formData.answers.q8.question + "\n";
  text += "-".repeat(70) + "\n";
  text +=
    "Temperature difference: " +
    formData.answers.q8.tempDiff +
    " degrees lower\n";
  text +=
    "Dew point difference: " +
    formData.answers.q8.dewptDiff +
    " degrees lower\n\n";

  // Question 9
  text += formData.answers.q9.question + "\n";
  text += "-".repeat(70) + "\n";
  text += formData.answers.q9.windDiff + "\n\n";

  // Question 10
  text += formData.answers.q10.question + "\n";
  text += "-".repeat(70) + "\n";
  text +=
    "Cold front passage: " +
    formData.answers.q10.month +
    "/" +
    formData.answers.q10.day +
    "\n\n";

  // Question 11
  text += formData.answers.q11.question + "\n";
  text += "-".repeat(70) + "\n";
  text +=
    "Wind direction change: from " +
    formData.answers.q11.from +
    " to " +
    formData.answers.q11.to +
    "\n\n";

  text += "=".repeat(70) + "\n";
  text += "END OF LAB 8\n";
  text += "=".repeat(70) + "\n";

  return text;
}

function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
