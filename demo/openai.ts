import type { ChatCompletionTool, ChatModel } from "openai/resources";

// export const model: ChatModel = "gpt-4-1106-preview";
export const model: ChatModel = "gpt-3.5-turbo";

// Intentschema definition
export const intentSchema = {
  config: {
    database_lookup: {
      key_slot: "patient_dob",
      api_fields: [
        "insurance", "patient_dob", "gender", "symptoms", "previous_doctor_name",
        "last_visit_type", "date_of_last_visit", "sport", "body_part", "pain_type",
        "cause_type", "symptom_duration", "surgery_date", "procedure_type", "test_type"
      ]
    },
    dynamic_slot_handling: true
  },
  root_intent: "Patient with Unknown Status",
  leaf_intents: [
    "New Patient", "Recheck", "Review Diagnostics", "Injections"
  ],
  "intents": {
    "Patient with Unknown Status": {
      "slots": {
        "patient_name": {
          "source": "user",
          "type": "string",
          "validation": {
            "pattern": "^[A-Za-z ]{2,100}$",
            "error_message": "Name must be alphabetic, 2–100 characters."
          }
        },
        "patient_id": {
        "source": "user",
        "type": "string",
        "validation": {
        "pattern": "^[0-9]{1,10}$",
        "error_message": "Patient ID must be 1–10 digits."
        }
      },
        "patient_dob": {
          "source": "user",
          "type": "date",
          "validation": {
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "error_message": "DOB must be in YYYY-MM-DD format."
          }
        }
      },
      "children": {
        "New Patient": {
          "slots": {
            "insurance": {
              "source": "user",
              "type": "string",
              "validation": {
                "min_length": 2,
                "max_length": 50
              }
            },
            "symptoms": {
              "source": "user",
              "type": "string"
            },
            "sport": {
              "source": "user",
              "type": "string"
            },
            "body_part": {
              "source": "user",
              "type": "string"
            },
            "pain_type": {
              "source": "user",
              "type": "string"
            },
            "cause_type": {
              "source": "user",
              "type": "string"
            },
            "symptom_duration": {
              "source": "user",
              "type": "string",
              "validation": {
                "pattern": "^[0-9]+\\s*(day|week|month|year)s?$",
                "error_message": "Duration must be like '2 weeks', '1 month', etc."
              }
            }
          },
          "children": {}
        },
        "Returning Patient": {
          "slots": {
            "insurance": {
              "source": "api",
              "type": "string"
            },
            "patient_dob": {
              "source": "api",
              "type": "date"
            },
            "gender": {
              "source": "api",
              "type": "string"
            },
            "symptoms": {
              "source": "api",
              "type": "string"
            },
            "previous_doctor_name": {
              "source": "api",
              "type": "string"
            },
            "last_visit_type": {
              "source": "api",
              "type": "string"
            },
            "date_of_last_visit": {
              "source": "api",
              "type": "date"
            },
            "sport": {
              "source": "api",
              "type": "string"
            },
            "body_part": {
              "source": "api",
              "type": "string"
            },
            "pain_type": {
              "source": "api",
              "type": "string"
            },
            "cause_type": {
              "source": "api",
              "type": "string"
            },
            "symptom_duration": {
              "source": "api",
              "type": "string"
            },
            "reason_for_visit": {
              "source": "user",
              "type": "string"
            },
            "has_reports": {
              "source": "user",
              "type": "boolean",
              "validation": {
                "allowed_values": [true, false]
              }
            },
            "recheck_visit_flag": {
              "source": "user",
              "type": "boolean"
            },
          },
          "children": {
            "Recheck": {
              "slots": {
                "pain_intensity": {
                  "source": "user",
                  "type": "integer",
                  "validation": {
                    "min": 1,
                    "max": 10,
                    "error_message": "Pain intensity must be 1–10."
                  }
                },
                "same_body_part":{
                  "source": "user",
                  "type": "boolean"
                },
                "no_new_injury": {
                  "source": "user",
                  "type": "boolean",
                },
                "side_of_body": {
                    "source": "user",
                    "type": "string",
                    "validation": {
                      "allowed_values": ["Left", "Right"]
                    }
                },
                "last_visit_within_1_year": {
                    "source": "computed",
                    "type": "boolean",
                    "description": "date_of_last_visit ≥ (today − 1 year)"
                },
                "last_visit_within_6_months": {
                    "source": "computed",
                    "type": "boolean",
                    "description": "for work comp: date_of_last_visit ≥ (today − 6 months)"
                }
              },
              "children": {}
            },
            "Review Diagnostics": {
              "slots": {
                "test_type": {
                  "source": "user",
                  "type": "array",
                  "validation": {
                    "item_type": "string"
                  }
                },
                "test_date": {
                  "source": "user",
                  "type": "date"
                },
                "report_uploaded": {
                  "source": "user",
                  "type": "boolean"
                },
                "diagnostics_done_at_SPOC": {
                  "source": "user",
                  "type": "boolean",
                },
                "outside_facility_name": {
                    "source": "user",
                    "type": "string",
                    "description": "Name of outside facility",
                    "depends_on": {
                      "diagnostics_done_at_SPOC": false
                    }
                },
                "side_of_body": {
                    "source": "user",
                    "type": "string",
                    "validation": {
                      "allowed_values": ["Left", "Right"]
                    }
                },
                "date_of_service": {
                  "source": "user",
                  "type": "date"
                },
                "patient_hand_carry_cd": {
                  "source": "user",
                  "type": "boolean",
                  "description": "True if outside CD & report brought by patient"
                }
              },
              "children": {}
            },
            "Injections": {
              "slots": {},
              "children": {}
            }
          }
        }
      }
    }
  }
};

// Patient database
export const patientDb = [
  {
    patient_id: "13345",
    patient_dob: "2005-06-15",
    gender: "male",
    insurance: "HealthPlus",
    symptoms: "Chronic Pain",
    previous_doctor_name: "Dr. Schulz",
    last_visit_type: "New Patient",
    date_of_last_visit: "2025-03-15",
    sport: "Tennis",
    body_part: "Left Shoulder",
    pain_type: "Aching",
    cause_type: "Overuse",
    symptom_duration: "2 months",
    surgery_date: "2024-11-20",
    procedure_type: "Arthroscopy",
    test_type: "MRI"
  },
  {
    patient_id: "13346",
    patient_dob: "2000-01-10",
    gender: "male",
    insurance: "MediCare",
    symptoms: "Inflammation",
    previous_doctor_name: "Dr. Hill",
    last_visit_type: "New Patient",
    date_of_last_visit: "2025-04-28",
    sport: "Running",
    body_part: "Right Knee",
    pain_type: "Sharp",
    cause_type: "Injury",
    symptom_duration: "1 week",
    surgery_date: "2024-12-05",
    procedure_type: "Arthroscopy",
    test_type: "X-Ray"
  },
  {
    patient_id: "13347",
    patient_dob: "1990-11-28",
    gender: "female",
    insurance: "LifeSure",
    symptoms: "Pain and stiffness",
    previous_doctor_name: "Dr. Dunklin",
    last_visit_type: "New Patient",
    date_of_last_visit: "2025-05-05",
    sport: "Swimming",
    body_part: "Right Hip",
    pain_type: "Dull aching",
    cause_type: "Overuse",
    symptom_duration: "5 week",
    surgery_date: "2023-08-10",
    procedure_type: "Hip replacement",
    test_type: "MRI"
  }
];

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getCustomerProfile",
      description: "Get the profile of the customer who is calling",
      parameters: {},
    },
  },
];

// Core instructions for the medical assistant
export const instructions = `
## Medical Scheduling Assistant

### Role
You are an AI medical scheduling assistant helping patients book appointments. Your primary responsibilities are:
1. Collect necessary patient information through conversation.
2. Determine the appropriate appointment type based on patient data.
3. Recommend suitable doctors based on patient needs.
4. Provide clear, empathetic responses.

### Flow Guidelines

1. **Initial Contact**:
   - If the patient’s name is unknown, ask for their name.
   - If the name is known, greet the patient and ask for their Date of Birth (DOB).

2. **New Patient Flow**:
   - Collect: Insurance, Symptoms, Sport, Body Part, Pain Type, Cause, and Symptom Duration.
   - This information helps to determine the next appropriate question and appointment type.

3. **Returning Patient Flow**:
   - Collect: Reason for Visit, whether they have reports, and whether it's a recheck.
   - Depending on the response:
     - **If reports exist**, move to "Review Diagnostics".
     - **If it’s a recheck**, ask about pain intensity, side of the body, and symptoms.
     - **Otherwise**, proceed with "Injections".

4. **Dynamic Slot Handling**:
   - Some slots (like date of last visit) will automatically compute if the visit was within 1 year or 6 months. This will affect the questions asked.
   - If it’s been over 1 year and the visit is not urgent, ask for pain intensity or other specifics.

5. **Computed Slots**:
   - For returning patients, automatically compute whether the last visit was within 1 year and 6 months. If the last visit was longer than expected, ask the user if the symptoms have changed.

6. **Confirming Patient History**:
   - Use the gathered details to ask: "Are you here for the same symptoms you had last time?"
   - If the answer is no, collect new symptom details and describe the issue in detail.

7. **Appointment Recommendation**:
   - Once all necessary details are gathered, suggest an appropriate doctor based on the patient's symptoms, history, and requirements.
   - Provide doctor recommendations based on the patient’s visit type, such as general checkup, recheck, or injections.

8. **Finalization**:
   - Once the assistant has gathered all required information and the patient has chosen their preferred doctor, confirm the appointment.
   - Thank the patient for their time and close the conversation.

### Key Notes:
- Keep responses concise, empathetic, and respectful.
- Ensure all data is validated (e.g., date format, symptoms, etc.).
- Adapt dynamically to the patient’s responses, adjusting questions based on context.

### Flow Implementation Logic
- The assistant determines the next intent by looking at whether the patient is new or returning.
- Based on their responses, the assistant adapts questions accordingly.
- Each step of the flow has a corresponding check for whether a slot has already been filled, and if not, it will ask the next relevant question.
`;
